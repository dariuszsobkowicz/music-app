export function cardTemplate (album) {
    let elem = $("<div class='album-card'></div>");
    elem.data("data", album);
    let albumName = album.name.slice(0, 28);
    let template = `<img class="album-img" src="${album.images[0].url}" alt="Sample album">
                            <div class="album-details">
                                <h4 class="">${albumName}</h4>
                                <p class="">${album.artists[0].name}</p>
                            </div>`;
    elem.append(template);
    return elem;
}

export function tracksListTemplate (track, playlist) {
    let counter = playlist ? playlist : track.track_number;

    let time = new Date(track.duration_ms);
    let duration = time.getMinutes() + "m:" + time.getSeconds() + "s";
    return `<tr class="track-id" draggable="true" data-album-id="${track.id}">
                        <th scope="row">${counter}</th>
                        <td><button class="btn btn-success btn-sm play-preview" data-preview-url=${track.preview_url}><i class="fa fa-play-circle-o" aria-hidden="true"></i> Play</button></td>
                        <td><i class="fa fa-plus-square track-add" aria-hidden="true"></i></td>
                        <td>${track.name}</td>
                        <td>${duration}</td>
                    </tr>`
}

export function albumTemplate (album) {
    return `<div>
                    <figure>
                        <img src=${album.images[0].url} alt="album img" class="img-fluid">
                        <figcaption>${album.artists[0].name}</figcaption>
                    </figure>
                    </div>
                    <div>
                    <table class="table table-hover table-inverse album-temp">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th><span class="hidden-mobile"><i class="fa fa-hand-lizard-o text-info" aria-hidden="true"></i> drag</span></th>
                            <th><i class="fa fa-hand-o-down text-info" aria-hidden="true"></i> add</th>
                            <th>Track Name</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody class="track-list"></tbody>
                    </table>
                    </div>`
}

export function playlistTemplate () {
    return `<table class="table table-hover table-inverse playlist-table-list">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th></th>
                            <th>Track Name</th>
                            <th>Duration</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody class="track-list"></tbody>
                    </table>`
}
