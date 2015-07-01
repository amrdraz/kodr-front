import Ember from 'ember';

function escape(html, encode) {
        return html
            .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

export default Ember.Handlebars.helper('markdown-helper', function(value, options) {
    marked.setOptions({
        renderer: new marked.Renderer(),
        highlight: function(code) {
            return require('highlight.js').highlightAuto(code).value;
        },
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
    });

    return marked(escape(value));
});
