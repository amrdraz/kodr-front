import Ember from 'ember';
var _ = window._;

export default Ember.Component.extend({
    setKeys: function(){
        var model = this.get('model') || {};
        var items = _.map(model, function (val, key) {
            return {key:key, val:val};
        });
        this.set('items', items);
    }.on('willRender')
});
