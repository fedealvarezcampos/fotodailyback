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

// {
// 	method: 'GET',
// 	path: '/newsitems/:id/likes',
// 	handler: 'newsitem.likes',
// 	config: {
// 		find: {
// 			auth: false,
// 		},
// 	},
// },
