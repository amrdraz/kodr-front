import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        addInput: function() {
            var controller = this;
            var model = controller.get('model');
            model.get("inputs").pushObject(Ember.Object.create({value:""}));
        },
        removeInput: function(inp) {
            var controller = this;
            var model = controller.get('model');
            model.get("inputs").removeObject(inp);
        },
    }
});
