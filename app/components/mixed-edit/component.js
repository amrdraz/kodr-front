import Ember from 'ember';
import Mixed from 'kodr/models/mixed';

export default Ember.Component.extend({
    newKey:"",
    setFlags: function () {
        var attr = this.get('attr');
        var model = this.get('model');
        var mixed;
        if(attr) {
            mixed = model.get(attr) || Mixed.create({});
            model.set(attr, mixed);
        } else {
            mixed = model || Mixed.create({});
        }
        this.set('mixed', mixed);
        this.set('flags', mixed.toJSON());
    }.on('willRender'),
    actions: {
        addFlag(){
            this.get('mixed').set(this.get('newKey'), true);
            this.get('model').set('contentChanged', true);
            this.set('newKey', "");
            this.rerender();
        },
        removeFlag(key){
            this.get('mixed').set(key, undefined);
            this.get('model').set('contentChanged', true);
            this.rerender();
        },
        toggleFlag(key){
            this.get('mixed').set(key, !this.get('mixed').get(key));
            this.get('model').set('contentChanged', true);
            this.rerender();
        }
    }
});
