
linux && mac

    export NODE_PATH="$(pwd)/public"
    yarn install --modules-folder=public
    
    .
    
windows
    
    for /f "tokens=*" %a in ('echo %cd%\public') do @set NODE_PATH=%a
    echo %NODE_PATH%
    yarn install --modules-folder=public
    
    .
    
    