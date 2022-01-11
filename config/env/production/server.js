const cronTasks = require('../../cron-tasks');

module.exports = ({ env }) => ({
	cron: {
		enabled: true,
		tasks: cronTasks,
	},
	url: env('MY_HEROKU_URL'),
});
