import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';
import Ember from 'ember';
var toastr = window.toastr;


export default Ember.Route.extend(ApplicationRouteMixin, {
    actions: {
        loading: function( /*transition, originRoute*/ ) {
            // displayLoadingSpinner();
            // this.woof.info('did you know that the best programs are lazy ones');
            // substate implementation when returning `true`
            return true;
        },
        error: function(reason) {
            console.log(reason.stack);
            toastr.error(reason.responseText || reason.message);
        },
        authorizationFailed: function() {
            // stops Ember Simple Auth default redirect behavior on 401 errors
        }
    }
});
