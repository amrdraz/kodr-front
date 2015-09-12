import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['row'],
    modifiers: ['any', 'specific'],
    models: ['Arena', 'Challenge'],
    sendChange: function() {
        this.sendAction(this.get('requirementChangeAction'));
    },
    change: function() {
        this.sendChange();
    }.on('modifier1','modifier2', 'model.id1', 'model.id2'),
    actions: {
        remove() {
            this.sendChange();
            var action = this.get('removeAction');
            this.sendAction(action, this.get('model'));
        }
    }
});
