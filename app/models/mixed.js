import Ember from 'ember';
var _ = window._;

export default Ember.Object.extend({
    init: function () {
      this.set('propertyKeys', Object.keys(this.__ember_meta__.proto));
      this.set('original', this.__ember_meta__.proto);
      this._super.apply(this, arguments);  
    },
    set(path, value){
          this._super(path, value);
          if(this.propertyKeys && path!=="propertyKeys" && path!=="original" && !this.propertyKeys.contains(path)) {
            this.propertyKeys.push(path);
          }
    },
    propertyKeys: null,
    original: null,
    toJSON() {
        var propertyKeys = _.chain(this.propertyKeys).pull('original').pull('propertyKeys').value();
        return this.getProperties(propertyKeys);
    }
});
