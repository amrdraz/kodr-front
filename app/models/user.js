import DS from 'ember-data';

var attr = DS.attr;
var hasMany = DS.hasMany;

export default DS.Model.extend({
    uniId: attr('string'),
    username: attr('string'),
    email: attr('string'),
    exp: attr('number', {defaultValue:0}),
    rp: attr('number',{defaultValue:0}),
    role:attr('string'),
    activated:attr('boolean'),
    flags: attr(),

    challenges: hasMany('challenge', {async: true, inverse: 'author'}),
    arenas: hasMany('arena', {async: true, inverse: 'author'}),
    
    trials: hasMany('trial',{async: true, inverse: 'user'}),
    userArenas: hasMany('userArena',{async: true, inverse: 'user'}),

    memberships: hasMany('member',{async: true, inverse: 'user'}),

    userQuests: hasMany('userQuest', {async:true,inverse:'user'}),

    roles:['student','teacher'],
    
    isStudent:function () {
        return this.get('role')==='student';
    }.property('role'),
    isTeacher:function () {
        return this.get('role')==='teacher';
    }.property('role'),
    isAdmin:function () {
        return this.get('role')==='admin';
    }.property('role'),
    canJoinGroups:function () {
        return !this.get('memberships.length') || !this.get('isStudent');
    }.property('memberships.[]','role')
});