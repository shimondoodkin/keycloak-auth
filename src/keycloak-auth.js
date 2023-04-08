import Keycloak from 'keycloak-js';

// keycloak-js:
//   reference: https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter
//   source code: https://github.com/keycloak/keycloak/tree/main/js/libs/keycloak-js
//   npm pakcage: https://www.npmjs.com/package/keycloak-js

//
var keycloak=null;

export function getKeycloak(){
  return keycloak;
}

export var refreshTimer=null;
export var tokenRefreshTimer=null;
export var onRefreshTokenError=null;
export function setOnRefreshTokenError(val){onRefreshTokenError=val}
// async function authFetch(url,options)'
//
// same as window.fetch(url,options) with added Authorization header with token.
//
// example:
//
//    import {authFetch} from './keycloakAuth.js'
//    // authInit() // see authInit example
//    const result = await (await authFetch('http://api-gw/my-rest-api')).json()
//
export function authFetch(url,options={}) {
  if(!keycloak?.token)
      return Promise.reject( new Error('not authenticated yet. the code should call authInit function successfuly first'));

  if(!options.headers)options.headers={};
  options.headers['Authorization']= 'Bearer '+keycloak.token
  return fetch(url,options);
}

// async function authFetchJSON(url,options)
//
// example:
//
//    import {authFetchJSON} from './keycloakAuth.js'
//    // authInit() // see authInit example
//    const result = await authFetchJSON('http://api-gw/my-rest-api')
//
export async function authFetchJSON(url,options={}) {
  return await (await authFetch(url,options)).json()
}

// async function authFetchText(url,options)
//
// example:
//
//    import {authFetchText} from './keycloakAuth.js'
//    // authInit() // see authInit example
//    const result = await authFetchText('http://api-gw/my-rest-api')
//
export async function authFetchText(url,options={}) {
  return await (await authFetch(url,options)).text()
}

// callback for token refresh error, like you have been logged-out by the server
// 
// example:
//
// import {setOnRefreshTokenError} from './keycloakAuth.js'
// // authInit() // see authInit example
// setOnRefreshTokenError( (error) => { // change callback to handle it
//   alert("dispaly message you have been disconnected");
//   window.reload();
// });
//

// simple function to refresh the token
export async function refreshToken() {
  try {
    const refreshed=await keycloak.updateToken(70);
    if (refreshed)
      console.log('Authenication Token refreshed');

    // else
    //   console.log('Token not refreshed, still valid for ' + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');

    return refreshed;
  }
  catch(e) {

      if(e===undefined)e=new Error('');
      if(e.error) // keycloak-js has throws {"error":text} insted of Error object 
        e=new Error('Authentication problem, Failed to refresh authentication token. '+e.error);
      else if(e instanceof Error)
        e.message='Authentication problem, Failed to refresh authentication token. '+e.message;
      console.error(e);

      if(tokenRefreshTimer){
        clearTimeout(tokenRefreshTimer)
        tokenRefreshTimer=false;
      }
      if(onRefreshTokenError) 
        onRefreshTokenError(e);
      else
        throw e;
  };
}

