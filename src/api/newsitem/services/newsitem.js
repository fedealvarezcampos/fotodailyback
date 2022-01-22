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

	async getSavedItemsIDs(userID) {
		const entry = await strapi.entityService.findOne('plugin::users-permissions.user', userID, {
			populate: { saveditems: true },
		});

		const savedItems = entry?.saveditems;

		let itemIDs = [];

		if (savedItems?.length > 0) {
			for (const item of savedItems) {
				itemIDs.push(item.id);
			}
		}

		return itemIDs;
	},
}));
