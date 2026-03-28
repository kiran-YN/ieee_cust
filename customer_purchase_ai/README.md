# AI Customer Purchase Predictor

An end-to-end full-stack AI-powered web platform that predicts whether a customer will make a high-value purchase. This repository contains the Machine Learning pipelines, a FastAPI scalable backend, and an ultra-modern React interface built with Tailwind CSS.

## Project Architecture
- **Frontend:** React, Vite, Tailwind CSS, Chart.js, Axios
- **Backend:** FastAPI, Uvicorn, Python
- **Machine Learning:** Scikit-learn, XGBoost, Pandas, Numpy

---

## 🚀 Quick Setup & Installation

### Option 1: Run with Docker Compose (Recommended)
You can bring up the entire stack using Docker:

```bash
docker-compose up --build
```
*Frontend will run on port `5173` and Backend on `8000`.*

### Option 2: Run Locally (Manual)

#### 1. Setup Data & Backend Machine Learning
Open a terminal in the project root:

```powershell
cd customer_purchase_ai
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

pip install -r backend/requirements.txt

# Generate Dummy Dataset for initial training
python ml/generate_dummy_data.py

# Run FastAPI Server
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```
*The backend should now be running at `http://localhost:8000`.*

#### 2. Setup Frontend
Open a NEW terminal in the `frontend` directory:

```powershell
cd customer_purchase_ai/frontend
npm install
npm run dev
```
*Frontend will run at `http://localhost:5173`.*

---

## 🔥 Usage

1. Open `http://localhost:5173` in your browser.
2. In the **Prediction Portal**, you can enter customer demographics (Age, Income, Past Purchases) to classify purchase likelihood.
3. If no model is trained, click **Retrain Machine Learning Model** at the bottom of the page. This triggers the FastAPI backend to run the full Data Cleaning -> Feature Engineering -> Model Building pipeline.
4. Go to the **Analytics Dashboard** to see the comparative charts on which classification algorithm was chosen and its respective F1, Precision, Recall metrics!
