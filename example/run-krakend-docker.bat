SET CURRENT_FOLDER_NAME=%~dp0
SET CURRENT_FOLDER_NAME=%CURRENT_FOLDER_NAME:~0,-1%
docker run --rm -it -p "8082:8080" --add-host host.docker.internal:host-gateway -v %CURRENT_FOLDER_NAME%\krakend.json:/etc/krakend/krakend.json devopsfaith/krakend