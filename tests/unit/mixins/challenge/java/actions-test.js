import Ember from 'ember';
import ChallengeJavaActionsMixin from '../../../mixins/challenge/java/actions';
import { module, test } from 'qunit';

module('Unit | Mixin | challenge/java/actions');

// Replace this with your real tests.
test('it works', function(assert) {
  var ChallengeJavaActionsObject = Ember.Object.extend(ChallengeJavaActionsMixin);
  var subject = ChallengeJavaActionsObject.create();
  assert.ok(subject);
});
