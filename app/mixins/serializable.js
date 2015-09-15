import Ember from 'ember';

export default Ember.Mixin.create({
    serialize: function() {
        var propertyNames = this.get('propertyNames') || [];
        return this.getProperties(propertyNames);
    },

    deserialize: function(hash) {
        this.setProperties(hash);
    }
});