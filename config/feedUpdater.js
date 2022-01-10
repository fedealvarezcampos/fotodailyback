const { getLinkPreview } = require('link-preview-js');
const Parser = require('rss-parser');

// 1
function diffInDays(date1, date2) {
	const difference = Math.floor(date1) - Math.floor(date2);
	return Math.floor(difference / 60 / 60 / 24);
}

// 2
async function getNewFeedItemsFrom(feedUrl) {
	const parser = new Parser();
	const rss = await parser.parseURL(feedUrl);

	const todaysDate = new Date().getTime() / 1000;
	return rss.items.filter(item => {
		const blogPublishedDate = new Date(item?.pubDate).getTime() / 1000;
		return diffInDays(todaysDate, blogPublishedDate) === 0;
	});
}

// 3
async function getFeedUrls() {
	const { results } = await strapi.service('api::feedsource.feedsource').find({
		filters: {
			enabled: true,
		},
	});

	return results;
}

// 4
async function getNewFeedItems() {
	let allNewFeedItems = [];

	const feeds = await getFeedUrls();

	for (let i = 0; i < feeds?.length; i++) {
		const { link } = feeds[i];
		const feedItems = await getNewFeedItemsFrom(link);
		allNewFeedItems = [...allNewFeedItems, ...feedItems];
	}

	return allNewFeedItems;
}

// 5
async function main() {
	try {
		const feedItems = await getNewFeedItems();

		for (let i = 0; i < feedItems.length; i++) {
			const item = feedItems[i];

			const linkPreview = await getLinkPreview(item?.link, {
				headers: {
					'user-agent': 'googlebot',
				},
			});

			const newsItem = {
				site: item?.link?.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0],
				title: item?.title,
				image: linkPreview?.images[0],
				preview: item?.contentSnippet,
				link: item?.link,
				creator: item?.creator,
				date: new Date(item?.pubDate)?.toISOString(),
				sponsored: false,
			};

			await strapi.service('api::newsitem.newsitem').create({ data: newsItem });

			console.log('tetah');
		}
	} catch (error) {
		console.log(error.message);
	}
}

// 6
module.exports = {
	main,
};
