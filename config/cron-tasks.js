module.exports = {
	'0 0 * * *': async ({ strapi }) => {
		await strapi.config.tasks.updateFeed();
	},
};

// options: {
// 	tz: 'Asia/Dhaka',
// },
