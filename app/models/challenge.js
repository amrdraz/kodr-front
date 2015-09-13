import DS from 'ember-data';

var attr = DS.attr;
export default DS.Model.extend({
    name: attr('string', {
        defaultValue: "New Challenge"
    }),
    type: attr('string', {defaultValue:'python'}),
    order: attr('number', {defaultValue:0}),
    group: attr('string', {defaultValue:null}),
    exp: attr('number', {defaultValue:10}),
    blueprint: attr(),

        "import": attr('string'),
        inputs: attr('javaInput', {defaultValue:[]}),
        setup: attr('string', {
            defaultValue: ""
        }),
        solution: attr('string', {
            defaultValue: ""
        }),
        tests: attr('string', {
            defaultValue: ""
        }),
        description: attr('string', {
            defaultValue: "A new Challenge"
        }),

    status: attr('string', {
        defaultValue: "unPublished"
    }),
    statusOptions: ['unPublished', 'Beta', 'Published'],
    isPublished: attr('boolean', {
        defaultValue: false
    }),
    valid: attr('boolean', {
        defaultValue: false
    }),
    arena: DS.belongsTo('arena', {
        async: true,
        inverse: 'challenges'
    }),
    author: DS.belongsTo('user', {
        async: true,
        inverse: 'challenges'
    }),

    expOptions: [
    {
        rank:'none',
        points: 0,
    }, {
        rank: "direct",
        points: 10
    }, {
        rank: "simple",
        points: 20
    }, {
        rank: "easy",
        points: 40
    }, {
        rank: "medium",
        points: 80
    }, {
        rank: "challenging",
        points: 160
    }, {
        rank: "hard",
        points: 320
    }],

    isJava: function () {
        return this.get('type')==='java';
    }.property('type'),
    isJS: function () {
        return this.get('type')==='javascript';
    }.property('type'),
    isPython: function () {
        return this.get('type')==='python';
    }.property('type'),

    // relationshipChanged: false,
    canSave: function() {
        return !this.get('isSaving') && this.get('hasDirtyAttributes') || this.get('isNew');
    }.property('hasDirtyAttributes', 'isSaving', 'isNew'),
    canReset: function() {
        return !this.get('isSaving') && this.get('hasDirtyAttributes') && !this.get('isNew');
    }.property('hasDirtyAttributes', 'isSaving'),
    canPublish: function() {
        return !this.get('canSave') && !this.get('isPublished') && this.get('valid');
    }.property('canSave')
});