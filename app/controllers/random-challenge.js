import Ember from 'ember';
var toastr = window.toastr;
var swal = window.swal;
var marked = window.marked;
import Mixed from 'kodr/models/mixed';


export default Ember.Controller.extend({
	classNames: ['preview'],
	random: true,
	started: false,
	arena: {},
	trial: null,
	componentModel: null,
	challenge: null,
	trials: null,
	userArena: null,
	progress: null,
	clearForm: function() {
		this.setProperties({
			started: false,
			trial: null,
			componentModel: null,
			challenge: null,
			trials: null,
			userArena: null,
			progress: null
		});
	},
	actions: {
		start() {

			var controller = this;

		    var found = false;
            
		    this.set('trial', this.trials.toArray()[0]);	    

            this.trials.map(function(trial) {
                
                if(!trial.get('complete')) {

		        	trial.set('work', Mixed.create({
		                solution: trial.get('challenge.blueprint.setup')
		            }));
			        trial.set('blueprint', Mixed.create(trial.get('challenge.blueprint').toJSON()));
			        console.log(Mixed.create(trial.get('challenge.blueprint').toJSON()));

	                controller.set('componentModel', trial);
	                var proxy = Ember.ObjectProxy.create({
	                  content: trial
	                });
	                
	                controller.set('challenge', proxy);
	            }

                return;
                
            });
			
	        


		},
		next() {
			console.log('NEXT');
			console.log(this.trials.toArray().length);
			this.trials.removeObjects([this.componentModel]);
			this.set('componentModel', null);
			this.get('userArena').notifyPropertyChange('progress');
			this.send('start');
			
		},
		computeProgress() {
			var userArena = this.userArena;
			var progress = this.progress;
			var progDelta = (1 / this.trials.toArray().length) * 100;
			progDelta = Math.round(progDelta);
			progress += progDelta;
			console.log("NEW PROGRESS ", progress);
			// userArena.progress = Math.round(prog)
			// this.set('userArena', userArena)
			this.send('start');
		}
	}
});