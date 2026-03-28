import pandas as pd
from sklearn.impute import SimpleImputer
import matplotlib.pyplot as plt
import seaborn as sns
import os

def load_data(filepath='../data/hackathon_dataset.csv'):
    print(f"Loading data from {filepath}")
    return pd.read_csv(filepath)

def perform_eda(df, output_dir='../reports'):
    os.makedirs(output_dir, exist_ok=True)
    
    # Only try to plot target distribution if the column exists
    target_col = 'high_value_purchase'
    if target_col in df.columns:
        plt.figure()
        sns.countplot(data=df, x=target_col)
        plt.title('Target Variable Distribution')
        plt.savefig(f"{output_dir}/target_distribution.png")
    
    # Correlation heatmap (only across numeric columns)
    numeric_df = df.select_dtypes(include=['number'])
    plt.figure(figsize=(10,8))
    sns.heatmap(numeric_df.corr(), annot=True, cmap='coolwarm', fmt=".2f")
    plt.title('Correlation Heatmap')
    plt.savefig(f"{output_dir}/correlation_heatmap.png")
    plt.close('all')
    print("EDA charts saved to reports folder.")

def clean_data(df):
    print("Cleaning data...")
    # Drop exact duplicates
    df = df.drop_duplicates()
    
    # Handle missing values for ALL numeric columns automatically
    numeric_cols = df.select_dtypes(include=['number']).columns
    if len(numeric_cols) > 0:
        imputer = SimpleImputer(strategy='median')
        df[numeric_cols] = imputer.fit_transform(df[numeric_cols])
        
    # Handle missing values for ALL categorical/string columns automatically
    cat_cols = df.select_dtypes(include=['object', 'category']).columns
    if len(cat_cols) > 0:
        cat_imputer = SimpleImputer(strategy='most_frequent')
        df[cat_cols] = cat_imputer.fit_transform(df[cat_cols])
    
    return df
