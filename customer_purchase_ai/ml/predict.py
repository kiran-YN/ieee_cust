import numpy as pd
import pandas as pd
from .utils import load_model, load_scaler
import os

def load_inference_artifacts():
    model = load_model('../models/best_model.pkl')
    scaler = load_scaler('../models/scaler.pkl')
    return model, scaler

def predict_purchase(input_data: dict):
    model, scaler = load_inference_artifacts()
    
    # Input example: 
    # {'age': 35, 'income': 50000, 'website_visits': 10, 'past_purchases': 3, 'days_since_last_purchase': 20}
    
    df = pd.DataFrame([input_data])
    
    # Feature engineering steps
    df['purchase_frequency'] = df['past_purchases'] / (df['days_since_last_purchase'] + 1)
    df['avg_purchase_value'] = (df['income'] * 0.01) / (df['past_purchases'] + 1)
    df['engagement_score'] = df['website_visits'] * 2 + df['past_purchases'] * 5
    
    # Scale
    features_scaled = scaler.transform(df)
    
    # Predict
    prediction = model.predict(features_scaled)[0]
    probability = float(model.predict_proba(features_scaled)[0][1])
    
    return int(prediction), probability
