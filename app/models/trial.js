import DS from 'ember-data';

export default  DS.Model.extend({
    work: DS.attr('mixed'),
    blueprint: DS.attr('mixed'),
    times: DS.attr('number'),
    exp: DS.attr('number'),
    order: DS.attr('number'),
    started: DS.attr('boolean'),
    startTime: DS.attr('date'),
    endTime: DS.attr('date'),
    complete: DS.attr('boolean'),
    completed: DS.attr('number'),
    report:DS.attr(),
    challenge: DS.belongsTo('challenge', {async:true}),
    user: DS.belongsTo('user'),
    arena: DS.belongsTo('arena'),
    userArena: DS.belongsTo('userArena'),

    canSubmit: function () {
        return !this.get('complete') || this.get('hasDirtyAttributes') || this.get('contentChanged');
    }.property('complete', 'hasDirtyAttributes', 'contentChanged'),


    contentChanged: false,
    save() {
        this.set('contentChanged', false);
        return this._super.apply(this, arguments);
    },
    set: function(keyName, value) {
        this._super(keyName, value);
        if (keyName.indexOf('blueprint.') > -1 || keyName.indexOf('work.') > -1) {
            // a property of `blueprint` has changed => notify observers of `blueprint`
            this.notifyPropertyChange(keyName);
            this.set('contentChanged', true);
        }
    }
});
