# How to Limit Keycloak to 1 Session Per User

1.  Select your app Realm.

## Create authentication flow with User session count limiter

2.  Go to the Authentication section of your Keycloak realm.
3.  Duplicate the default "browser" authentication flow by clicking on the "[...]" button next to it and click "Duplicate".
4.  Give it a meaningful name, (e.g. "browser2").
5.  Enter to the copy of the flow (e.g. "browser2") and add a new execution step by clicking on the "[add step]" button (or [+] button).
6.  Search for "limit" and select the "User session count limiter" execution.
7.  Drag the "User session count limiter" execution to be right after (below) the login form "Username Password Form".
8.  Click Settings (⚙ Gear symbol) of "User session count limiter".
9.  Change the alias to something meaningful, such as "Limit sessions to 1".
10.  Set the maximum user sessions to 1.
11.  Select "Terminate oldest sessions" as the behavior when the user session limit is exceeded.

## Configure client to use the authentication flow

12.  Go to the Clients section of your Keycloak realm and select your client.
13.  In the "Advanced" tab (at the bottom), go to the "Authentication Flow Overrides" section.
14.  For the "Browser Flow" option, select the flow you just created (e.g. "browser2").
