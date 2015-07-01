import Ember from 'ember';
import OAuth2 from 'simple-auth-oauth2/authenticators/oauth2';

export default OAuth2.extend({

  authenticate(credentials) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
            // make the request to authenticate the user at endpoint /v3/token
            Ember.$.ajax({
                url: '/token',
                type: 'POST',
                data: {
                    grant_type: 'password',
                    identification: credentials.identification,
                    password: credentials.password
                }
            }).then(function(response) {
                Ember.run(function() {
                    // resolve (including the user id) as the AJAX request was successful; all properties this promise resolves
                    // with will be available through the session
                    resolve({
                        access_token: response.access_token,
                        user_id: response.user_id
                    });
                });
            }, function(xhr) {
                Ember.run(function() {
                    reject(xhr.responseText);
                });
            });
        });
  }
});
