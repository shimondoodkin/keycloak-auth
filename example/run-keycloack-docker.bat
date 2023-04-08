docker run --rm -it -p "8080:8080" -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin --add-host host.docker.internal:host-gateway quay.io/keycloak/keycloak:21.0.2 start-dev

:: did not work
:: -e KEYCLOAK_IMPORT=/tmp/realm-export.json -v C:\Users\user\Documents\projects\kerberos\keycloak\realm-export.json:/tmp/realm-export.json