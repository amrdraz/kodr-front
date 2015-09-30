import Ember from 'ember';

export default Ember.Component.extend({

    write: function (text, type) {
        console.log(text);
        this.get('console').Write(text, type);
    },
    clear: function () {
        this.get('console').ClearPromptText(true);
        this.get('console').Clear(true);
    },
    didInsertElement: function() {
        var component = this;
        var header = this.get('header') || `This is a console for you to test your code!
You can either run your code in console to see what happens
When you are ready try submitting your code to see the results\n`;

        var jqconsole = component.$().jqconsole(header, "");

        component.set('console', jqconsole);
        
        this.EventBus.subscribe('console.write', this, this.write);
        this.EventBus.subscribe('console.clear', this, this.clear);

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

        // Handle a command.
        var handler = function(command) {
            if (command) {
                component.sendAction(component.get('eval'), command);
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
    },
    willClearRender: function() {
        this.EventBus.unsubscribe('console.write', this, this.write);
        this.EventBus.unsubscribe('console.clear', this, this.clear);
    }
});
