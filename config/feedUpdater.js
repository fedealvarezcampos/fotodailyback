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
		enabled: true,
	});

	return results;
}

// 4
async function getNewFeedItems() {
	let allNewFeedItems = [];

	console.log('tetah');

	const feeds = await getFeedUrls();

	for (let i = 0; i < feeds.length; i++) {
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

			const newsItem = {
				title: item?.title,
				preview: item?.contentSnippet,
				link: item?.link,
				creator: item?.creator,
				sponsored: false,
			};

			console.log(newsItem);

			await strapi.service('api::newsitem.newsitem').create({ data: newsItem });
		}
	} catch (error) {
		console.log(error.message);
	}
}

// 6
module.exports = {
	main,
};
