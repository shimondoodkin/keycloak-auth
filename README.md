# keycloack-auth

User frindly js library for authentication with Keycloak.


## ⭐️ Features

- async library
- basic login
- fetch with authorization header

## ✅ running the example:

- in file examples\run-krakend-docker.bat update full path.
- run run-krakend-docker.bat
- run run-keycloack-docker.bat
- run python3 server.py or node server.js
- run run-vue-app.bat or in folder: example\vue-app , run:  npm run dev
- configure keycloak like in images in example\config   , it is only key points., add a user for example call it user with create credencials-> password type password, uncheck a change password . for production need to setup keycloak with an external database maybe kerberos, currently it is with memory temporaray database.
- try login to http://localhost:8081

Written by Shimon Doodkin
