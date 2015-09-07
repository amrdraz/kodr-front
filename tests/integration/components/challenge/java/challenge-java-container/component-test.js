import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('challenge/java/challenge-java-container', 'Integration | Component | challenge/java/challenge java container', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{challenge/java/challenge-java-container}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#challenge/java/challenge-java-container}}
      template block text
    {{/challenge/java/challenge-java-container}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
