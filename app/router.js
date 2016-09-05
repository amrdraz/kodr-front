import Ember from "ember";
import config from "./config/environment";

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.reopen({
  notifyGoogleAnalytics: function() {
    return ga('send', 'pageview', {
      'page': this.get('url'),
      'title': this.get('url')
    });
  }.on('didTransition')
});

Router.map(function() {
  this.route('login', {
    path: 'login',
    queryParams: ['email']
  });
  this.route('forgotpass');
  this.route('logout');
  this.route('signup');
  this.route('about');
  this.route('profile');
  this.route('index', {
    path: '/'
  });
  this.resource('quest', {
    path: 'quest/:quest_id'
  }, function() {
    this.route('edit');
    this.route('assign');
  });
  this.resource('quests', {
    path: '/quests'
  }, function() {
    this.route('create');
  });
  this.resource('group', {
    path: 'group/:group_id'
  }, function() {
    this.route('edit');
  });
  this.resource('groups', {
    path: '/groups'
  }, function() {
    this.route('create');
    this.route('make');
  });
  this.resource('user', {
    path: 'user/:user_id'
  }, function() {
    this.route('edit');
  });
  this.resource('users', function() {
    this.route('create');
  });
  this.route('userArena', {
    path: '/arena/:user_arena_id' //used to load a user arena
  }, function() {
    this.route('trial', {
      path: '/try/:trial_id' //used to load trial
    });
  });

  this.resource('userArenas', {
    path: '/user-arenas' //used to load user arenas
  }, function() {});

  this.resource('challengeTrial', {
    path: '/trial/:challenge_id'
  });
  this.resource('arena', {
    path: '/arenas/:arena_id'
  }, function() {
    this.route('edit');
    this.resource('challenge', {
      path: 'challenge/:challenge_id'
    }, function() {
      this.route('edit');
      this.route('try');
      this.route('copy');
    });
    this.resource('challenges', {
      path: 'challenge'
    }, function() {
      this.route('create');
    });
  });
  this.resource('arenas', {
    path: '/arenas'
  }, function() {
    this.route('create');
  });
  this.route('trial');

  //discussions route
  this.route('discussions', function() {
    this.route('top');
    this.route('new');
    this.route('my-posts');
    this.route('tag', {
      path: '/tag/:tag_id'
    });
    this.route('view', {
      path: '/view/:post_id'
    });
    this.route('edit', {
      path: '/edit/:post_id'
    });
  });
  this.route('solution', {
    path: 'solution/:post_id'
  }, function() {
    this.route('new',{path: 'solution/new/:post_id'});
  });
});

export default Router;
