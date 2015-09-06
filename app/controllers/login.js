// import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';
import EmberValidations from 'ember-validations';
import Ember from 'ember';

var LoginController = Ember.Controller.extend(EmberValidations.Mixin, {
    authenticator: 'simple-auth-authenticator:oauth2-password-grant',
    validations: {
        identification: {
            presence: true,
            length: {
                minimum: 4
            }
        },
        password: {
            presence: true,
            length: {
                minimum: 8
            }
        }
    },
    actions: {
        validate: function() {

            var that = this;
            return this.validate().then(function() {
                that.send('authenticate');
            }, function() {
                var errors = that.get('errors');
                var fullErrors = [];
                Object.keys(errors).forEach(function(val) {
                    if(errors[val] instanceof Array) {
                        errors[val].forEach(function(msg) {
                            fullErrors.push([val, msg].join(" "));
                        });
                    }
                });
                that.set('fullErrors',fullErrors);
            });
        },
        authenticate: function() {
            var that = this;
            var credentials = that.getProperties('identification', 'password');
            that.get('session').authenticate('authenticator:custom', credentials).then(null, function(error) {
              that.set('errorMessage', JSON.parse(error));
            });
        },
        verify: function (uid) {
            var that = this;
            Ember.$.post('api/users/'+uid+'/verify').done(function (res) {
                  toastr.success(res.message);
                  that.set('fullErrors','');
            }).fail(function (xhr) {
                console.log(xhr);
                  toastr.error(xhr);
            });
        }
    }
});

export default LoginController;
