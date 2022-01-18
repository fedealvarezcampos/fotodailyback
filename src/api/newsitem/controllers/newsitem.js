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

			const isLiked = existingUserIDs?.includes(user?.id) ?? false;

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

			return this.transformResponse({
				postID: sanitizedEntity?.id,
				likes: sanitizedEntity?.users?.length,
				isLiked: isLiked,
			});
		} catch (err) {
			ctx.body = err;
		}
	},
}));
