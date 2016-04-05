import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    toggleView: function() {
      this.toggleProperty('viewWiki');
    }
  }
});
