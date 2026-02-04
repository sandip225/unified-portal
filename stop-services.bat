@echo off
echo Stopping RPA Government Portal Services...
net stop RPA-Frontend
net stop RPA-Backend
echo Services stopped!
pause