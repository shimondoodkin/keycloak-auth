# gettings started configuring keycloak

in this tutoreial I will only cover how to overcome cors and content security policy issues.

after starting keycloak each time need to configure the Realm
the demo runs with temporary in memory database. for your production server need to install a production installaction of keycloak with some security and presistence, like with a database or user federation.


first if keycloak is accessed throught a reverse proxy. need to configure its external url.
in Realm settings> Frontend URL, this url is how keyclock server is accessed from the frontend application.
![](config1.png)


need to configure web application urls.
in Clients, create a client of OpenID type,  

In editing a client settings> Acceess Settings:
 - Root URL: website url with slash at end
 - valid redirect URIs: website url with /* at end
 - Web origins(CORS): protocol and website domain without slash at end. - to allow accessing keycloack server from websites with this origin.
![](config2.png)


Each Client is a "login screen client". and each logins creen has a client id. need to make sure the client does not require an api key secret to use the key cloak oauth api, it was previously ly called "Public" mode.

In editing a client settings> Capability config:
 - Client authentication: select "Off" to allow Public access, (the "on" setting is ued by server side applications. it requires clientid and a secret to login)
 - Direct access grants: checked, to allow to generate Oauth2 tokens
![](config3.png)

Realm settings>Security defenses>Content-Security-Policy
add to frame-ancestors only hostname, without http(s):// and slash at end.

```text
frame-src 'self'; frame-ancestors 'self' localhost:8081; object-src 'none';
```
![](config4.png)

there are some useful valus that will help configure KrakenD authentication validation.

in Realm settings> Endpoints

there is a link "OpenID endpoint configuration".
it is a link to json file.

it is possible to find there  (JWT)Json Web Token. issuer name to validate issuer name in KrakenD, and the "certs" url to to configure token signature validation in KrakenD
![](config5.png)


Next task is to create a user for the example,

Users-> create
type user in username
in credencials tab> create password
type user in passsword
uncheck temporary password

Next steps could be to enable user registration.
and more customization
