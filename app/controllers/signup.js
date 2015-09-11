import Ember from 'ember';
import EmberValidations from 'ember-validations';
var toastr = window.toastr;
var _ = window._;

export default Ember.Controller.extend(EmberValidations.Mixin, {
    lectureGroups:function () {
      return _.range(1, 7);
    }.property(),
    labGroups:function () {
      return _.map(_.range(19,25), (k)=> {return 'BI '+k;}).concat(_.map(_.range(1, 46), (k)=> {return 'ENG '+k;}));
    }.property(),
    validations:{
      username: {
        presence:true,
        length:{minimum:3},
        format:{
          with:/^[\w\-]+\.[\w\-]+$/,
          message: 'username can only be composed of first_name.last_name eg amr.draz'
        }
      },
      uniId: {
        format: {
          with:/^\d\d-\d{3,5}$/,
          message: 'must enter a valid uni id eg. 13-1233'
        }
      },
      lectureGroup: {
        presence:true,
      },
      labGroup: {
        presence:true,
      },
      password: {
        length:{minimum:8},
        format:{
          with:/^.{8,}$/,
          message: 'must contain at least one alphabel character and one digit'
        },
        confirmation:true
      },
      passwordConfirmation: {
        presence:true,
      }
    },
    actions: {
        signup: function() {
            var that = this;
            if(!this.get("hasHonor")) {
              that.set('fullErrors', ['', "You must agree to the honor code by checking the checkbox bellow"]);
              return;
            }
            this.validate().then(function() {
                that.set('errorMessage','');
                Ember.$.ajax({
                    type: 'POST',
                    url: '/signup',
                    context: that,
                    data: that.getProperties('username', 'email', 'password', 'uniId','lectureGroup', 'labGroup','passwordConfirmation')
                }).done(function(res) {
                    toastr.success(res);
                    that.transitionToRoute('login', {queryParams:{email:that.get('email')}});
                }).fail(function(xhr) {
                    that.set('errorMessage', xhr.responseText);
                });
            }, function() {
                var errors = that.get('errors');
                var fullErrors = [];
                Object.keys(errors).forEach(function(val) {
                    if (errors[val] instanceof Array) {
                        errors[val].forEach(function(msg) {
                            fullErrors.push([val, msg].join(" "));
                        });
                    }
                });
                that.set('fullErrors', fullErrors);
            });
        }
    }
});
