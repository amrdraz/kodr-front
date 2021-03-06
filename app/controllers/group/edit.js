import Ember from 'ember';
import DS from 'ember-data';


export default Ember.Controller.extend({
    breadCrumb: 'group',
    breadCrumbPath: 'group',
    // needs: ['group'],
    init: function() {
        this._super();
        this.resetGroupOptions();
    },
    isCreating: function () {
        return this.container.lookup('controller:application').get('currentPath').split('.').contains('create');
    }.property('currentPath'),
    getGroupOptionsFor: function(option) {
        var store = this.store;
        var dfd = DS.PromiseArray.create({
            promise: Ember.$.getJSON('api/groups/' + this.get('id') + '/'+option+'Options').then(function(response) {
                return response.map(function(record) {
                    record.id = record._id;
                    return store.push('user', record);
                });
            })
        });
        return dfd;
    },
    resetGroupOptions: function () {
        this.set('teacherOptions',this.getGroupOptionsFor('teacher'));
        this.set('studentOptions',this.getGroupOptionsFor('student'));     
        this.set('selectedTeachers', []);      
        this.set('selectedStudents', []);      
    },
    teacherOptions:[],
    studentOptions:[],
    selectedTeachers: [],
    selectedStudents: [],
    actions: {
        save: function() {
            var that = this;
            if (this.get('model.hasDirtyAttributes')) {
                this.get('model').save().then(function (g) {
                    if (this.get('currentPath').split('.').contains('create')) {
                        that.transitionToRoute('group.edit', g);
                    }
                });
            }
            if (this.get('selectedTeachers').length) {
                console.log(this.get('selectedTeachers').mapBy('id'));
                Ember.$.ajax({
                    url: '/api/groups/' + this.get('model.id') + '/members',
                    method:'POST',
                    data: {
                        uids: this.get('selectedTeachers').mapBy('id')
                    }
                }).done(function(members) {
                    that.store.pushPayload(members);
                    that.resetGroupOptions();
                });
            }
            if (this.get('selectedStudents').length) {
                Ember.$.ajax({
                    url: '/api/groups/' + this.get('model.id') + '/members',
                    method:'POST',
                    data: {
                        uids: this.get('selectedStudents').mapBy('id')
                    }
                }).done(function(members) {
                    that.store.pushPayload(members);
                    that.resetGroupOptions();
                });
            }
        },
        delete: function() {
            var newModel = this.get('model.isNew');
            this.get('model').destroyRecord();
            if (!newModel) {
                this.get('model').save();
            }
            this.transitionToRoute('groups');
        },
        remove: function(member) {
            var that = this;
            Ember.$.ajax({
                url: '/api/groups/' + member.get('group.id') + '/members/' + member.get('data.user.id'),
                type: 'DELETE'
            }).done(function (data) {
                that.store.pushPayload(data);
            }).fail(function (err) {
                console.log(err);
            });
        }
    }
});