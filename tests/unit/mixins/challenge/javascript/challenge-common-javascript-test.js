import Ember from 'ember';
import ChallengeJavascriptChallengeCommonJavascriptMixin from '../../../mixins/challenge/javascript/challenge-common-javascript';
import { module, test } from 'qunit';

module('Unit | Mixin | challenge/javascript/challenge common javascript');

// Replace this with your real tests.
test('it works', function(assert) {
  var ChallengeJavascriptChallengeCommonJavascriptObject = Ember.Object.extend(ChallengeJavascriptChallengeCommonJavascriptMixin);
  var subject = ChallengeJavascriptChallengeCommonJavascriptObject.create();
  assert.ok(subject);
});
