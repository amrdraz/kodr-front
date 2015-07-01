import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        submit: function(group) {
            var controller = this;
            Ember.$.post('api/groups/many', this.get('model').getProperties(['name','from', 'to'])).done(function (res) {
                controller.store.pushPayload(res);
                controller.transitionToRoute('groups');
            }).fail(function (err) {
                console.log(err);
            });
        }
    }
});
