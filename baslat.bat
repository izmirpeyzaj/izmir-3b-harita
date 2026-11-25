@echo off
rem Haritayi yerel sunucuda acar. Python kurulu olmalidir.
cd /d "%~dp0"
start "" http://localhost:8765
python -m http.server 8765
