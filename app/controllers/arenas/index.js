import Ember from 'ember';

export default Ember.Controller.extend({
    
    init: function() {
        this._super();
        // this.addObserver('hasSandbox', this, function () {
        //     this.removeObserver('hasSandbox', this);
        //     var sb = this.get('sandbox');
        //     var console = this.get('console');
        //     var handler = function(msg) {
        //         console.Write('==> ' + msg + '\n');
        //     };

        //     sb.on('error', handler);
        //     sb.on('test.done', handler);
        //     sb.on('structure.done', handler);
        //     sb.on('log', handler);
        // });
    },
    arenaRoute: function () {
        return this.get('session.isAuthenticated')?'userArena':'arena';
    }.property('session.isAuthenticated'),
    published:function () {
        return this.get('model').filterBy('isPublished', true);
    }.property('[].isPublished'),
    actions: {
      
    }
});