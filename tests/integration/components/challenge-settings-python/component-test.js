import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('challenge-settings-python', 'Integration | Component | challenge settings python', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{challenge-settings-python}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#challenge-settings-python}}
      template block text
    {{/challenge-settings-python}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
