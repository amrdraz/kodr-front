import Ember from 'ember';
import iframeTemplate from 'kodr/demo/empty';
import stuff from "kodr/sandbox/stuff";

export default Ember.Component.extend({

    write: function (text, type) {
        console.log(text);
        this.get('console').Write(text, type);
    },
    clear: function () {
        this.get('console').Clear();
    },
    didInsertElement: function() {
        var component = this;
        var controller = this.get('controller');
        this.EventBus.subscribe('console.write', this, this.write);
        this.EventBus.subscribe('console.clear', this, this.clear);
        var that = this;
        var header = 'This is a console for you to test your code!\n' +
            'You can either run your code in console to see what happens\n' +
            'When you are ready try submitting your code to see the results\n';

        stuff(window.location.origin + '/iframe.html', this.$()[0], function(context) {
            controller.set('csandbox', context); // this is not working
            context.load(iframeTemplate, function() {
                var jqconsole = that.$().jqconsole(header, "");
                that.set('console', jqconsole);
                controller.set('console', jqconsole);
                // Abort prompt on Ctrl+Z.
                jqconsole.RegisterShortcut('Z', function() {
                    jqconsole.AbortPrompt();
                    handler();
                });
                // Move to line start Ctrl+A.
                jqconsole.RegisterShortcut('A', function() {
                    jqconsole.MoveToStart();
                    handler();
                });
                // Move to line end Ctrl+E.
                jqconsole.RegisterShortcut('E', function() {
                    jqconsole.MoveToEnd();
                    handler();
                });
                // Clear Console Ctrl+K.
                jqconsole.RegisterShortcut('K', function() {
                    jqconsole.Clear();
                    handler();
                });
                jqconsole.RegisterMatching('{', '}', 'brace');
                jqconsole.RegisterMatching('(', ')', 'paran');
                jqconsole.RegisterMatching('[', ']', 'bracket');

                var log = function(msg) {
                    jqconsole.Write('==> ' + msg + '\n');
                };

                context.on('error', log);
                context.on('test.done', log);
                context.on('structure.done', log);
                context.on('log', log);

                // Handle a command.
                var handler = function(command) {
                    if (command) {
                        that.sendAction(component.get('eval'), command);
                    }
                    jqconsole.Prompt(true, handler, function(command) {
                        // Continue line if can't compile the command.
                        try {
                            Function(command);
                        } catch (e) {
                            if (/[\[\{\(]$/.test(command)) {
                                return 1;
                            } else {
                                if (/\n\s*$/.test(command)) {
                                    return false;
                                }
                                return 0;
                            }
                        }
                        return false;
                    });
                };

                // Initiate the first prompt.
                handler();
            });
        });
    },
    willClearRender: function() {
        this.EventBus.unsubscribe('console.write', this, this.write);
        this.EventBus.unsubscribe('console.clear', this, this.clear);
    }
});
