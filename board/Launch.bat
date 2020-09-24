echo off
set directiory = %cd%
echo %directiory%
for /f "delims=" %%i in ('node -v') do set output=%%i
if "!output!" EQU " " (
    cd package
    call node-v12.18.4-x64.msi
    cd ..
    echo Installed
) else (
    echo Installed
)
if exist package-lock.json (
    echo dependencies already installed
) else (
    echo installing dependencies
    call npm i
)
call clear
start npm start
start "" http://localhost:3001