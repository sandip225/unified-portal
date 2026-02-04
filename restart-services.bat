@echo off
echo Restarting RPA Government Portal Services...
net stop RPA-Frontend
net stop RPA-Backend
timeout /t 5 /nobreak
net start RPA-Backend
net start RPA-Frontend
echo Services restarted!
pause