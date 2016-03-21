import Ember from 'ember';

var MathJax = window.MathJax;
var marked = window.marked;

export default Ember.Component.extend({
    classNames: ['preview'],
    preview: null, // filled in by Init below
    buffer: null, // filled in by Init below
    mjRunning: false, // true when MathJax is processing
    oldText: null, // used to check if an update is needed
    math: false,
    //
    //  Get the preview and buffer DIV's
    //
    PreviewDone: function() {
        var text = "";
        if(this.get('math') && MathJax) {
            this.mjRunning = false;
            text = this.buffer.innerHTML;
            // replace occurrences of &gt; at the beginning of a new line
            // with > again, so Markdown blockquotes are handled correctly
            text = text.replace(/^&gt;/mg, '>');
        } else {
            text = this.get('model').get(this.get('observable'));
        }
        this.preview.innerHTML = marked(text);
    },
    Escape: function(html, encode) {
        return html.
            replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;').
            replace(/</g, '&lt;').
            replace(/>/g, '&gt;').
            replace(/"/g, '&quot;').
            replace(/'/g, '&#39;');
    },
    //
    //  Creates the preview and runs MathJax on it.
    //  If MathJax is already trying to render the code, return
    //  If the text hasn't changed, return
    //  Otherwise, indicate that MathJax is running, and start the
    //    typesetting.  After it is done, call PreviewDone.
    //
    CreatePreview: function() {
        if (this.mjRunning) { return; }
        var text = this.get('model').get(this.get('observable'));
        if (text === this.oldtext) { return; }
        // text = this.Escape(text); //Escape tags before doing stuff
        this.buffer.innerHTML = this.oldtext = text;
        this.mjRunning = true;
        // MathJax.InputJax.TeX is undefined first time the page loads
        // don't know if it will cause a bug later but everything seems to work fine
        if(MathJax.InputJax.TeX) {
            MathJax.Hub.Queue(
            ["Typeset", MathJax.Hub, this.buffer], ["PreviewDone", this], ["resetEquationNumbers", MathJax.InputJax.TeX]
        );
        } else {
            MathJax.Hub.Queue(
            ["Typeset", MathJax.Hub, this.buffer], ["PreviewDone", this]
        );
        }

    },

    // renderMathMark: function () {
    //     var text = this.get('model').get(this.get('observable'));
    //     if (text === this.oldtext) { return; }
    //     text = this.Escape(text);
    //     this.preview.innerHTML = marked(katex.renderToString(text));
    // },

    didInsertElement: function() {
        var component = this;
        this.marked = marked;
        this.preview = this.$()[0];
        // element for MathJax
        this.buffer = this.$('<div>')[0];

        if(!this.get('model').get(this.get('observable'))) {
            this.get('model').set(this.get('observable'), "");
        }

        this.marked.setOptions({
            renderer: new marked.Renderer(),
            highlight: function(code) {
                if(window.hljs){
                    return window.hljs.highlightAuto(code).value;
                } else {
                    return code;
                }
            },
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false
        });
        var callback;
        if(this.get('math') && MathJax) {
            callback = this.callback = MathJax.Callback(["CreatePreview", this]);
            callback.autoReset = true;
        } else {
            callback = this.callback = this.PreviewDone.bind(this);
        }
        // var that = this;
        // this. once = function () {
        //     if(!that.isDestroyed){
        //         callback();
        //     } else {
        //         // because the observer is still attached
        //         this.removeObserver(that.get('observable'), this, once);
        //     }
        // };
        this.get('model').addObserver(this.get('observable'), this.get('model'),this.callback);
        callback();
    },
    willDestroyElement: function () {
        this.get('model').removeObserver(this.get('observable'), this.get('model'),this.callback);
    }
});
