SET CURRENT_FOLDER_NAME=%~dp0
SET CURRENT_FOLDER_NAME=%CURRENT_FOLDER_NAME:~0,-1%
docker run --rm -it -p "8080:8080" -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin --add-host host.docker.internal:host-gateway -v %CURRENT_FOLDER_NAME%\keycloak-data:/opt/keycloak/data quay.io/keycloak/keycloak:21.0.2 start-dev