'use strict';

/**
 * newsitem service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::newsitem.newsitem', ({ strapi }) => ({
	async find(...args) {
		const { results, pagination } = await super.find(...args);

		const entries = await strapi.entityService.findMany('api::newsitem.newsitem', {
			fields: ['title'],
			populate: {
				users: {
					id: true,
				},
			},
		});

		results.map((e, i) => (e.likes = entries[i].users.length));

		return { results, pagination };
	},

	async getAlreadyExistingUserIDs(postID) {
		const existingUsers = await strapi.entityService.findOne('api::newsitem.newsitem', postID, {
			fields: ['title'],
			populate: '*',
		});

		const usersThatAlreadyLiked = existingUsers?.users;

		let existingUserIDs = [];

		for (const user of usersThatAlreadyLiked) {
			existingUserIDs.push(user?.id);
		}

		return existingUserIDs;
	},
}));
