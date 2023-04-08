# keycloack-js-util

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
  const authenticated=await authInit({ url: 'http://localhost:8080/', realm: 'keycloak-demo', clientId: 'app-vue',
                                                    onLoad: 'check-sso',  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html' });

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

data = await authFetchText('http://localhost:8082/v1/test.txt')
data = await authFetchJSON('http://localhost:8082/v1/test.json')
 
const result = await authFetch('http://localhost:8082/v1/test')
data = await result.json()

```



in keycloak there are many useful functions, see documentation:

```javascript
// keycloak-js:
//   reference: https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter
//   source code of keycloak-js: https://github.com/keycloak/keycloak/tree/main/js/libs/keycloak-js
//   npm pakcage: https://www.npmjs.com/package/keycloak-js
```

list of methods of keycloak instance:

```javascript
  keycloak.init(options) // redirects if onload is logins required 
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
