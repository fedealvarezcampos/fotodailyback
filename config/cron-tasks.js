module.exports = {
	'0 18 * * *': async ({ strapi }) => {
		await strapi.config.tasks.updateFeed();
	},
};

// options: {
// 	tz: 'Asia/Dhaka',
// },
