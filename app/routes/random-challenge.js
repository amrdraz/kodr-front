import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import Mixed from 'kodr/models/mixed';
import Ember from 'ember';


export default Ember.Route.extend(AuthenticatedRouteMixin, {

    model: function() {
        var router = this;
        return new Promise(function(resolve, reject) {
            // In order to wait for the ajax request to finish.
            var arena_id = router.modelFor('arena').id
            var url = '/api/arenas/' + arena_id;
            var arena;
            
            Ember.$.get(url).done(function (res) {
                arena = res['arena'];
                var challenges = res['challenges'];

                router.store.query('trial', {arena:arena_id, user:router.get('session.user.id')}).then(function(items) {
                    // Get a DS.PromiseArray of the trials
                    router.controllerFor('random-challenge').set('items', items)
                });

                router.controllerFor('random-challenge').set('challenges', res.challenges);
                router.controllerFor('random-challenge').set('arena', res.arena);
                resolve(res);
            }).fail(function (err) {
                console.log(err);
                reject(err);
            });
        });
        
    }

});