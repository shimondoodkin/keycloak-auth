import { createApp } from 'vue'
import App from './App.vue'
import ErrorPage from './ErrorPage.vue'

import './assets/main.css'

import {authInit,setOnRefreshTokenError,getKeycloak} from 'keycloak-auth'

try {
  await authInit({ 
    url: 'http://localhost:8080/', 
    realm: 'keycloak-demo', 
    clientId: 'app-vue',
    //  onLoad:'login-required',
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html' 
  });

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
    // authenticated successfuly

    setOnRefreshTokenError((error) => { // change callback to handle it
      alert("dispaly message you have been disconnected.\n"+error.message);
      window.location.reload();
    });

    // load application:	
    createApp(App).mount('#app');
  }
}
catch(e)
{
  // display error message
  console.error(e)
  createApp(ErrorPage,{
    title: 'Application initialization error:',
    message: e.message,
    returnUrl: '/',
  }).mount('#app');
}