// init keycloak authentication
//
// example:
//
//
// import {authInit,setOnRefreshTokenError,getKeycloak} from 'keycloak-auth'
//
// try {
//   await authInit({ 
//     url: 'http://localhost:8080/', 
//     realm: 'keycloak-demo', 
//     clientId: 'app-vue',
//     //  onLoad:'login-required',
//     onLoad: 'check-sso',
//     silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html' 
//   });
//
//   //optionally respont to authenticaation right away with  login
//   if(!getKeycloak().authenticated) 
//   {
//     // if authentication is failed,  try to re-authenticate. don't load the application.
//     //  
//     //   if onLoad:'login-required' is used then maybe refresh window.location.reload().
//     //   or call getKeycloak().login() 
//
//     console.log('not authorized')
//     getKeycloak().login()    
//
//   }
//   else
//   {
//     // authenticated successfuly, load the application
//
//     // add handler for refresh token error
//     setOnRefreshTokenError((error) => { 
//       // for example:
//       // alert("dispaly message you have been disconnected.\n"+error.message);
//       // window.location.reload();
//     });
//
//     // load application here
//     // for example
//     //  createApp(App).mount('#app');
//   }
// }
// catch(e)
// {
//   console.error(e)
//   // display error message
//   // for example
//   //  createApp(ErrorPage,{
//   //    title: 'Application initialization error:',
//   //    message: e.message,
//   //    returnUrl: '/',
//   //  }).mount('#app');
// }
//
//
// Silent SSO:
// To enable the silent check-sso, you have to provide a silentCheckSsoRedirectUri attribute in the init method. This URI needs to be a valid endpoint in the application (and of course it must be configured as a valid redirect for the client in the Keycloak Admin Console):
//   const authenticated=await authInit({ url: 'http://localhost:8080/', realm: 'keycloak-demo', clientId: 'app-vue',
//                                                     onLoad: 'check-sso',  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html' });
//
// The page at the silent check-sso redirect uri is loaded in the iframe after successfully checking your authentication state and retrieving the tokens from the Keycloak server. It has no other task than sending the received tokens to the main application and should only look like this:
// 
// <html>
// <body>
//     <script>
//         parent.postMessage(location.href, location.origin)
//     </script>
// </body>
// </html>

export async function authInit(initOptions={}) {
  // default options
  // if(!initOptions.onLoad)
  //  initOptions.onLoad='login-required';

  try {
    // init and expose keycloak as global
    if(window.keycloak)
    {
      throw new Error('keycloak authInit called multiple times');
    }

    keycloak = new Keycloak (initOptions);
    window.keycloak=keycloak ;
 
    const auth = await keycloak.init({ onLoad: initOptions.onLoad })
    if (!auth)
      return false;

    // setup token refreshing
    if(tokenRefreshTimer){
      clearTimeout(tokenRefreshTimer)
      tokenRefreshTimer=false;
    }
    tokenRefreshTimer=setInterval(refreshToken, 6000);

    return true;
  }
  catch(e) {
      if(e===undefined)e=new Error('');
      if(e.error) // keycloak-js has throws {"error":text} insted of Error object 
        e=new Error('Authentication problem. '+e.error);
      else if(e instanceof Error)
        e.message='Authentication problem. '+e.message;
      console.error(e);

      throw e;// new Error('Authentication problem',{options:{cause:e}});
  }
}

// clean up
export function cleanup(){
  if(tokenRefreshTimer){
    clearTimeout(tokenRefreshTimer)
    tokenRefreshTimer=false;
  }
 if(keycloak&&keycloak.clearToken)keycloak.clearToken();
 keycloak=null;
 window.keycloak=null;
 delete window.keycloak;
}




// in keycloak there are many useful functions
// see documentation:
//
// list of methods of keycloak instance:
//
//   keycloak.init(options) // redirects if onload is logins required 
//   keycloak.login(options) // redirects
//   keycloak.createLoginUrl(options)
//   keycloak.logout(options) // redirects
//   keycloak.createLogoutUrl(options)
//   keycloak.register(options) // redirects
//   keycloak.createRegisterUrl(options)
//   keycloak.accountManagement() // redirects
//   keycloak.createAccountUrl(options)
//   keycloak.hasRealmRole(role)
//   keycloak.hasResourceRole(role, resource)
//   keycloak.loadUserProfile()
//   keycloak.isTokenExpired(minValidity)
//   keycloak.updateToken(minValidity)
//   keycloak.clearToken()
//
//
// list of properties of keycloak instance:
//
//   keycloak.authenticated
//   keycloak.token
//   keycloak.tokenParsed
//   keycloak.subject
//   keycloak.idToken
//   keycloak.idTokenParsed
//   keycloak.realmAccess
//   keycloak.resourceAccess
//   keycloak.refreshToken
//   keycloak.refreshTokenParsed
//   keycloak.timeSkew
//   keycloak.responseMode
//   keycloak.flow
//   keycloak.adapter
//   keycloak.responseType
//