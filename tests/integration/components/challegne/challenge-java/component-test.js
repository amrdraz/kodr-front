import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('challegne/challenge-java', 'Integration | Component | challegne/challenge java', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{challegne/challenge-java}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#challegne/challenge-java}}
      template block text
    {{/challegne/challenge-java}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
