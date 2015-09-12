import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
    tagName: 'pre',
    export: function() {
        var model = this.get('model');
    }.property('didInsertElement')
});
