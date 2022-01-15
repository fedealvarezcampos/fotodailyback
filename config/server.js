const cronTasks = require('./cron-tasks');

module.exports = ({ env }) => ({
	cron: {
		enabled: true,
		tasks: cronTasks,
	},
	host: env('HOST', '0.0.0.0'),
	port: env.int('PORT', 1337),
});
