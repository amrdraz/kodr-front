import Ember from 'ember';

export default Ember.Component.extend({
  isShowingModal: false,
  wikis: null,
  didReceiveAttrs() {
    Ember.$.ajax({
      url: 'api/wikis',
      type: 'GET'
    }).then((response) => {
      this.set('wikis', response.wikis);
    }, function(xhr) {
      console.log("Something went wrong " + xhr);
    });
  },
  actions: {
    toggleModal: function() {
      this.toggleProperty('isShowingModal');
    }
  }
});
