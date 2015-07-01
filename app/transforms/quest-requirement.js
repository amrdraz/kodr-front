import DS from 'ember-data';
import Requirement from 'kodr/models/requirement';

var QuestRequirementTransform = DS.Transform.extend({
  deserialize: function(serialized) {
    return serialized.map(function  (req) {
        return Requirement.create(req);
    });
  },
  serialize: function(deserialized) {
    console.log('serializing', deserialized);
    return deserialized.map(function (req) {
        return req.serialize();
    });
  }
});

export default QuestRequirementTransform;
