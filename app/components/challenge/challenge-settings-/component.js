import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'section',
    classNames: ['challenge-settings', 'row'],
    challengeLanguages: (function() {
        var re = /kodr\/components\/challenge.*-edit-(.+)\/comp/;
        return Object.keys(requirejs._eak_seen).filter((key) => {
            return re.test(key);
        }).map((key) => {
            return re.exec(key)[1];
        });
    })()
});
