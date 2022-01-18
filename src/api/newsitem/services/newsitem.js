'use strict';

/**
 * newsitem service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::newsitem.newsitem', ({ strapi }) => ({
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
