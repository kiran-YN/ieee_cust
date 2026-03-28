import os
import joblib

def save_model(model, filepath):
    directory = os.path.dirname(filepath)
    if directory and not os.path.exists(directory):
        os.makedirs(directory)
    joblib.dump(model, filepath)
    print(f"Saved model to {filepath}")

def load_model(filepath):
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Model file {filepath} not found.")
    return joblib.load(filepath)

def save_scaler(scaler, filepath):
    directory = os.path.dirname(filepath)
    if directory and not os.path.exists(directory):
        os.makedirs(directory)
    joblib.dump(scaler, filepath)
    print(f"Saved scaler to {filepath}")

def load_scaler(filepath):
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Scaler file {filepath} not found.")
    return joblib.load(filepath)
