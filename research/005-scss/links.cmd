@echo off

rem relative path to linked
SET "LINKED=..\..\public_html\research\005-scss\linked"

rem relative path of react directory form within linked directory
SET "PUBLICWEBPACK=..\..\..\..\research\005-scss"

SET SCRIPT=%0

rmdir /s/q %LINKED%

mkdir %LINKED%

rem jumb to linked directory
cd %LINKED%

if exist "%PUBLICWEBPACK%\%SCRIPT%" (

    mklink /D public "%PUBLICWEBPACK%"

    rem other dir for react
    mklink /D rassets "%PUBLICWEBPACK%\app\react\assets"
    mklink /D example "%PUBLICWEBPACK%\app\dir-to-link"
    mklink /D app "%PUBLICWEBPACK%\app"
) else (
    echo fix PUBLICWEBPACK path
)

rem return to start directory
cd %PUBLICWEBPACK%

cd app
    mklink /D example "dir-to-link"
cd ..


