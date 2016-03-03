import Ember from 'ember';
var toastr = window.toastr;
var swal = window.swal;
var marked = window.marked;
import Mixed from 'kodr/models/mixed';


export default Ember.Controller.extend({
	classNames: ['preview'],
	random: true,
	started: false,
	challenges: {},
	arena: {},
	trial: null,
	componentModel: null,
	challenge: null,
	items: null,
	blueprint: null,
	actions: {
		start() {
			var challenge = this.challenges[0];

			var controller = this;

	        this.set('model.challenge', challenge)
		    
			challenge = {challenge: challenge};

		    var found = false;
            
		    this.set('trial', this.items.toArray()[0])	    

            this.items.map(function(item) {
                
                if(!item.get('complete')) {
	                controller.set('componentModel', item);
	                var proxy = Ember.ObjectProxy.create({
	                  content: item
	                });
	                
	                // controller.set('blueprint', item.get('challenge').get('blueprint'));
	                controller.set('challenge', proxy);
	            }

                return;
                
            });
			
	        


		},
		next() {
			console.log('NEXT')
			console.log(this.items.toArray().length)
			this.items.removeObjects([this.componentModel]);
			this.set('componentModel', null)
			this.send('start');
		}
	}
});