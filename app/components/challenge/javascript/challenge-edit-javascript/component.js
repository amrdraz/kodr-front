import ChallengeCommon from 'kodr/mixins/challenge/javascript/challenge-common-javascript';

import Ember from 'ember';

export default Ember.Component.extend(ChallengeCommon, {
    evaluatedModelProperty: 'solution',
});
