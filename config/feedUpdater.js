const { getLinkPreview } = require('link-preview-js');
const Parser = require('rss-parser');

function diffInDays(date1, date2) {
	const difference = Math.floor(date1) - Math.floor(date2);
	return Math.floor(difference / 60 / 60 / 24);
}

async function getNewFeedItemsFrom(feedUrl) {
	const parser = new Parser();
	const rss = await parser.parseURL(feedUrl);

	const todaysDate = new Date().getTime() / 1000;
	return rss.items.filter(item => {
		const articleDate = new Date(item?.pubDate).getTime() / 1000;
		return diffInDays(todaysDate, articleDate) === 0;
	});
}

async function getFeedUrls() {
	const { results } = await strapi.service('api::feedsource.feedsource').find({
		filters: {
			enabled: true,
		},
	});

	return results;
}

async function getNewFeedItems() {
	let allNewFeedItems = [];

	const feeds = await getFeedUrls();

	for (article of feeds) {
		const { link } = article;
		const feedItems = await getNewFeedItemsFrom(link);
		allNewFeedItems = [...allNewFeedItems, ...feedItems];
	}

	return allNewFeedItems;
}

async function main() {
	try {
		const feedItems = await getNewFeedItems();

		for (item of feedItems) {
			const linkPreview = await getLinkPreview(item?.link);

			const newsItem = {
				site: item?.link?.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0],
				title: item?.title,
				image: linkPreview?.images[0],
				preview: item?.contentSnippet.slice(0, 200),
				link: item?.link,
				date: new Date(item?.pubDate)?.toISOString(),
			};

			await strapi.service('api::newsitem.newsitem').create({ data: newsItem });

			console.info(newsItem);
		}
	} catch (error) {
		console.error(error.message);
	}
}

module.exports = {
	main,
};
