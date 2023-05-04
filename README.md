# keycloack-js-util

User frindly js library for authentication with Keycloak.

```
npm install keycloak-js-util
```

## ⭐️ Features

- async library
- basic login
- easy to use async fetch wrappers that add authorization bearer token header
- tested
- Correct keyclock CORS and CSP(content security policy) configuration: 
  https://github.com/shimondoodkin/keycloak-js-util/tree/master/example/config
- Correct krakend (CORS) configuration:
  https://github.com/shimondoodkin/keycloak-js-util/blob/master/example/krakend.json
  

## 🗒 notes

- The documentation for keycloak-js is at:
  https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter

- The reference for keycloak-js is at:
  https://www.keycloak.org/docs/latest/securing_apps/index.html#javascript-adapter-reference

## 🗒 notes about the revoker

- My modified simple revoker is at:
  https://github.com/shimondoodkin/KrakenD-playground-community/blob/master/images/jwt-revoker/main.go#L38
 - I have added the addheader method. the idea was simply by calling the url it would revoke the token. The propogate claims gives the jti header to the revoker.
 - The krakend configuration for revoker is at: https://github.com/shimondoodkin/keycloak-js-util/blob/master/example/krakend.json#L56
 - The simple revoker has minor problems: https://github.com/shimondoodkin/KrakenD-playground-community/blob/master/images/jwt-revoker/usage.md#problems

## ✅ running the example:

there is an example at https://github.com/shimondoodkin/keycloak-js-util/tree/master/example
- you need to have doker installed.
- git clone https://github.com/shimondoodkin/keycloak-js-util.git
- in the example folder:
- run all bat files:
  - run-krakend-docker.bat
  - run-keycloack-docker.bat
  - run-server.bat or python3 server.py or node server.js
  - run-vue-app.bat or enter folder: example\vue-app and run:  npm run dev
  - run-krakend-revoker-docker.bat - run it after krakend already started
- configure keycloak like described in https://github.com/shimondoodkin/keycloak-js-util/tree/master/example/config ( describes how to overcome CORS and content security policy issues with keycloak) open key cloak at  http://localhost:8080
- try login to http://localhost:8081

##   Example 1

```javascript

import {authInit,setOnRefreshTokenError,getKeycloak} from 'keycloak-js-util'

try {
  await authInit({ 
    url: 'http://localhost:8080/', 
    realm: 'keycloak-demo', 
    clientId: 'app-vue',
    //  onLoad:'login-required',
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html' 
  });

  //optionally respont to authenticaation right away with  login
  if(!getKeycloak().authenticated) 
  {
    // if authentication is failed,  try to re-authenticate. don't load the application.
    //  
    //   if onLoad:'login-required' is used then maybe refresh window.location.reload().
    //   or call getKeycloak().login() 

    console.log('not authorized')
    getKeycloak().login()    

  }
  else
  {
    // authenticated successfuly, load the application

    // add handler for refresh token error
    setOnRefreshTokenError((error) => { 
      // for example:
      // alert("dispaly message you have been disconnected.\n"+error.message);
      // window.location.reload();
    });

    // load application here
    // for example
    //  createApp(App).mount('#app');
  }
}
catch(e)
{
  console.error(e)
  // display error message
  // for example
  //  createApp(ErrorPage,{
  //    title: 'Application initialization error:',
  //    message: e.message,
  //    returnUrl: '/',
  //  }).mount('#app');
}
```



Silent SSO:
To enable the silent check-sso, you have to provide a silentCheckSsoRedirectUri attribute in the init method. This URI needs to be a valid endpoint in the application (and of course it must be configured as a valid redirect for the client in the Keycloak Admin Console):
```javascript
  const authenticated=await authInit({
        url: 'http://localhost:8080/',
        realm: 'keycloak-demo', clientId: 'app-vue',
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html' });
```

The page at the silent check-sso redirect uri is loaded in the iframe after successfully checking your authentication state and retrieving the tokens from the Keycloak server. It has no other task than sending the received tokens to the main application and should only look like this:

```html
<html>
<body>
    <script>
        parent.postMessage(location.href, location.origin)
    </script>
</body>
</html>
```





##   Example 2

```javascript


import {authFetchText,authFetchJSON,authFetch} from 'keycloak-js-util'

const data = await authFetchText('http://localhost:8082/v1/test.txt')
const data = await authFetchJSON('http://localhost:8082/v1/test.json')
const data = await authFetchBlob('http://localhost:8082/v1/test.jpg')


const response = await authFetch('http://localhost:8082/v1/test')
if(!response.ok)
  throw new Error('Http status code='+response.code)
const data = await response.json()

```


##   Example 3 - revoke and logout

```javascript

    async revokeLogout() {
      stopTokenRefreshTimer();
      await authFetchText('http://localhost:8082/v1/jwt-revoke')
      window.keycloak.logout();
    }
```
    
## in keycloak-js there are many useful functions, see documentation:
like ` await window.keycloak.loadUserProfile() ` 

https://github.com/shimondoodkin/keycloak-js-util/blob/master/example/vue-app/src/components/KeycloakExample.vue#L110

```javascript
// keycloak-js:
//   reference: https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter
//   source code of keycloak-js: https://github.com/keycloak/keycloak/tree/main/js/libs/keycloak-js
//   npm pakcage: https://www.npmjs.com/package/keycloak-js
```

list of methods of keycloak instance:

```javascript
  keycloak.init(options) // redirects if onLoad:'login-required'
  keycloak.login(options) // redirects
  keycloak.createLoginUrl(options)
  keycloak.logout(options) // redirects
  keycloak.createLogoutUrl(options)
  keycloak.register(options) // redirects
  keycloak.createRegisterUrl(options)
  keycloak.accountManagement() // redirects
  keycloak.createAccountUrl(options)
  keycloak.hasRealmRole(role)
  keycloak.hasResourceRole(role, resource)
  keycloak.loadUserProfile()
  keycloak.isTokenExpired(minValidity)
  keycloak.updateToken(minValidity)
  keycloak.clearToken()
```

list of properties of keycloak instance:
```javascript
  keycloak.authenticated
  keycloak.token
  keycloak.tokenParsed
  keycloak.subject
  keycloak.idToken
  keycloak.idTokenParsed
  keycloak.realmAccess
  keycloak.resourceAccess
  keycloak.refreshToken
  keycloak.refreshTokenParsed
  keycloak.timeSkew
  keycloak.responseMode
  keycloak.flow
  keycloak.adapter
  keycloak.responseType
```

Written by Shimon Doodkin
