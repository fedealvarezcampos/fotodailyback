'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::newsitem.newsitem', ({ strapi }) => ({
	// async find(ctx) {
	// 	const { query } = ctx;

	// 	const entity = await strapi.service('api::newsitem.newsitem').find(query);

	// 	const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

	// 	return this.transformResponse(sanitizedEntity);
	// },

	async likes(ctx) {
		try {
			const { id: postID } = ctx.params;

			const user = ctx.state.user ?? null;

			const existingUserIDs = await strapi
				.service('api::newsitem.newsitem')
				.getAlreadyExistingUserIDs(postID);

			const isLiked = existingUserIDs?.includes(user?.id) ?? false;

			return this.transformResponse({ id: postID, isLiked: isLiked });
		} catch (err) {
			ctx.body = err;
		}
	},

	async like(ctx) {
		try {
			const { id: postID } = ctx.params;
			const { id: userID } = ctx.state.user;

			const existingUserIDs = await strapi
				.service('api::newsitem.newsitem')
				.getAlreadyExistingUserIDs(postID);

			let newUserIDs = [];

			if (existingUserIDs?.includes(userID)) {
				newUserIDs = existingUserIDs.filter(id => id !== userID);
			} else {
				newUserIDs = [...existingUserIDs, userID];
			}

			console.log(newUserIDs);

			const entity = await strapi.entityService.update('api::newsitem.newsitem', postID, {
				data: {
					users: newUserIDs,
				},
				populate: '*',
			});

			const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

			console.log(sanitizedEntity.users);

			return this.transformResponse({
				postID: sanitizedEntity?.id,
				likes: sanitizedEntity?.users?.length,
			});
		} catch (err) {
			ctx.body = err;
		}
	},
}));
