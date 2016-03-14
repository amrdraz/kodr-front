import Ember from 'ember';

export default Ember.Component.extend({
  buttonLabel: 'Save',
  text: '',
  actions: {

    buttonClicked(param1) {
      this.sendAction('action', param1 , this.get('model'));
      this.set('text','');
    }

  }
});
