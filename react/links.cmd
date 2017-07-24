
rem relative path to linked
SET "LINKED=..\public_html\linked"

rem relative path of react directory form within linked directory
SET "PUBLICWEBPACK=..\..\react"

SET SCRIPT=%0

rmdir /s/q %LINKED%

mkdir %LINKED%

rem jumb to linked directory
cd %LINKED%

if exist "%PUBLICWEBPACK%\%SCRIPT%" (

    mklink /D public "%PUBLICWEBPACK%\public"
    mklink /D example ..\..\dir-to-link

    rem other dir for react
    rem mklink /D rassets "%PUBLICWEBPACK%\app\react\assets"
) else (
    echo fix PUBLICWEBPACK path
)

rem return to start directory
cd %PUBLICWEBPACK%


