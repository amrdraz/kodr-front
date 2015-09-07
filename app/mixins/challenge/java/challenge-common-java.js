import ChallengeCommon from 'kodr/mixins/challenge/challenge-common';
import Ember from 'ember';

export default Ember.Mixin.create(ChallengeCommon, {
    runInServer(code, model, cb) {
        Ember.$.ajax({
            url: '/api/challenges/run',
            type: 'POST',
            data: {
                code: code,
                language: model.get('language'),
                inputs: model.get('inputs').mapBy("value")
            }
        }).done(cb).fail(function(err) {
            toastr.error(err.statusText);
        });
    },
    testInServer(code, challenge, cb) {
        var data = (challenge.getProperties(['language', 'tests', 'exp']));
        data.inputs = challenge.get('inputs').mapBy("value");
        Ember.$.ajax({
            url: '/api/challenges/test',
            type: 'POST',
            data: {
                code: code,
                challenge: data
            }
        }).done(cb).fail(function(err) {
            toastr.error(err.responseText);
        });
    },
    parseSterr(sterr) {
        var i, column_no_start, column_no_stop, errs, msg, line, fragment, lines = sterr.replace(/(Error.*line)/g, "\n$1").replace(/\^/g, "^\n").split('\n'),
            found = [];

        for (i = 0; i < lines.length;) {
            if ((/^Error/).test(lines[i])) {
                errs = lines[i++].match(/Error.* line (\d*).*:\d+: (.*)/);
                line = +errs[1];
                msg = errs[2];
                if (~lines[i].indexOf('found')) {
                    i += 2;
                } else {
                    fragment = lines[i++] + "\n";
                    column_no_start = lines[i++].length - 2;
                    column_no_stop = column_no_start + 1;
                }
            } else if (/RuntimeError/.test(lines[i])) {
                msg = (lines[i++].match(/RuntimeError: (.*)/))[1];
                line = +(lines[i++].match(/at.*:(\d)/))[1];
            } else {
                i++;
                continue;
            }
            found.push({
                line_no: (line) - 1,
                column_no_start: column_no_start || 0,
                column_no_stop: column_no_stop || 200,
                message: msg,
                fragment: fragment || '',
                severity: "error"
            });
        }
        // console.log(found);
        return found;
    }
});
