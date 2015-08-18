import DS from 'ember-data';
import config from 'kodr/config/environment';

export default DS.RESTAdapter.extend({
    namespace:'api',
    host: config.APP.API_HOST,
    coalesceFindRequests: true,
    // shouldBackgroundReloadRecord:false
});
