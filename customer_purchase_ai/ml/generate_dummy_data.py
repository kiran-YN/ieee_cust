import pandas as pd
import numpy as np
import os

def generate_data(num_samples=1000):
    np.random.seed(42)
    
    age = np.random.randint(18, 70, size=num_samples)
    income = np.random.normal(60000, 20000, size=num_samples)
    income = np.clip(income, 20000, 200000)
    website_visits = np.random.randint(0, 50, size=num_samples)
    past_purchases = np.random.randint(0, 20, size=num_samples)
    days_since_last_purchase = np.random.randint(1, 365, size=num_samples)
    
    # Introduce some missing values and outliers for cleaning purposes
    idx_missing = np.random.choice(num_samples, size=int(0.05 * num_samples), replace=False)
    income[idx_missing] = np.nan
    
    # Generate target based on features with some noise
    score = (income / 100000) * 0.4 + (past_purchases / 20) * 0.4 + (website_visits / 50) * 0.2
    probabilities = 1 / (1 + np.exp(-(score - 0.5) * 10)) # Sigmoid-like mapping
    
    high_value_purchase = (probabilities + np.random.normal(0, 0.1, size=num_samples) > 0.6).astype(int)
    
    df = pd.DataFrame({
        'age': age,
        'income': income,
        'website_visits': website_visits,
        'past_purchases': past_purchases,
        'days_since_last_purchase': days_since_last_purchase,
        'high_value_purchase': high_value_purchase
    })
    
    # Add a few duplicates
    df = pd.concat([df, df.sample(20)], ignore_index=True)
    
    os.makedirs('../data', exist_ok=True)
    df.to_csv('../data/hackathon_dataset.csv', index=False)
    print("Generated dummy dataset at ../data/hackathon_dataset.csv")

if __name__ == '__main__':
    generate_data()
