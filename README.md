# GeoFusion AI 🌍🏙️
### Building Height Estimation via SAR & Optical Imagery Fusion

![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)
![PyTorch](https://img.shields.io/badge/AI_Engine-PyTorch-EE4C2C?style=for-the-badge&logo=pytorch)
![Three.js](https://img.shields.io/badge/3D_Modeling-Three.js-black?style=for-the-badge&logo=three.js)

**GeoFusion AI** is an advanced deep-learning pipeline and interactive dashboard designed to estimate urban building heights from space. By fusing **Synthetic Aperture Radar (SAR)** imagery with standard **Optical (RGB)** satellite photography, the model successfully predicts physical elevation even in poor weather or cloudy conditions.

---

## ✨ Key Features
- **Dual-Modality AI Fusion:** Uses a custom PyTorch architecture featuring a dual-encoder (`ResNet-18` for SAR, `ResNet-50` for RGB) to extract and concatenate geospatial features.
- **Robust against Weather:** Uses Radar data (SpaceNet 6 dataset) to penetrate cloud cover, ensuring accurate predictions where standard optical imagery fails.
- **Interactive 3D WebGL Dashboard:** Features a stunning React-Three-Fiber frontend that automatically generates a 3D, explorable block-city based on the AI's height predictions.
- **Real-Time Metrics:** Fast API backend serves sub-second predictions and generates real-time accuracy metrics (MAE, RMSE, R²).

---

## 🧠 System Architecture
*For a detailed, non-technical breakdown of how this works, see our [Workflow Guide](Architecture/work_flow.txt).*

1. **Input:** Takes `.tif` radar, `.tif` optical, and `.geojson` ground truth polygons.
2. **Preprocessing:** Normalizes sensor data and converts vector polygons into heatmap arrays via GeoPandas.
3. **AI Inference:** Data flows through the `HeightFusionModel` (PyTorch) to regress final height values.
4. **Visualization:** The FastAPI server sends the JSON payload and Base64 images to the Vite frontend for 2D/3D rendering.

Check out our [Detailed System Architecture Diagram](Architecture/system_architecture.md).

---

## 🚀 Getting Started

### Prerequisites
You will need **Python 3.10+** and **Node.js (npm)** installed on your machine.

### 1. Backend Setup (FastAPI & PyTorch)
Navigate to the root directory and activate your Python environment:
```bash
# Create and activate virtual environment
python3 -m venv myenv
source myenv/bin/activate  # On Windows use: myenv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn torch torchvision rasterio geopandas opencv-python numpy
```

Start the backend server:
```bash
cd "backend/main backend"
uvicorn api:app --reload
```
*The API will be available at `http://localhost:8000`*

### 2. Frontend Setup (React + Vite)
Open a new terminal and navigate to the frontend folder:
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
*The Dashboard will be available at `http://localhost:5173`*

---

## 🏋️ Model Training
If you wish to retrain the model on the SpaceNet 6 dataset from scratch:
1. Place your dataset inside `dataset/SpaceNet_20_Samples`.
2. Run the provided training script:
```bash
cd script
python train.py
```
*Trained weights will automatically be saved to `encode/final_height_predictor.pth`.*

---


