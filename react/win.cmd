@echo off

set "WEBPACK_MODE=%1"

for /f "tokens=*" %%a in ('echo %cd%\%2') do set NODE_PATH=%%a

%2\.bin\webpack --config webpack.config.js --progress --watch