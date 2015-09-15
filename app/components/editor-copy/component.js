import Ember from 'ember';

export default Ember.Component.extend({
    classNames:['past-text'],
    didInsertElement(){
        var component = this;
        var target = component.get('target');
        component.$().on('click','pre', function () {
            var code = Ember.$(this).text();
            component.EventBus.publish('challenge.event.copy.example');
            component.EventBus.publish('editor.past', target, code);
            console.log(code);
        });
    }
});
