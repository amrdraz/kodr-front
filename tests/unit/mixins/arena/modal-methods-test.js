import Ember from 'ember';
import ArenaModalMethodsMixin from '../../../mixins/arena/modal-methods';
import { module, test } from 'qunit';

module('Unit | Mixin | arena/modal methods');

// Replace this with your real tests.
test('it works', function(assert) {
  var ArenaModalMethodsObject = Ember.Object.extend(ArenaModalMethodsMixin);
  var subject = ArenaModalMethodsObject.create();
  assert.ok(subject);
});
