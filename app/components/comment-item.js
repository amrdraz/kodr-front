import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  viewReplies: false,
  hasReplies: false,
  unAuthenticated: 'unAuthenticated',
  actions: {
    unAuthenticated(){
      this.sendAction('unAuthenticated');
    },
    editClicked(){
      this.set('isEditing' , true);
    },
    editCancel(item){
      item.rollbackAttributes();
      this.set('isEditing' , false);
    },
    editSave(item){
      item.save().then(()=>{
        this.set('isEditing' , false);
      });
    },
    //send action for deleting a Reply
    deleteClicked(param){
       this.sendAction('action', param , this.get('model'));
    }
  }
});
