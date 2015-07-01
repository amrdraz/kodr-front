import Ember from 'ember';

export default Ember.Controller.extend({

    actions: {
      remove: function(group) {
            if (confirm('Are you sure you want to remove this group?')) {
                group.deleteRecord();
                group.save();
            }
            return false;
        }
    }
});
