import DS from 'ember-data';
import config from 'kodr/config/environment';

export default DS.RESTAdapter.extend({
    namespace:'api',
    coalesceFindRequests: true,
    shouldReloadAll: function () {
        return true;
    }
    // shouldBackgroundReloadRecord:false
});
