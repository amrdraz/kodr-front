/*global CodeMirror*/
import Ember from 'ember';
var $ = Ember.$;
export default Ember.Component.extend({
    target: Ember.computed.alias("targetObject"),
    showConsole() {
        this.$('[href=#console]').tab('show');
    },
    editorLint(cmId, errs) {
        var cm = Ember.$('#' + cmId + 'Editor').data('CodeMirror');
        cm.updateLinting(CodeMirror.lintResult(errs));
    },
    editorLine(cmId, line) {
        var cm = Ember.$('#' + cmId + 'Editor').data('CodeMirror');
        cm.getDoc().setCursor(line - 1, {
            scroll: true
        });
    },
    clearDebugPointer(cmId) {
        var cm = Ember.$('#' + cmId + 'Editor').data('CodeMirror');
        cm.clearGutter("cm-trace-marker");
    },
    setDebugLinePointer(cmId, line) {
        var cm = Ember.$('#' + cmId + 'Editor').data('CodeMirror');
        cm.clearGutter("cm-trace-marker");
        cm.setGutterMarker(line - 1, "cm-trace-marker", makeMarker());
    },
    editorPast(cmId, text) {
        var cm = Ember.$('#' + cmId).data('CodeMirror');
        cm.getDoc().replaceRange(text, cm.getDoc().getCursor());
    },
    didInsertElement: function() {
        var that = this;
        this.EventBus.subscribe('console.show', this, this.showConsole);
        this.EventBus.subscribe('editor.lint', this, this.editorLint);
        this.EventBus.subscribe('editor.line', this, this.editorLine);
        this.EventBus.subscribe('editor.pointer.clear', this, this.clearDebugPointer);
        this.EventBus.subscribe('editor.pointer.line', this, this.setDebugLinePointer);
        this.EventBus.subscribe('editor.past', this, this.editorPast);
        // this.get('controller').trigger('console.show');
        //refresh code editor tabs when selected
        Ember.$('[data-toggle="tab"]').on('shown.bs.tab', function() {
            // debugger;
            var editor = $($(this).attr('href') + 'Editor');
            if (editor.length !== 0) {
                editor.data('CodeMirror').refresh();
                editor.data('CodeMirror').focus();
            }
        }).on('click', function() {
            that.EventBus.publish("trial.event.tab.select", $(this).attr("href").substr(1));
        });

        Ember.$('.tab-content .tab-pane').on('click', function() {
            that.EventBus.publish("trial.event.tab.select", $(this).attr("id"));
        });
    },
    willClearRender: function() {
        this.EventBus.unsubscribe('console.show', this, this.showConsole);
        this.EventBus.unsubscribe('editor.lint', this, this.editorLint);
        this.EventBus.unsubscribe('editor.line', this, this.editorLine);
        this.EventBus.unsubscribe('editor.past', this, this.editorPast);
        this.EventBus.unsubscribe('editor.pointer.clear', this, this.clearDebugPointer);
    }
});

function makeMarker() {
    var marker = document.createElement("div");
    marker.className = "cm-debug-arrow";
    marker.innerHTML = "➤";
    return marker;
}
