import Ember from 'ember';

export default Ember.Component.extend({
    modalSubscribe: function() {
        this.EventBus.subscribe('flow.modal.show', this, this.show);
    }.on('didInsertElement'),
    modalUnSubscribe: function() {
        this.EventBus.unsubscribe('flow.modal.show', this, this.show);
    }.on('willDestroy'),
    actions: {
        ok: function() {
            this.$('.modal').modal('hide');
            this.sendAction('ok');
        }
    },
    show: function() {
        if(this.get('noClose')) {
            this.set('backdrop', 'static');
            this.set('keyboard', false);
        }
        this.$('.modal').modal({backdrop: this.get('backdrop') || true, keyboard: this.get('keyboard') || true}).on('hidden.bs.modal', function() {
            if (!this.get('noClose')) { this.sendAction('close'); }
        }.bind(this));
    }.on('didInsertElement')
});
