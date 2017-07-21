@echo off

rem relative path to linked
SET "LINKED=..\..\public_html\research\005-scss\linked"

rem relative path of react directory form within linked directory
SET "DIRRELATIVE=..\..\..\..\research\005-scss"

SET SCRIPT=%0

rmdir /s/q %LINKED%

mkdir %LINKED%

rem jumb to linked directory
cd %LINKED%

if exist "%DIRRELATIVE%\%SCRIPT%" (
    mklink /D example "%DIRRELATIVE%\dir-to-link"
    mklink /D assets "%DIRRELATIVE%\app\react\assets"
) else (
    echo fix DIRRELATIVE path
)

rem return to start directory
cd %DIRRELATIVE%
