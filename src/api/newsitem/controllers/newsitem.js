'use strict';

/**
 *  newsitem controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::newsitem.newsitem', ({ strapi }) => ({
	// Method 1: Creating an entirely custom action
	async likes(ctx) {
		try {
			const { id } = ctx.params;

			const entity = await strapi.entityService.findOne('api::newsitem.newsitem', id, {
				fields: ['id'],
				populate: {
					users: {
						fields: ['id'],
					},
				},
			});

			const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

			return this.transformResponse({ likes: sanitizedEntity?.users?.length });
		} catch (err) {
			ctx.body = err;
		}
	},
}));
