import Ember from 'ember';
import momentComputed from 'ember-moment/computeds/moment';
import fromNow from 'ember-moment/computeds/from-now';

export default Ember.Component.extend({
  computedFromNow: fromNow(momentComputed(momentComputed('item.updated_at'), 'MM-DD-YYYY'), false), // -> 2 years ago
});
