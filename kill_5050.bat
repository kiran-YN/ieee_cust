@echo off
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :5050') DO taskkill /F /T /PID %%T
