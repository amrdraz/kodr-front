import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import Mixed from 'kodr/models/mixed';
import Ember from 'ember';


export default Ember.Route.extend(AuthenticatedRouteMixin, {

    model: function() {
        var router = this;
        return new Promise(function(resolve, reject) {
            // In order to wait for the ajax request to finish.
            var arena_id = router.modelFor('userArena').id
            var url = '/api/userArenas/' + arena_id;
            
            Ember.$.get(url).done(function (res) {
                var userArena = res['userArena'];

                var arena = router.store.findRecord('arena', userArena.arena)

                router.store.query('trial', {arena:userArena.arena, user:router.get('session.user.id')}).then(function(trials) {
                    // Get a DS.PromiseArray of the trials
                    router.controllerFor('random-challenge').set('trials', trials)
                });

                // The following line is to return a proper class not a json object
                userArena = router.store.findRecord('userArena', userArena._id)
                
                router.controllerFor('random-challenge').set('arena', arena);
                router.controllerFor('random-challenge').set('userArena', userArena);
                console.log(userArena.progress, "progress")
                router.controllerFor('random-challenge').set('progress', userArena.progress);
                resolve(res);
            }).fail(function (err) {
                console.log(err);
                reject(err);
            });
        });
        
    },
    deactivate: function() {
        this.controller.clearForm();
    }

});