import Ember from 'ember';
import DS from 'ember-data';
import EmberValidations from 'ember-validations';

var Em = Ember;
var toastr = window.toastr;

export default Ember.ObjectController.extend(EmberValidations.Mixin, {
    validations: {
        password: {
            length: {
                minimum: 8
            },
            format: {
                with: /^.{8,}$/,
                message: 'must contain at least one alphabel character and one digit'
            },
            confirmation: true
        },
        passwordConfirmation: {
            presence: true
        }
    },
    group:null,
    groupOptions: function () {
        var store = this.store;
        var dfd = DS.PromiseArray.create({
            promise: Em.$.getJSON('api/groups/groupOptions').then(function(response) {
                return response.map(function(record) {
                    record.id = record._id;
                    return store.push('group', record);
                });
            })
        });
        return dfd;
    }.property('memberships.[]'),
    activitySeries: function() {
        return [{
            name: 'Quantity',
            data: [4, 4]
        }, {
            name: 'Revenue',
            data: [10.0, 10.0]
        }];
    }.property(),
    isOwnPage: function() {
        return this.get('session.user.id') === this.get('model.id');
    }.property('model.id'),
    actions: {
        join: function (group) {
            var that = this;
            Em.$.post('api/groups/'+group.id+'/join').done(function (data) {
                that.store.pushPayload(data);
            }).fail(function (err) {
                toastr.error(err.statusText);
            });
        },
        changePass: function() {
            var that = this;
            this.validate().then(function() {
                Em.$.ajax({
                    type: 'PUT',
                    url: that.get('session.isAdmin')?'/api/users/' + that.get('model.id'):'/profile',
                    context: that,
                    data: {
                        user: that.getProperties('password', 'passwordConfirmation')
                    }
                }).done(function(res) {
                    toastr.success('passwordChanged');
                    that.set('session.access_token',res.access_token);
                    that.get('model').setProperties({
                        password: '',
                        passwordConfirmation: ''
                    });
                }).fail(function(xhr) {
                    toastr.error(xhr.responseText);
                });
            }, function() {
                var errors = that.get('errors');
                var fullErrors = [];
                Object.keys(errors).forEach(function(val) {
                    if (errors[val] instanceof Array) {
                        errors[val].forEach(function(msg) {
                            fullErrors.push([val, msg].join(" "));
                        });
                    }
                });
                that.set('fullErrors', fullErrors);
            });
        }
    }
});
