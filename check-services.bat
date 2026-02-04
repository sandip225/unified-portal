@echo off
echo RPA Government Portal Service Status:
echo =====================================
sc query RPA-Backend
echo.
sc query RPA-Frontend
echo.
echo Testing endpoints...
curl -s http://localhost:8000/health
echo.
curl -s http://localhost
echo.
pause