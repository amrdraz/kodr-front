import Ember from 'ember';

export default Ember.Component.extend({
  vote: 0,
  votedUp: Ember.computed.equal('vote',1),
  votedDown: Ember.computed.equal('vote',-1),
  voteUpAction: 'voteUp',
  voteDownAction: 'voteDown',
  model: null,
  modelName: null,
  unAuth: 'unAuthenticated',
  session: Ember.inject.service('session'),
  url: Ember.computed('modelName',function() {
      return 'http://localhost:3000/api/'+this.get('modelName')+'/'+this.get('model').id;
  }),
  setVote: function(caller){
      if(!caller.get('session.isAuthenticated')){
          return;
      }
      var token = 'Bearer '+caller.get('session.secure.access_token');
      Ember.$.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader(
                'X-K-Authorization', token
            );
        }
      });
      Ember.$.ajax({
          url: caller.get('url')+'/vote',
          type: 'GET'
      }).then((response)=> {
          var vote = parseInt(response.vote);
          caller.set('vote',vote);
        }, function(xhr) {
          console.log("Something went wrong "+xhr);
      });
  },
  didReceiveAttrs(){
    this.setVote(this);
  },
  actions:{
    voteAction(action){
      if(this.get('session.isAuthenticated')){
          var token = 'Bearer '+this.get('session.secure.access_token');
          Ember.$.ajaxSetup({
            beforeSend: function(xhr) {
                xhr.setRequestHeader(
                    'X-K-Authorization', token
                );
            }
          });
          Ember.$.ajax({
              url: this.get('url')+'/'+action,
              type: 'POST'
          }).then((response)=> {
              this.get('model').set('totalVotes',response.model.totalVotes);
        }, function(xhr) {
              console.log("Something went wrong "+xhr);
          });
      } else{
          this.sendAction('unAuth');
      }
    }
  }
});
