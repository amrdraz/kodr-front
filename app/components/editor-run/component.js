import Ember from 'ember';

export default Ember.Component.extend({
    classNames:['past-text'],
    didInsertElement(){
        var component = this;
        var target = component.get('target');
        component.$().on('click','pre:not(.no-run)', function () {
            var code = Ember.$(this).text();
            component.EventBus.publish('trial.event.example.run', {meta:{example:code}});
            // component.EventBus.publish('editor.past', target, code);
            component.EventBus.publish('challenge.run', target, code);
            console.log(code);
        });
        component.$().on('click','pre.copy', function () {
            var code = Ember.$(this).text();
            component.EventBus.publish('trial.event.example.copy', {meta:{example:code}});
            // component.EventBus.publish('editor.past', target, code);
            component.EventBus.publish('editor.past', target, code);
            console.log(code);
        });
    }
});
