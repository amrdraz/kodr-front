import DS from 'ember-data';

var JavaInputTransform = DS.Transform.extend({
  deserialize: function(serialized) {
    return serialized.map(function  (req) {
        return Object.create({value:req});
    });
  },
  serialize: function(deserialized) {
    return deserialized.mapBy("value");
  }
});

export default JavaInputTransform;
