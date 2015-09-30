import Ember from 'ember';
var _ = window._;
var swal = window.swal;

function nameValue(name, val) {
            return {value:val+1, name:name};
        }

export default Ember.Controller.extend({
    challengeChoices: function () {
        return _.map(['Challenge too low', 'Challenge low', 'Challenge just right', 'Challenge high', 'Challenge too high'], nameValue);
    }.property(),
    skillChoices: function () {
        return _.map(['My skill was too low', 'My skill was low', 'My skill was just right', 'My skill was high', 'My skill was too high'], nameValue);
    }.property(),
    actions:{
        submitSurvey: function () {
            var that = this;
            var choices = this.get('model');
            if(choices.challengeLevel && choices.skillLevel ) {
                this.EventBus.publish("trial.complete.flow", choices);
                this.send('removeModal');
            } else {
                swal({
                    title:"Stop",
                    text:"you must enter the challenge difficulty level and your skill level",
                    type:"error"
                },function () {
                    that.EventBus.publish('flow.modal.show');
                });
            }
        }
    }
});
