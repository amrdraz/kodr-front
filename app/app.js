import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from 'kodr/config/environment';

(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

window.ga('create', 'UA-58026837-1', 'auto');
window.ga('send', 'pageview');

window.toastr.options = {
    "closeButton": true,
    "debug": false,
    "positionClass": "toast-bottom-right",
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};
var emberSockets;
try {
    emberSockets = window.EmberSockets; //cause I removed EmberSocket during testing
} catch (e) {
    emberSockets = Ember.Object;
}

var App;


Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
    modulePrefix: config.modulePrefix,
    podModulePrefix: config.podModulePrefix,
    Resolver: Resolver,
    currentPath: '',
    Socket: emberSockets.extend({
        // host: 'localhost',
        // port: 9000,
        // secure:true,
        components: ['challenge/python/challenge-trial-python'],
        controllers: ['application'],
        autoConnect: true
    }),
    ready(){
        Ember.$("#preloader").remove();
    }
});

loadInitializers(App, config.modulePrefix);

export default App;
