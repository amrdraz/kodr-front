import Ember from 'ember';

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
        return this.getProperties(this.propertyKeys);
    }
});
