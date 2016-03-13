import DS from 'ember-data';

export default DS.Model.extend({
  text: DS.attr('string'),
  comment: DS.belongsTo('comment',{async: true}),
  author: DS.belongsTo('user', {async: true}),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date')
});
