module.exports = {
	routes: [
		{
			method: 'GET',
			path: '/newsitems/:id/likes',
			handler: 'newsitem.likes',
			config: {
				find: {
					auth: false,
				},
			},
		},
	],
};
