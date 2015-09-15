import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('import-arena-modal', 'Integration | Component | import arena modal', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{import-arena-modal}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#import-arena-modal}}
      template block text
    {{/import-arena-modal}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
