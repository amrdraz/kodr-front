import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  text: DS.attr('string'),
  post: DS.belongsTo('post',{async: true}),
  author: DS.belongsTo('user',{async: true}),
  totalVotes: DS.attr('number',{defaultValue: 0}),
  replies: DS.hasMany('reply', {async: true}),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),
});
