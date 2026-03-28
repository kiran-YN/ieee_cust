@echo off
cd frontend
call npm install
call npm run build

cd ../backend
echo Installing Backend Requirements...
call py -m pip install -r requirements.txt

echo Starting Application...
call py -m uvicorn main:app --host 0.0.0.0 --port 5050 --reload
