import Ember from 'ember';
import iframeTemplate from 'kodr/demo/iframe';
import stuff from "kodr/sandbox/stuff";

export default Ember.Component.extend({
    didInsertElement: function() {
        var that = this;
        this.$().hide();
        if(!this.get('show')) {
            this.$().show();
        }
        stuff(window.location.origin + '/iframe.html', this.$()[0], function(context) {
            that.set('sandbox', context);
            context.load(iframeTemplate, function () {
                that.sendAction('sandboxLoaded', context);
            });
        });
    }
});
