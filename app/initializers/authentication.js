import CustomAuthenticator from 'kodr/authenticators/custom';
import CustomSession from 'kodr/sessions/custom';

export function initialize(container/*, application */ ) {
    // application.inject('route', 'foo', 'service:foo');
    // register the custom session so Ember Simple Auth can find it
    container.register('session:custom', CustomSession);
    // register the custom authenticator so the session can find it
    container.register('authenticator:custom', CustomAuthenticator);
}

export default {
    name: 'authentication',
    initialize: initialize,
    before: 'simple-auth',
};