import Ember from 'ember';
import ChallengePythonChallengeCommonPythonMixin from '../../../mixins/challenge/python/challenge-common-python';
import { module, test } from 'qunit';

module('Unit | Mixin | challenge/python/challenge common python');

// Replace this with your real tests.
test('it works', function(assert) {
  var ChallengePythonChallengeCommonPythonObject = Ember.Object.extend(ChallengePythonChallengeCommonPythonMixin);
  var subject = ChallengePythonChallengeCommonPythonObject.create();
  assert.ok(subject);
});
