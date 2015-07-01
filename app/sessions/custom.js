import Session from 'simple-auth/session';
import Ember from 'ember';
import DS from 'ember-data';

export default Session.extend({
    user: function() {
        var userId = this.get('secure.user_id');
        if (!Ember.isEmpty(userId)) {
            return DS.PromiseObject.create({
              promise: this.container.lookup('store:main').findRecord('user', userId)
            });
        }
    }.property('secure.user_id'),
    atLeastTeacher: function () {
        return this.get('isAdmin') || this.get('isTeacher');
    }.property('user.role'),
    isAdmin: function () {
        return this.get('user.isAdmin');
    }.property('user.role'),
    isTeacher: function() {
        return this.get('user.isTeacher');
    }.property('user.role'),
    isStudent: function() {
        return this.get('user.isStudent');
    }.property('user.role')
});
