import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var application;
var originalConfirm;
var confirmCalledWith;

function defineFixturesFor(name, fixtures) {
  var modelClass = application.__container__.lookupFactory('model:' + name);
  modelClass.FIXTURES = fixtures;
}

module('Acceptance: Arena', {
  beforeEach: function() {
    application = startApp();
    defineFixturesFor('arena', []);
    originalConfirm = window.confirm;
    window.confirm = function() {
      confirmCalledWith = [].slice.call(arguments);
      return true;
    };
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
    window.confirm = originalConfirm;
    confirmCalledWith = null;
  }
});

test('visiting /arenas without data', function(assert) {
  visit('/arenas');

  andThen(function() {
    assert.equal(currentPath(), 'arenas.index');
    assert.equal(find('#blankslate').text().trim(), 'No Arenas found');
  });
});

test('visiting /arenas with data', function(assert) {
  defineFixturesFor('arena', [{ id: 1 }]);
  visit('/arenas');

  andThen(function() {
    assert.equal(currentPath(), 'arenas.index');
    assert.equal(find('#blankslate').length, 0);
    assert.equal(find('table tbody tr').length, 1);
  });
});

test('create a new arena', function(assert) {
  visit('/arenas');
  click('a:contains(New Arena)');

  andThen(function() {
    assert.equal(currentPath(), 'arenas.new');


    click('input:submit');
  });

  andThen(function() {
    assert.equal(find('#blankslate').length, 0);
    assert.equal(find('table tbody tr').length, 1);
  });
});

test('update an existing arena', function(assert) {
  defineFixturesFor('arena', [{ id: 1 }]);
  visit('/arenas');
  click('a:contains(Edit)');

  andThen(function() {
    assert.equal(currentPath(), 'arenas.edit');


    click('input:submit');
  });

  andThen(function() {
    assert.equal(find('#blankslate').length, 0);
    assert.equal(find('table tbody tr').length, 1);
  });
});

test('show an existing arena', function(assert) {
  defineFixturesFor('arena', [{ id: 1 }]);
  visit('/arenas');
  click('a:contains(Show)');

  andThen(function() {
    assert.equal(currentPath(), 'arenas.show');

  });
});

test('delete a arena', function(assert) {
  defineFixturesFor('arena', [{ id: 1 }]);
  visit('/arenas');
  click('a:contains(Remove)');

  andThen(function() {
    assert.equal(currentPath(), 'arenas.index');
    assert.deepEqual(confirmCalledWith, ['Are you sure?']);
    assert.equal(find('#blankslate').length, 1);
  });
});
