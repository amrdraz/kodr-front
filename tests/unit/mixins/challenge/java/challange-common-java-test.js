import Ember from 'ember';
import ChallengeJavaChallangeCommonJavaMixin from '../../../mixins/challenge/java/challange-common-java';
import { module, test } from 'qunit';

module('Unit | Mixin | challenge/java/challange common java');

// Replace this with your real tests.
test('it works', function(assert) {
  var ChallengeJavaChallangeCommonJavaObject = Ember.Object.extend(ChallengeJavaChallangeCommonJavaMixin);
  var subject = ChallengeJavaChallangeCommonJavaObject.create();
  assert.ok(subject);
});
