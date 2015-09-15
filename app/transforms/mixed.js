import DS from 'ember-data';
import Ember from 'ember';
import Mixed from 'kodr/models/mixed';

export default DS.Transform.extend({
    deserialize: function(serialized) {
        return Mixed.create(serialized);
    },

    serialize: function(deserialized) {
        return deserialized.toJSON?deserialized.toJSON():deserialized;
    }
});
