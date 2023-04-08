# gettings started configuring keycloak


optional:
Realm settings> Frontend URL, is how keyclock server is accessed from the frontend app, useful if it is accessed from a reverse proxy.
![](config1.png)

in Clients, create a client of OpenID type,  

In editing a client settings> Acceess Settings:
 - Root URL: website url with slash at end
 - valid redirect URIs: website url with /* at end
 - Web origins: protocol and website domain without slash at end. 
![](config2.png)

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

how to find useful settings of the authentication realm endpoint.
in Realm settings> Endpoints

there is a link to json of OpenID endpoint configuration.
it is a link to json with a few useful values to use in other apps that validate (JWT)Json WEb Tokens, for krakend tok.
like waht is the issuer name,
and what s

![](config5.png)


next task is to create a user
