import pandas as pd
from sklearn.preprocessing import StandardScaler

def engineer_features(df):
    print("Engineering features...")
    
    # Safely apply Hackathon bonus features ONLY if their metric dependencies exist in the uploaded CSV
    if 'past_purchases' in df.columns and 'days_since_last_purchase' in df.columns:
        df['purchase_frequency'] = df['past_purchases'] / (df['days_since_last_purchase'] + 1)
        
    if 'income' in df.columns and 'past_purchases' in df.columns:
        df['avg_purchase_value'] = (df['income'] * 0.01) / (df['past_purchases'] + 1)
        
    if 'website_visits' in df.columns and 'past_purchases' in df.columns:
        df['engagement_score'] = df['website_visits'] * 2 + df['past_purchases'] * 5
        
    # CRITICAL: ENCODE ALL CATEGORICAL STRING COLUMNS (e.g. 'Platinum', 'Gold', 'Male', 'Female')
    cat_cols = df.select_dtypes(include=['object', 'category']).columns
    if len(cat_cols) > 0:
        print(f"Encoding categorical parameters into float logic: {list(cat_cols)}")
        df = pd.get_dummies(df, columns=cat_cols, drop_first=True)
        
        # In modern pandas, get_dummies builds Booleans. We strictly format them to int64 for Scikit-Learn.
        for col in df.select_dtypes(include=['bool']).columns:
            df[col] = df[col].astype(int)
            
    return df

def scale_features(X_train, X_test):
    print("Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Re-wrap into DataFrame matrix mappings
    X_train_scaled = pd.DataFrame(X_train_scaled, columns=X_train.columns)
    X_test_scaled = pd.DataFrame(X_test_scaled, columns=X_test.columns)
    
    return X_train_scaled, X_test_scaled, scaler
