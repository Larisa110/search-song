const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');

const apiURL = 'https://api.lyrics.ovh';

form.addEventListener('submit', e => {
    e.preventDefault();
    const searchValue = search.value.trim();

    if (!searchValue) {
        alert("There is nothing to search");
    } else {
        searchSong(searchValue);
    }
});

async function searchSong(searchValue) {
    const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`);
    const data = await searchResult.json();

    showData(data);
}

function showData(data) {
    result.innerHTML = `
        <ul class="song-list">
            ${data.data.map(song => `
                <li>
                    <div>
                        <img src="${song.artist.picture}" />
                        <strong>${song.artist.name}</strong>
                    </div>
                    <span data-artist="${song.artist.name}" data-songtitle="${song.title}">Get lyrics</span>
                </li>
            `).join('')}
        </ul>
    `;
}

result.addEventListener('click', async e => {
    const clickElement = e.target;

    if (clickElement.tagName === 'SPAN') {
        const artist = clickElement.dataset.artist;
        const songTitle = clickElement.dataset.songtitle;

        await getLyrics(artist, songTitle);
    }
});

async function getLyrics(artist, songTitle) {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

    result.innerHTML = `
        <div class="full-lyrics">
            <h2>${artist} - ${songTitle}</h2>
            <p>${lyrics}</p>
        </div>
    `;
}
