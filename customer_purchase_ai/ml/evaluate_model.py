from sklearn.metrics import f1_score, roc_auc_score, precision_score, recall_score, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import os

def evaluate_models(models, X_test, y_test, output_dir='../reports'):
    os.makedirs(output_dir, exist_ok=True)
    results = {}
    
    print("Evaluating models...")
    for name, model in models.items():
        y_pred = model.predict(X_test)
        
        # Check if the model has predict_proba
        if hasattr(model, 'predict_proba'):
            # Some models like LinearSVC might not have it by default
            y_prob = model.predict_proba(X_test)[:, 1]
            roc_auc = roc_auc_score(y_test, y_prob)
        else:
            roc_auc = 0.0 # Placeholder
        
        f1 = f1_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        
        results[name] = {
            'F1_score': f1,
            'ROC_AUC': roc_auc,
            'Precision': prec,
            'Recall': rec
        }
        print(f"[{name}] F1: {f1:.4f}, AUC: {roc_auc:.4f}")
        
    return results

def log_best_model(results, models):
    best_model_name = max(results, key=lambda x: results[x]['F1_score'])
    best_model = models[best_model_name]
    print(f"\nBest Model selected based on F1 Score: {best_model_name}")
    return best_model_name, best_model, results[best_model_name]

def plot_confusion_matrix(model, X_test, y_test, best_model_name, output_dir='../reports'):
    y_pred = model.predict(X_test)
    cm = confusion_matrix(y_test, y_pred)
    
    plt.figure(figsize=(6,5))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
    plt.title(f'Confusion Matrix - {best_model_name}')
    plt.ylabel('Actual')
    plt.xlabel('Predicted')
    plt.savefig(f"{output_dir}/confusion_matrix_{best_model_name}.png")
    plt.close()
