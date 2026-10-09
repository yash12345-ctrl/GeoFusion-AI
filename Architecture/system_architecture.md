# GeoFusion AI - How It Works

This document explains how our GeoFusion AI project takes satellite images and predicts building heights in a way that is easy to understand.

## Simple Block Diagram

```mermaid
flowchart TD
    subgraph Step 1: Taking Input (The Data)
        SAR[Satellite Radar Images\n(Can see through clouds)]
        RGB[Normal Color Images\n(Standard photos)]
        GEO[Actual City Maps\n(Used to check if our AI is right)]
    end

    subgraph Step 2: The Brain (Behind-the-Scenes Server)
        direction TB
        PREP[Cleaning & Resizing the Images]
        
        SAR --> PREP
        RGB --> PREP
        
        subgraph The AI Model
            ENC_SAR[Radar Brain\n(Finds shapes & edges)]
            ENC_RGB[Color Brain\n(Finds visual details)]
            CONCAT[Combining the Clues\n(Putting both brains together)]
            MLP[Final Decision Maker\n(Guesses the final building height)]
            
            PREP --> ENC_SAR
            PREP --> ENC_RGB
            ENC_SAR --> CONCAT
            ENC_RGB --> CONCAT
            CONCAT --> MLP
        end
        
        GEO_PROC[Converting the Map into a Height Heatmap]
        GEO --> GEO_PROC
        
        MLP --> B_OUT[Server Output\n- AI's Guessed Height\n- Actual True Height\n- Display Images]
        GEO_PROC --> B_OUT
    end

    subgraph Step 3: The User Website (What You See)
        direction TB
        API_CALL[Website asks the server for the results]
        
        B_OUT -.-> |Sends Data| API_CALL
        
        UI_DASH[2D Dashboard\n(Shows the images and how accurate the AI was)]
        UI_3D[Interactive 3D Map\n(Generates a playable 3D model of the city)]
        
        API_CALL --> UI_DASH
        API_CALL --> UI_3D
    end

    %% Styling
    classDef input fill:#e1f5fe,stroke:#0288d1,stroke-width:2px;
    classDef model fill:#f3e5f5,stroke:#8e24aa,stroke-width:2px;
    classDef frontend fill:#e8f5e9,stroke:#388e3c,stroke-width:2px;
    
    class SAR,RGB,GEO input;
    class ENC_SAR,ENC_RGB,CONCAT,MLP model;
    class UI_DASH,UI_3D frontend;
```

## How the System Works (In Plain English)
1. **The Inputs:** The system looks at two types of satellite pictures of a city: normal color photos and radar images (which can see the ground even if it's cloudy). It also looks at a real map to know the true answers.
2. **Cleaning the Data:** Before the AI can look at the images, the server cleans them up, adjusts their brightness, and cuts them to the perfect size.
3. **The AI Brain:** The AI acts like two detectives working together. One detective looks closely at the radar image, and the other looks at the color photo. They bring their clues together to make a highly educated guess about exactly how tall the buildings are.
4. **The User Website:** Finally, the server sends these guesses to the website. The website takes this information and shows you the original pictures, a score of how accurate the AI was, and even builds an interactive 3D model of the city that you can look around in!
