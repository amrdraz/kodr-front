import Ember from 'ember';
import ChallengeJavaChallengeCommonJavaMixin from '../../../mixins/challenge/java/challenge-common-java';
import { module, test } from 'qunit';

module('Unit | Mixin | challenge/java/challenge common java');

// Replace this with your real tests.
test('it works', function(assert) {
  var ChallengeJavaChallengeCommonJavaObject = Ember.Object.extend(ChallengeJavaChallengeCommonJavaMixin);
  var subject = ChallengeJavaChallengeCommonJavaObject.create();
  assert.ok(subject);
});
