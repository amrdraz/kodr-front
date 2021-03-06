import Ember from 'ember';
import debounce from 'kodr/utils/debounce';
var CodeMirror = window.CodeMirror;

function getMIME(lang) {
    if (lang === 'java') {
        return 'text/x-java';
    }
    if (lang === 'c') {
        return 'text/x-csrc';
    }
    if (lang === 'python') {
        return 'text/x-python';
    }
    if (lang === 'cpp') {
        return 'text/x-c++src';
    }
    if (lang === 'c#') {
        return 'text/x-csharp';
    }
    return lang;
}

function getMode(lang) {
    switch (lang) {
        case 'java':
        case 'javascript':
            return {
                name: getMIME(lang),
                globalVars: true,
                singleLineStringErrors: false
            };
        case 'python':
            return {
                name: "python",
                version: 3,
                singleLineStringErrors: false
            };
        default:
            return {
                name: lang,
                globalVars: true,
                singleLineStringErrors: false
            };
    }
}

export default Ember.Component.extend({
    tagName: 'textarea',
    updateEditor: function() {
        var editor = this.get('editor');
        var model = this.get('model');
        var attr = this.get('attr');
        if (editor.getDoc().getValue() !== model.get(attr)) {
            editor.getDoc().setValue(model.get(attr) || '');
        }
    },
    setValue: function(cm) {
        var model = this.get('model');
        var attr = this.get('attr');

        // if (this.get('language') === 'python') {
        //     var text = cm.getValue();
        //     if (text.charAt(text.length - 1) !== "\n") {
        //         var cursor = cm.getDoc().getCursor();
        //         cm.setValue(text + "\n");
        //         cm.getDoc().setCursor(cursor, {
        //             scroll: true
        //         });
        //     }
        // }

        model.set(attr, cm.getValue());
    },
    changeMode: function() {
        var editor = this.get('editor');
        var model = this.get('model');
        editor.setOption("mode", getMode(model.get('language')));
    },
    didInsertElement: function() {
        var component = this;
        var model = this.get('model');
        var config = {
            autofocus: true,
            lineNumbers: true,
            indentUnits: 2,
            gutters: ["CodeMirror-linenumbers"],
            lineWrapping: true,
            styleActiveLine: true,
            mode: getMode(this.get('language') || model.get('language'))
        };
        var attr = this.get('attr') || 'content';
        var lint = this.get('lint');
        var debug = this.get('debug');
        // compileErrors
        if (lint) {
            config.gutters.unshift("CodeMirror-lint-markers");
            config.lint = {};
            // this.get('controller').on('spy', this, this.spy);
        }
        if(debug) {
            config.gutters.unshift("cm-trace-marker");
        }

        var editor = CodeMirror.fromTextArea(this.element, config);

        editor.setOption("extraKeys", {
            Tab: function(cm) {
                var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
                cm.replaceSelection(spaces);
            }
        });

        editor.getDoc().setValue(model.get(attr) || '');


        model.addObserver(attr, component, this.updateEditor);
        if (!this.get('language')) {
            model.addObserver('language', model, this.changeMode);
        }

        editor.on('change', debounce(this.setValue.bind(this)));

        this.set('editor', editor);
        //inorder to access it by selecting the element
        this.$().data('CodeMirror', editor);
    },
    willDestroyElement: function() {
        this.get('model').removeObserver(this.get('attr'), this, this.updateEditor);
        if (!this.get('language')) {
            this.get('model').removeObserver('language', this.get('model'), this.changeMode);
        }
        // this.get('lint') && this.get('controller').off('spy', this, this.spy);
    }
});
