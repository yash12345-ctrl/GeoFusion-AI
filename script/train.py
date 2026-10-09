import os
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torchvision.models import resnet18, resnet50
import rasterio
import geopandas as gpd
import numpy as np
import cv2

# --- DATASET LOADER ---
class SpaceNet6Dataset(Dataset):
    def __init__(self, data_folder):
        self.data_folder = data_folder
        all_files = os.listdir(data_folder)
        # Find unique tile IDs from the geojson files
        self.tiles = sorted(list(set([f.split('_')[1].split('.')[0] for f in all_files if f.startswith('geo_')])))
        print(f"Found {len(self.tiles)} tiles for training.")
        
    def __len__(self):
        return len(self.tiles)
        
    def __getitem__(self, idx):
        tid = self.tiles[idx]
        sar_p = os.path.join(self.data_folder, f"sar_{tid}.tif")
        rgb_p = os.path.join(self.data_folder, f"rgb_{tid}.tif")
        geo_p = os.path.join(self.data_folder, f"geo_{tid}.geojson")
        
        # Load and Preprocess SAR (Radar)
        with rasterio.open(sar_p) as s:
            sar_img = s.read()
            sar_img = np.nan_to_num(sar_img, nan=0.0).transpose(1, 2, 0)
            sar_img = cv2.resize(sar_img, (224, 224))
            p2, p98 = np.percentile(sar_img, (2, 98))
            sar_img = np.clip((sar_img - p2) / (p98 - p2 + 1e-8), 0, 1)
            sar_tensor = torch.from_numpy(sar_img.transpose(2, 0, 1)).float()
            
        # Load and Preprocess Optical (RGB)
        with rasterio.open(rgb_p) as r:
            rgb_img = r.read([1, 2, 3])
            rgb_img = np.nan_to_num(rgb_img, nan=0.0).transpose(1, 2, 0)
            rgb_img = cv2.resize(rgb_img, (224, 224)) / 255.0
            rgb_tensor = torch.from_numpy(rgb_img.transpose(2, 0, 1)).float()
            
        # Load Target Height from GeoJSON
        actual_h = 0.0
        if os.path.exists(geo_p):
            gdf = gpd.read_file(geo_p)
            if 'roof_075mean' in gdf.columns:
                valid = gdf[gdf['roof_075mean'] > 0]
                if not valid.empty:
                    actual_h = valid['roof_075mean'].mean()
                    
        return sar_tensor, rgb_tensor, torch.tensor([float(actual_h)])

# --- MODEL ARCHITECTURE ---
class SpaceNet6ResNet(nn.Module):
    def __init__(self):
        super().__init__()
        # Load ResNet18 without pre-trained weights for custom 4-channel input
        self.backbone = resnet18(weights=None)
        # Modify the first conv layer to accept 4 channels (SAR)
        self.backbone.conv1 = nn.Conv2d(4, 64, kernel_size=7, stride=2, padding=3, bias=False)
        self.backbone.fc = nn.Identity() 
        
    def forward(self, x): 
        return self.backbone(x)

class HeightFusionModel(nn.Module):
    def __init__(self, sar_backbone, opt_backbone):
        super().__init__()
        self.sar_encoder = sar_backbone
        self.opt_encoder = opt_backbone
        
        # Remove final classification layer from Optical backbone
        if hasattr(self.opt_encoder, 'fc'): 
            self.opt_encoder.fc = nn.Identity()
        
        # Combined Feature Dimension: ResNet18 (512) + ResNet50 (2048) = 2560
        self.regressor = nn.Sequential(
            nn.Linear(2560, 1024), 
            nn.BatchNorm1d(1024), 
            nn.ReLU(), 
            nn.Dropout(0.3), 
            nn.Linear(1024, 512), 
            nn.ReLU(), 
            nn.Linear(512, 1) # Predict single height value
        )
        
    def forward(self, sar_x, opt_x):
        f_sar = torch.flatten(self.sar_encoder(sar_x), 1)
        f_opt = torch.flatten(self.opt_encoder(opt_x), 1)
        # Concatenate features and pass to regressor
        return self.regressor(torch.cat((f_sar, f_opt), dim=1))


# --- TRAINING LOOP ---
def train_model():
    data_dir = "../dataset/SpaceNet_20_Samples"
    
    if not os.path.exists(data_dir):
        print(f"Error: Dataset not found at {data_dir}")
        return
        
    dataset = SpaceNet6Dataset(data_dir)
    dataloader = DataLoader(dataset, batch_size=4, shuffle=True)
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
    # Initialize complete fusion model
    model = HeightFusionModel(SpaceNet6ResNet().backbone, resnet50(weights=None)).to(device)
    
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)
    criterion = nn.MSELoss() # Mean Squared Error for height regression
    
    epochs = 20
    print("Starting training...")
    
    for epoch in range(epochs):
        model.train()
        total_loss = 0
        
        for sar, rgb, target in dataloader:
            sar, rgb, target = sar.to(device), rgb.to(device), target.to(device)
            
            optimizer.zero_grad()
            preds = model(sar, rgb)
            loss = criterion(preds, target)
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
            
        avg_loss = total_loss / len(dataloader)
        print(f"Epoch {epoch+1}/{epochs} | Avg MSE Loss: {avg_loss:.4f} | RMSE: {np.sqrt(avg_loss):.4f}")
        
    # Save the trained weights
    save_dir = "../encode"
    os.makedirs(save_dir, exist_ok=True)
    save_path = os.path.join(save_dir, "final_height_predictor.pth")
    torch.save(model.state_dict(), save_path)
    print(f"✅ Training complete! Model weights saved to {save_path}")

if __name__ == "__main__":
    train_model()
