module.exports = {
	'45 21-22 * * *': async ({ strapi }) => {
		await strapi.config.tasks.updateFeed();
	},
};

// options: {
// 	tz: 'Asia/Dhaka',
// },
