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
        this._super(path, value);
        this.propertyKeys = _.union(this.propertyKeys, [path]);
    },
    setProperties(obj) {
        this._super.apply(this, arguments);
        this.propertyKeys = _.union(this.propertyKeys, _.keys(obj));
    },
    toJSON() {
        var propertyKeys = _.chain(this.propertyKeys).pull('original').pull('propertyKeys').value();
        return this.getProperties(propertyKeys);
    }
});
