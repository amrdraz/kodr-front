import EventBus from 'kodr/services/event-bus';

export default {
  name: 'event-bus',
  initialize: function(container, application) {
    var eventBus = EventBus.create();

    application.register('event-bus:current', eventBus, {
      instantiate: false
    });

    application.inject('component', 'EventBus', 'event-bus:current');
    application.inject('controller', 'EventBus', 'event-bus:current');
  }
};