'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::newsitem.newsitem', ({ strapi }) => ({
	async find(ctx) {
		ctx.query = { ...ctx.query };
		const user = ctx.state.user ?? null;

		const { data, meta } = await super.find(ctx);

		for (const item of data) {
			const existingUserIDs = await strapi
				.service('api::newsitem.newsitem')
				.getAlreadyExistingUserIDs(item.id);

			const alreadyLiked = existingUserIDs?.includes(user?.id);

			const isLiked = alreadyLiked ?? false;

			item.attributes.likes = existingUserIDs?.length;
			item.attributes.isLiked = isLiked;
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

			const entry = await strapi.entityService.findOne('plugin::users-permissions.user', userID, {
				populate: { saveditems: true },
			});

			const sanitized = await this.sanitizeOutput(entry, ctx);

			const savedItems = sanitized?.saveditems;

			let itemIDs = [];

			if (savedItems?.length > 0) {
				for (const item of savedItems) {
					itemIDs.push(item.id);
				}
			}

			let newItemIDs = [];
			let isSaved;

			if (itemIDs?.includes(postID)) {
				newItemIDs = itemIDs.filter(id => id !== postID);
				isSaved = false;
			} else {
				newItemIDs = [postID, ...itemIDs];
				isSaved = true;
			}

			console.log(newItemIDs);

			const entity = await strapi.entityService.update('plugin::users-permissions.user', userID, {
				data: {
					saveditems: newItemIDs,
				},
				populate: { saveditems: true },
			});

			const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

			const finalSavedItems = sanitizedEntity?.saveditems;

			console.log(finalSavedItems);

			return this.transformResponse({ saveditems: finalSavedItems, isSaved: isSaved });
		} catch (err) {
			ctx.body = err;
		}
	},

	async savedItems(ctx) {
		try {
			const { id: userID } = ctx.state.user;

			const entry = await strapi.entityService.findOne('plugin::users-permissions.user', userID, {
				populate: { saveditems: true },
			});

			const sanitizedEntity = await this.sanitizeOutput(entry, ctx);

			const savedItems = sanitizedEntity?.saveditems;

			console.log(savedItems);

			return this.transformResponse(savedItems);
		} catch (err) {
			ctx.body = err;
		}
	},
}));
