import DS from 'ember-data';
import Ember from 'ember';

export default DS.Transform.extend({
    deserialize: function(serialized) {
        var properties = Object.keys(serialized);
        return Ember.Object.extend({
            propertyKeys:properties,
            original:serialized,
            toJSON(){
                return this.getProperties(this.propertyKeys);
            }
        }).create(serialized);
    },

    serialize: function(deserialized) {
        return deserialized.toJSON?deserialized.toJSON():deserialized;
    }
});
