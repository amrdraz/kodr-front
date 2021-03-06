import DS from 'ember-data';


export default DS.Model.extend({
    name: DS.attr('string', {
        defaultValue: "new group"
    }),
    exp: DS.attr('number'),
    members: DS.hasMany('member', {
        async: true,
        inverse: 'group'
    }),
});