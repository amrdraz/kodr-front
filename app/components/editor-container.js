/*global CodeMirror*/
import Ember from 'ember';
var $ = Ember.$;
export default Ember.Component.extend({
    target: Ember.computed.alias("targetObject"),
    showConsole() {
        this.$('[href=#console]').tab('show');
    },
    editorLint(cmId, errs) {
        var cm = Ember.$('#'+cmId+'Editor').data('CodeMirror');
        cm.updateLinting(CodeMirror.lintResult(errs));
    },
    editorLine(cmId, line){
        var cm = Ember.$('#'+cmId+'Editor').data('CodeMirror');
        cm.getDoc().setCursor(line - 1, {
                scroll: true
        });
    },
    didInsertElement: function() {
        this.EventBus.subscribe('console.show', this, this.showConsole);
        this.EventBus.subscribe('editor.lint', this, this.editorLint);
        this.EventBus.subscribe('editor.line', this, this.editorLine);
        // this.get('controller').trigger('console.show');
        //refresh code editor tabs when selected
        Ember.$('[data-toggle="tab"]').on('shown.bs.tab', function() {
            // debugger;
            var editor = $($(this).attr('href') + 'Editor');
            if (editor.length !== 0) {
                editor.data('CodeMirror').refresh();
                editor.data('CodeMirror').focus();
            }
        });
    },
    willClearRender: function() {
        this.EventBus.unsubscribe('console.show', this, this.showConsole);
        this.EventBus.unsubscribe('editor.lint', this, this.editorLint);
        this.EventBus.unsubscribe('editor.line', this, this.editorLine);
    }
});
