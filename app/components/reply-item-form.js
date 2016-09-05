import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  text: '',
  isEditing: false,
  unAuthenticated: 'unAuthenticated',
  actions: {
    editClicked(){
      if(this.get('session.isAuthenticated'))
      {
        this.set('isEditing' , true);
      }
      else {
        this.sendAction('unAuthenticated');
      }
    },
    editCancel(){
      this.set('text','');
      this.set('isEditing' , false);
    },
    editSave(param){
       this.sendAction('action' , param , this.get('model'));
       this.set('text','');
       this.set('isEditing' , false);
    }
  }
});
