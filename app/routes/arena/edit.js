import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import ModalMethodsMixin from 'kodr/mixins/arena/modal-methods';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin, ModalMethodsMixin, {
    setupController: function(controller, model) {
        model.reload();
        controller.set('model', model);
    },
    // renderTemplate: function() {},
    // beforeModel: function() {},
    // afterModel: function() {},

    model: function() {
        return this.modelFor('arena');
    }
});
