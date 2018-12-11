// oauth_model.js
// Description:
// "oauth_model.js" is a model for node package "oauth2-server".
// Copyright 2018 NOOXY. All Rights Reserved.

function Oauth2Model() {
  let _model;
  let _authe;

  this.importModel = (model)=> {
    _model = model;
  };

  this.importAuthe = (authe)=> {
    _authe = authe;
  };

  /*
   * Get access token.
   */
   this.createClient = function(bearerToken) {
     return pg.query('SELECT access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id FROM oauth_tokens WHERE access_token = $1', [bearerToken])
       .then(function(result) {
         var token = result.rows[0];

         return {
           accessToken: token.access_token,
           client: {id: token.client_id},
           expires: token.expires,
           user: {id: token.userId}, // could be any object
         };
       });
   };

  this.getAccessToken = function(bearerToken) {
    return pg.query('SELECT access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id FROM oauth_tokens WHERE access_token = $1', [bearerToken])
      .then(function(result) {
        var token = result.rows[0];

        return {
          accessToken: token.access_token,
          client: {id: token.client_id},
          expires: token.expires,
          user: {id: token.userId}, // could be any object
        };
      });
  };

  /**
   * Get client.
   */

  this.getClient = function *(clientId, clientSecret) {
    return pg.query('SELECT client_id, client_secret, redirect_uri FROM oauth_clients WHERE client_id = $1 AND client_secret = $2', [clientId, clientSecret])
      .then(function(result) {
        var oAuthClient = result.rows[0];

        if (!oAuthClient) {
          return;
        }

        return {
          clientId: oAuthClient.client_id,
          clientSecret: oAuthClient.client_secret,
          grants: ['password'], // the list of OAuth2 grant types that should be allowed
        };
      });
  };

  /**
   * Get refresh token.
   */

  this.getRefreshToken = function *(bearerToken) {
    return pg.query('SELECT access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id FROM oauth_tokens WHERE refresh_token = $1', [bearerToken])
      .then(function(result) {
        return result.rowCount ? result.rows[0] : false;
      });
  };

  /*
   * Get user.
   */

  this.getUser = function *(username, password) {
    return pg.query('SELECT id FROM users WHERE username = $1 AND password = $2', [username, password])
      .then(function(result) {
        return result.rowCount ? result.rows[0] : false;
      });
  };

  /**
   * Save token.
   */

  this.saveAccessToken = function *(token, client, user) {
    return pg.query('INSERT INTO oauth_tokens(access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id) VALUES ($1, $2, $3, $4)', [
      token.accessToken,
      token.accessTokenExpiresOn,
      client.id,
      token.refreshToken,
      token.refreshTokenExpiresOn,
      user.id
    ]).then(function(result) {
      return result.rowCount ? result.rows[0] : false; // TODO return object with client: {id: clientId} and user: {id: userId} defined
    });
  };
};

module.exports = Oauth2Model;
