'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::newsitem.newsitem', ({ strapi }) => ({
	async find(ctx) {
		ctx.query = { ...ctx.query };
		const user = ctx.state.user ?? null;

		const { data, meta } = await super.find(ctx);

		let savedItemsIDs = [];

		if (user) {
			savedItemsIDs = await strapi.service('api::newsitem.newsitem').getSavedItemsIDs(user.id);
		}

		for (const item of data) {
			const existingUserIDs = await strapi
				.service('api::newsitem.newsitem')
				.getAlreadyExistingUserIDs(item?.id);

			const alreadyLiked = existingUserIDs?.includes(user?.id);
			const alreadySaved = savedItemsIDs?.includes(item?.id);

			const isLiked = alreadyLiked ?? false;
			const isSaved = alreadySaved ?? false;

			item.attributes.likes = existingUserIDs?.length;
			item.attributes.isLiked = isLiked;
			item.attributes.isSaved = isSaved;
		}

		return { data, meta };
	},

	async like(ctx) {
		try {
			const { id: postID } = ctx.params;
			const { id: userID } = ctx.state.user;

			const existingUserIDs = await strapi
				.service('api::newsitem.newsitem')
				.getAlreadyExistingUserIDs(postID);

			let newUserIDs = [];
			let isLiked;

			if (existingUserIDs?.includes(userID)) {
				newUserIDs = existingUserIDs.filter(id => id !== userID);
				isLiked = false;
			} else {
				newUserIDs = [...existingUserIDs, userID];
				isLiked = true;
			}

			const entity = await strapi.entityService.update('api::newsitem.newsitem', postID, {
				data: {
					users: newUserIDs,
				},
				populate: '*',
			});

			const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

			const numberOfUsersThatLikedTheItem = sanitizedEntity?.users?.length;

			await strapi.db.query('api::newsitem.newsitem').update({
				where: { id: postID },
				data: {
					likes: numberOfUsersThatLikedTheItem,
				},
			});

			return this.transformResponse({
				postID: sanitizedEntity?.id,
				likes: numberOfUsersThatLikedTheItem,
				isLiked: isLiked,
			});
		} catch (err) {
			ctx.body = err;
		}
	},

	async save(ctx) {
		try {
			const { id } = ctx.params;
			const { id: userID } = ctx.state.user;

			const postID = Number(id);

			const itemIDs = await strapi.service('api::newsitem.newsitem').getSavedItemsIDs(userID);

			let newItemIDs = [];
			let isSaved;

			if (itemIDs?.includes(postID)) {
				newItemIDs = itemIDs.filter(id => id !== postID);
				isSaved = false;
			} else {
				newItemIDs = [postID, ...itemIDs];
				isSaved = true;
			}

			await strapi.entityService.update('plugin::users-permissions.user', userID, {
				data: {
					saveditems: newItemIDs,
				},
				populate: { saveditems: true },
			});

			return this.transformResponse({ saveditem: postID, isSaved: isSaved });
		} catch (err) {
			ctx.body = err;
		}
	},

	async savedItems(ctx) {
		try {
			const { id: userID } = ctx.state.user;

			const itemIDs = await strapi.service('api::newsitem.newsitem').getSavedItemsIDs(userID);

			let response = [];

			for (const id of itemIDs) {
				const existingUserIDs = await strapi
					.service('api::newsitem.newsitem')
					.getAlreadyExistingUserIDs(id);

				const newsItem = await strapi.entityService.findOne('api::newsitem.newsitem', id);

				const alreadyLiked = existingUserIDs?.includes(userID);

				const isLiked = alreadyLiked ?? false;
				const isSaved = true;

				response.push({ ...newsItem, isLiked, isSaved });
			}

			return this.transformResponse(response);
		} catch (err) {
			ctx.body = err;
		}
	},
}));
