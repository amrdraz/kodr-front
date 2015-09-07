import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('challenge-settings-javascript', 'Integration | Component | challenge settings javascript', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{challenge-settings-javascript}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#challenge-settings-javascript}}
      template block text
    {{/challenge-settings-javascript}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
