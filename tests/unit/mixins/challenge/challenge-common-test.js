import Ember from 'ember';
import ChallengeChallengeCommonMixin from '../../../mixins/challenge/challenge-common';
import { module, test } from 'qunit';

module('Unit | Mixin | challenge/challenge common');

// Replace this with your real tests.
test('it works', function(assert) {
  var ChallengeChallengeCommonObject = Ember.Object.extend(ChallengeChallengeCommonMixin);
  var subject = ChallengeChallengeCommonObject.create();
  assert.ok(subject);
});
