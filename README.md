# Kodr-front


This is the front end of the Kodr project backend
Kodr is an online gamified learning system that teaches programing concepts. It does so through engaging students in challenges.

Users learn by partaking in challenges and following Quests which gives them experience, awarding them achivements.

Achievements showcase what the student learned and can be used to guide his learning process.

While running the challenges also track the user's behaviro patterns inside the challenge and ask about his flow state after every challenge.


####Supported Challenges

Kodr takes advantage of EmberJS's components and MongoDB's Mixed type by allowing a generic challenge system, ie a challenge can be anything.

Currently the existing challenge types are code specific and the supported languages are (Javascript, Python and [Java](https://github.com/amrdraz/java-code-runner)), evaluated using bdd styled tests.

That said javascript and python are run client side while Java is run on the server side

At the time of writing this the system focuses solely on supporting python challanges (which include a step back debugger) and the server was set to not run the Java server which evaluated the java code. Javascript challenges are also out of date.

## Prerequisites

You will need the following things properly installed on your computer to run and develop the front end of the project in addition to running the backend.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

In your developemnt folder of choice on your computer

* `git clone https://github.com/amrdraz/kodr-front.git`
* `cd kodr-front`
* `npm install`
* `bower install`

If you don't already have the backend part of the project

* `cd ..`
* `git clone https://github.com/amrdraz/kodr.git`
* `cd kodr`
* `npm install` you may need to `sudo npm install` depending on your setup

> see the backend repo for more on the backend dependencies, also note that the backend has one dependency for the email templates that will cause problems if you're on node 4+ this project uses node 12.7 will figure out something when I get the chance tho.  

## Running / Development

* run to terminal sessions (tabs) one for the backend and one for the front
* In the backend folder __kodr__ `node server.js` or if you have nodemon prefered `nodemon server.js`
* In the another termainl window go to the front end folder __kodr-front__ and
* `ember serve --proxy http://localhost:9000`
* Visit the app in the browser at [http://localhost:4200](http://localhost:4200).

### Adding your own custom challenges

We use the ember-cli pod sturcture for the challenges

An example to generate one do
`ember g component challenge/python/challenge-edit-python -p`
`ember g component challenge/python/challenge-trial-python -p`
`ember g component challenge/python/challenge-settings-python -p`

Every challenge has an edit component for creating the challenge and editing it, a trial component for what the user sees, and a settings component for extra settings that are challenge specific (API no stable and coudl change)

you will find the project has 3 challenge types at the moment [javascript, python, and java] use those as a starting point for the current convension.

Make use of the many generators for generating other components and mixins to aid your code, type `ember help generate` for more details or visit the ember-cli project

### Running Tests

there are currently no front end tests all tests are empty someon shoudl do something about this.

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment=production` (production)
* copy the brython folder in root and replace it with the brython folder in the dist folder
* copy the dist folder content to the kodr backend app folder

####Alternativly

Run build.sh from the termainal `./build.sh` after you give it execution permission

### Deploying

After building add the output that you get in dist to the app folder in the backend and deploy the backend

I use git to deploy on a virtual server running on digital ocean with nginx handeling the http and a poroxy to the backend app.

## Further Reading / Useful Links

* [brython.js](brython.info) The python to javascript library
* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

