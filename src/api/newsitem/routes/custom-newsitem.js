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
		{
			method: 'POST',
			path: '/newsitems/:id/save',
			handler: 'newsitem.save',
			config: {
				find: {
					auth: true,
				},
			},
		},
		{
			method: 'GET',
			path: '/newsitems/saved',
			handler: 'newsitem.savedItems',
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
// 	path: '/newsitems/mynews',
// 	handler: 'newsitem.userNews',
// 	config: {
// 		find: {
// 			auth: true,
// 		},
// 	},
// },
