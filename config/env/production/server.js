const cronTasks = require('../../cron-tasks');

module.exports = ({ env }) => ({
	cron: {
		enabled: true,
		tasks: cronTasks,
	},
	auth: {
		secret: env('JWT_SECRET'),
	},
	url: env('MY_HEROKU_URL'),
});
