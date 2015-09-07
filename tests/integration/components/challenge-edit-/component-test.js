import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('challenge-edit-', 'Integration | Component | challenge edit ', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{challenge-edit-}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#challenge-edit-}}
      template block text
    {{/challenge-edit-}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
