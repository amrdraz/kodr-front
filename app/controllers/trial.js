import Ember from 'ember';
var toastr = window.toastr;
var swal = window.swal;


export default Ember.Controller.extend({

    isChallengeTrialFunc(){
        return this.container.lookup('controller:application').get('currentPath').split('.').contains('challenge');
    },
    isChallengeTrial: function() {
        return this.isChallengeTrialFunc();
    }.property('currentPath'),

    breadCrumb: function() {
        return this.get('isChallengeTrial') ? 'edit' : 'back to arena';
    }.property('isChallengeTrial'),
    breadCrumbPath: function() {
        return this.get('isChallengeTrial') ? 'arena.edit' : 'userArena';
    }.property('isChallengeTrial'),
    needs: function() {
        return [this.get('isChallengeTrial') ? 'challenge' : 'userArena'];
    }.property('isChallengeTrial'),
    challenge: function () {
        return Ember.ObjectProxy.create({
            content: this.get('model.challenge')
        });
    }.property("model.challenge"),
    // returns true if dirty but unsaved, so that mock trials show complete instead of resubmit
    isDirtyish: function() {
        return this.get('model.hasDirtyAttributes') && !this.get('model.isNew');
    }.property('model.hasDirtyAttributes', 'model.isNew'),
    test: function() {
        var controller = this;
        var model = this.get('model');
        if (!this.isChallengeTrialFunc()) {
            if(model.get('completed')===1) {
                this.send('showModal', 'modals/flow-questionair', {challengeLevel:null, skillLevel:null, help:false});
            } else if(model.get('completed')>1) {
                swal("Great Job", "You already completed this challenge so no points for you", "info");
            }
        } else {
            if(model.get('complete')){
                swal("Great Job", "You could have earned "+model.get('challenge.exp')+" EXP if you where logged in", "success");
            } else {
                toastr.info('You meight want to change those failures in your code, check the console');
            }
        }
    },
    trialComplete(){
        var controller = this;
        var model = this.get('model');
        swal({title:"+"+model.get('exp')+" EXP", text:"For completeing this challenge", type:"success"}, function () {
            controller.nextChallenge();
        });
    },
    nextChallenge(){
        if(!this.isChallengeTrialFunc()) {
            // var trials = this.get('controllers.userArena.trials');
            // var index = trials.indexOf(this.get('model'));
            // if (index < this.get('controllers.userArena.trials.length')-1) {
            //     this.transitionToRoute("userArena.trial", trials.objectAt(index+1));
            // } else {
                this.transitionToRoute("userArena", this.get('model.userArena'));
            // }
        }
    },
    actions: {
        run() {
           // Happens in challenge component
        },
        test(report){
            this.test(report);
        },
        viewDiscussion(){
            var challenge_id = this.get('model.challenge.id');
            var model = this.get('model.challenge');
            Ember.$.ajax({
              url: 'api/posts',
              type: 'POST',
              data: {
                challenge: JSON.stringify(model),
                challenge_id: challenge_id
              }
            }).then((response) => {
              console.log(response);
            }, function(xhr) {
              console.log("Something went wrong " + xhr);
            });
        }
    },
    controllerSubscribe: function() {
        this.EventBus.subscribe('trial.complete.reward', this, this.trialComplete);
    }.on('init'),
    controllerUnSubscribe: function() {
        this.EventBus.unsubscribe('trial.complete.reward', this, this.trialComplete);
    }.on('willDestroy'),
});
