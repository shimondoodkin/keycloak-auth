const path = require('path');

module.exports = {
  //mode: 'development',
  mode: 'production', 
  entry: './src/keycloak-auth.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'keycloak-auth.js',
    library: "keycloakAuth",
  },
};