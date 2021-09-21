it('should return array of objects containing API movie data', async function() {
	const res = await searchShows();
	expect(res).toBeInstanceOf(Array);
});

it('should return array of objects containing API episode data', async function() {
	const res = await getEpisodes(1);
	expect(res).toBeInstanceOf(Array);
});
