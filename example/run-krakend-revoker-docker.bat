SET CURRENT_FOLDER_NAME=%~dp0
SET CURRENT_FOLDER_NAME=%CURRENT_FOLDER_NAME:~0,-1%

:: basic non-scalable revoker https://github.com/krakendio/playground-community/tree/master/images/jwt-revoker
:: my fork is at https://github.com/shimondoodkin/KrakenD-playground-community/blob/master/images/jwt-revoker/

docker run --rm -it -p "8083:8080" --add-host host.docker.internal:host-gateway doodkin/jwt-revoker ./jwt-revoker -key jti -port 8080 -server host.docker.internal:8034
