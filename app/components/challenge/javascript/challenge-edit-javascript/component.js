import ChallengeCommon from 'kodr/mixins/challenge/challenge-common-javascript';

import Ember from 'ember';

export default Ember.Component.extend(ChallengeMixin, {
    evaluatedModelProperty: 'solution',
});
