import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  title: DS.attr('string'),
  text: DS.attr('string'),
  totalVotes: DS.attr('number',{defaultValue: 0}),
  tags:DS.attr(),
  comments: DS.hasMany('comment', {async: true}),
  author: DS.belongsTo('user', {async: true}),
  challenge: DS.belongsTo('challenge',{async: true}),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date')
});
