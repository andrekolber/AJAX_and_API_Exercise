/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
	// TODO: Make an ajax request to the searchShows api.  Remove
	// hard coded data.
	const shows = [];
	const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
	const numResults = res.data.length;
	for (let i = 0; i < numResults; i++) {
		const show = {
			id      : res.data[i].show.id,
			name    : res.data[i].show.name,
			summary :
				res.data[i].show.summary ? res.data[i].show.summary :
				'No Summary Available',
			image   :
				res.data[i].show.image ? res.data[i].show.image.medium :
				'https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300',
		};

		shows.push(show);
	}

	return shows;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
	const $showsList = $('#shows-list');
	$showsList.empty();

	for (let show of shows) {
		let $item = $(
			`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="get-episodes">Episodes</button>
           </div>
         </div>
       </div>
      `
		);

		$showsList.append($item);
	}
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$('#search-form').on('submit', async function handleSearch(evt) {
	evt.preventDefault();

	let query = $('#search-query').val();
	if (!query) return;

	$('#episodes-area').hide();

	let shows = await searchShows(query);

	populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
	// TODO: get episodes from tvmaze
	//       you can get this by making GET request to
	//       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
	// TODO: return array-of-episode-info, as described in docstring above
	const episodes = [];
	const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
	const numResults = res.data.length;
	console.log(res.data);
	for (let i = 0; i < numResults; i++) {
		episodes.push({
			id     : res.data[i].id,
			name   : res.data[i].name,
			season : res.data[i].season,
			number : res.data[i].number,
		});
	}
	return episodes;
}

function populateEpisodes(episodes) {
	const $episodesList = $('#episodes-list');
	$episodesList.empty();
	for (let episode of episodes) {
		let $episode = $(`<li>${episode.name} (season ${episode.season}, episode ${episode.number})</li>`);
		$episodesList.append($episode);
	}

	$('#episodes-area').show();
}

$('#shows-list').on('click', '.get-episodes', async function handleClick(e) {
	const showId = $(e.target).closest('.Show').data('show-id');
	const episodes = await getEpisodes(showId);
	populateEpisodes(episodes);
});
