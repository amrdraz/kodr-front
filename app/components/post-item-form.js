import Ember from 'ember';

export default Ember.Component.extend({
  buttonLabel: 'Save',
  didInsertElement : function(){
      this._super();
      Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
  },
  afterRenderEvent : function(){
    var tags = [];
    var modelTags = this.get('item.tags');
    if(modelTags){
      modelTags.forEach(function(tag) {
          tags.push(tag.title);
      });
    }
    var allTags = [];
    Ember.$.ajax({
        url: 'http://localhost:3000/api/tags',
        type: 'GET'
    }).then((response)=> {
        response.tags.forEach(function(tag) {
            allTags.push(tag.title);
        });
        Ember.$('.tags').tagEditor({
           initialTags: tags,
           removeDuplicates: true,
           autocomplete: {

               delay: 1, // show suggestions immediately
               position: { collision: 'flip' }, // automatic menu position up/down
               source: allTags,
           },
           forceLowercase: true,
           placeholder: 'Add your own or Choose from previously added tags..'
       });
      }, function(xhr) {
        console.log("Something went wrong "+xhr);
    });
  },
  actions: {

    buttonClicked(param) {
      var tags = $('.tags').tagEditor('getTags')[0].tags;
      this.sendAction('action', param, tags);
    }

  }
});
