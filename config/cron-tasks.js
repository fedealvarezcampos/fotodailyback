module.exports = {
	'30 22-23 * * *': async ({ strapi }) => {
		await strapi.config.tasks.updateFeed();
	},
};

// options: {
// 	tz: 'Asia/Dhaka',
// },
