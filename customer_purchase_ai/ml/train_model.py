import os
import json
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from xgboost import XGBClassifier

from .data_preprocessing import load_data, perform_eda, clean_data
from .feature_engineering import engineer_features, scale_features
from .evaluate_model import evaluate_models, log_best_model, plot_confusion_matrix
from .utils import save_model, save_scaler

def train_pipeline():
    print("Starting Training Pipeline...")
    
    # Check if data exists, if not generate dummy
    if not os.path.exists('../data/hackathon_dataset.csv'):
        print("Data not found. Please run generate_dummy_data.py first.")
        return None

    # Step 1: Data Loading
    df = load_data('../data/hackathon_dataset.csv')
    
    # Step 2: EDA
    perform_eda(df)
    
    # Step 3: Data Cleaning
    df = clean_data(df)
    
    # Step 4: Feature Engineering
    df = engineer_features(df)
    
    # Split
    X = df.drop(columns=['high_value_purchase'])
    y = df['high_value_purchase']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale Features
    X_train_scaled, X_test_scaled, scaler = scale_features(X_train, X_test)
    
    # Step 5: Model Training
    models = {
        'Logistic Regression': LogisticRegression(random_state=42),
        'Random Forest': RandomForestClassifier(random_state=42),
        'Gradient Boosting': GradientBoostingClassifier(random_state=42),
        'XGBoost': XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42),
        'Support Vector Machine': SVC(probability=True, random_state=42)
    }
    
    print("Training classifiers...")
    for name, model in models.items():
        model.fit(X_train_scaled, y_train)
    
    # Step 6: Model Evaluation
    results = evaluate_models(models, X_test_scaled, y_test)
    best_name, best_model, best_metrics = log_best_model(results, models)
    
    # Plot best model CM
    plot_confusion_matrix(best_model, X_test_scaled, y_test, best_name)
    
    # Step 7: Save Model
    save_model(best_model, '../models/best_model.pkl')
    save_scaler(scaler, '../models/scaler.pkl')

    # Save metrics to a file for API tracking
    best_metrics['model'] = best_name
    os.makedirs('../reports', exist_ok=True)
    with open('../reports/best_metrics.json', 'w') as f:
        json.dump(best_metrics, f)

    return best_metrics

if __name__ == "__main__":
    train_pipeline()
