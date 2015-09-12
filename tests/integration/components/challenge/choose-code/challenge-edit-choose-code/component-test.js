import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('challenge/choose-code/challenge-edit-choose-code', 'Integration | Component | challenge/choose code/challenge edit choose code', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{challenge/choose-code/challenge-edit-choose-code}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#challenge/choose-code/challenge-edit-choose-code}}
      template block text
    {{/challenge/choose-code/challenge-edit-choose-code}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
