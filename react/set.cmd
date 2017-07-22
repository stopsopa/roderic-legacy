@echo off

for /f "tokens=*" %%a in ('echo %cd%\public') do set NODE_PATH=%%a

public\.bin\webpack --config webpack.config.js --progress --watch