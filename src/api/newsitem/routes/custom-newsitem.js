module.exports = {
	routes: [
		{
			method: 'POST',
			path: '/newsitems/:id/likes',
			handler: 'newsitem.like',
			config: {
				find: {
					auth: true,
				},
			},
		},
	],
};
