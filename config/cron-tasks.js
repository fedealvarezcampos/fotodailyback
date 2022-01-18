module.exports = {
	'40 20 * * *': async ({ strapi }) => {
		await strapi.config.tasks.updateFeed();
	},
};

// options: {
// 	tz: 'Asia/Dhaka',
// },
