import Ember from 'ember';

export default Ember.Component.extend({
  isShowingModal: false,
  wikis: null,
  wikisFiltered: [],
  didReceiveAttrs() {
    Ember.$.ajax({
      url: 'api/wikis',
      type: 'GET'
    }).then((response) => {
      this.set('wikis', response.wikis);
      var wikisFiltered = this.get('wikisFiltered');
      response.wikis.forEach(function(wiki) {
          wikisFiltered.push(wiki);
      });
    }, function(xhr) {
      console.log("Something went wrong " + xhr);
    });
  },
  filter: function() {
    var query = this.get('query').toLowerCase();
    var wikisFiltered = this.get('wikisFiltered');
    var wikis = this.get('wikis');
    wikisFiltered.clear();
    wikis.forEach(function(wiki) {
      var title = wiki.title.toLowerCase();
      if(!query || title.includes(query)){
        wikisFiltered.push(wiki);
      }
    });
    return wikisFiltered;
  }.observes('query'),
  actions: {
    toggleModal: function() {
      this.toggleProperty('isShowingModal');
    }
  }
});
