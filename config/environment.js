/* jshint node: true */

module.exports = function(environment) {
    var ENV = {
        modulePrefix: 'kodr',
        environment: environment,
        baseURL: '/',
        locationType: 'hash',
        EmberENV: {
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. 'with-controller': true
            }
        },

        APP: {
            // Here you can pass flags/options to your application instance
            // when it is created
            // API_HOST: 'https://kodr.in' // default settins
        },

        contentSecurityPolicy: {
            'default-src': "'none'",
            'frame-src': "'self' 'unsafe-inline'",
            'script-src': "'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://cdn.mathjax.org http://www.google-analytics.com https://ssl.google-analytics.com", // Allow scripts from https://cdn.mxpnl.com
            'font-src': "'self' https://fonts.gstatic.com", // Allow fonts to be loaded from http://fonts.gstatic.com
            'connect-src': "'self' http://localhost:9000/ ws://localhost:4200 http://custom-api.local", // Allow data (ajax/websocket) from api.mixpanel.com and custom-api.local
            'img-src': "'self' data: http://www.google-analytics.com",
            'style-src': "'self' 'unsafe-inline' https://cdnjs.cloudflare.com http://fonts.googleapis.com", // Allow inline styles and loaded CSS from http://fonts.googleapis.com 
            'media-src': "'self'"
        }
    };

    if (environment === 'development') {
        // ENV.APP.LOG_RESOLVER = true;
        ENV.APP.LOG_ACTIVE_GENERATION = true;
        ENV.APP.LOG_TRANSITIONS = true;
        ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        // ENV.APP.LOG_VIEW_LOOKUPS = true;
        ENV.APP.API_HOST = 'http://localhost:9000';
    }

    if (environment === 'test') {
        // Testem prefers this...
        ENV.baseURL = '/';
        ENV.locationType = 'none';

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;
        ENV.APP.API_HOST = 'http://localhost:3000';

        ENV.APP.rootElement = '#ember-testing';
    }

    if (environment === 'production') {

    }


    ENV['simple-auth'] = {
        session: 'session:custom',
        authorizer: 'simple-auth-authorizer:token',
        // crossOriginWhitelist: [ENV.APP.API_HOST]
    };

    ENV['simple-auth-token'] = {
        serverTokenEndpoint: '/token',
        identificationField: 'identification',
        passwordField: 'password',
        tokenPropertyName: 'access_token',
        authorizationPrefix: 'Bearer ',
        authorizationHeaderName: 'X-K-Authorization',
        headers: {},
    };

    return ENV;
};
