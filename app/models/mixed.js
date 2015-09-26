import Ember from 'ember';
var _ = window._;

export default Ember.Object.extend({
    propertyKeys: [],
    original: {},
    init: function() {
        this.set('propertyKeys', Object.keys(this.__ember_meta__.proto));
        this.set('original', this.__ember_meta__.proto);
        this._super.apply(this, arguments);
    },
    set(path, value) {
        this._super.apply(this, arguments);
        if(value===undefined) {
            delete this[path];
            _.pull(this.propertyKeys, path);
        } else {
            this.propertyKeys = _.union(this.propertyKeys, [path]);
        }
    },
    setProperties(obj) {
        this._super.apply(this, arguments);
        this.propertyKeys = _.union(this.propertyKeys, _.keys(_.filter(obj, undefined)));
    },
    toJSON() {
        var propertyKeys = _.chain(this.propertyKeys).pull('original').pull('propertyKeys').value();
        return this.getProperties(propertyKeys);
    }
});
