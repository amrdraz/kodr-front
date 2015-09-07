import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('challenge/game/challenge-trial-game', 'Integration | Component | challenge/game/challenge trial game', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{challenge/game/challenge-trial-game}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#challenge/game/challenge-trial-game}}
      template block text
    {{/challenge/game/challenge-trial-game}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
