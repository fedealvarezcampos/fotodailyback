const { main } = require('./feedUpdater');

async function updateFeed() {
	return await main();
}

module.exports = {
	updateFeed,
};
