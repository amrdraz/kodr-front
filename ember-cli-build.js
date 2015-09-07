var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var Funnel = require('broccoli-funnel');

module.exports = function(defaults) {
    /* global require, module */

    var app = new EmberApp(defaults, {
        sassOptions: {
            includePaths: [
                'bower_components/bootstrap-sass-official/assets/stylesheets/',
            ]
        }
    });

    var extraAssets = new Funnel('bower_components/bootstrap-sass-official/assets/fonts', {
        srcDir: '/',
        // include: ['**/*.woff', '**/stylesheet.css'],
        destDir: '/assets/fonts'
    });

    app.import('bower_components/modernizr/modernizr.js');


    app.import('bower_components/toastr/toastr.css');
    app.import('bower_components/toastr/toastr.js');

    app.import('bower_components/marked/marked.min.js');

    app.import('bower_components/blockies/blockies.js');

    app.import('bower_components/highcharts/highcharts.js');

    app.import('bower_components/sweetalert/dist/sweetalert.css');
    app.import('bower_components/sweetalert/dist/sweetalert-dev.js');

    app.import('bower_components/codemirror/lib/codemirror.css');
    app.import('bower_components/codemirror/addon/lint/lint.css');
    app.import('bower_components/codemirror/lib/codemirror.js');
    app.import('bower_components/codemirror/mode/javascript/javascript.js');
    app.import('bower_components/codemirror/mode/clike/clike.js');
    app.import('bower_components/codemirror/mode/markdown/markdown.js');
    app.import('bower_components/codemirror/addon/edit/matchbrackets.js');
    app.import('bower_components/codemirror/addon/selection/active-line.js');
    app.import('vendor/cm-lint-custom.js');
    app.import('vendor/cm-lint-result.js');

    app.import('bower_components/jq-console/lib/jqconsole.js');

    app.import('bower_components/socket.io-client/socket.io.js');
    app.import('bower_components/ember-sockets/dist/ember-sockets.js');

    app.import('vendor/brython/www/src/brython.js');
    app.import('vendor/debugger/main.js');

    app.import('bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js');

    // app.import('bower_components/katex/dist/katex.min.css');
    // app.import('bower_components/katex/dist/katex.min.js');

    return app.toTree(extraAssets);

};
