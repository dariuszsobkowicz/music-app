(function ($) {

    $(function () {

        $("body").cookieAlert({
            message: "This site uses cookies to personalize content and ads to make our site easier for you to use."
        });

        let query           = "batman",
            container       = $("#main"),
            progress        = $("#preload-progress"),
            singleAlbum     = $(".single-album-container"),
            albumsContainer = $(".albums-container"),
            nav             = $(".nav"),
            navContainer    = $(".nav-place"),
            playBar         = $(".play"),
            playlist        = $(".playlist"),
            btnSearch       = $("#search-form"),
            playlistTracks  = [];

        playBar.hide();
        window.addEventListener("scroll", function (e) {
            if (document.body.scrollTop > 150) {
                navContainer.stop().slideUp(100);
            } else {
                navContainer.stop().slideDown(100);
            }
        });

        nav.on("click", ".sort-cards", function () {
            let that = $(this);
            let query = that.text();
            renderCards(query, query)
        });

        btnSearch.on("submit", function (e) {
            e.preventDefault();
            query = $(this).find("input").val();
            renderCards(query);
        });

        albumsContainer.on("click", ".album-card", function () {
            let that = $(this);
            let album = that.data("data");
            let toHistory = "/#/album/" + album.id;
            showAlbum(album.id, [album]);
            window.history.pushState(null, null, toHistory)
        });

        window.addEventListener("hashchange", function (e) {
            if (!window.location.hash) {
                renderCards(query);
            } else if (window.location.hash.indexOf("album") !== -1) {
                let album = window.location.hash.slice(8);
                showAlbum(album);
            } else if (window.location.hash.indexOf("playlist") !== -1) {
                showPlaylist(playlistTracks)
            } else if (window.location.hash.indexOf("jazz") !== -1 || window.location.hash.indexOf("rock") !== -1) {
                let name = window.location.hash.slice(2);
                let heading = name[0].toLocaleUpperCase() + name.slice(1);
                renderCards(name, heading);
            }
        });

        renderCards(query);

        /* --------------------
         playlist tracks
         -------------------- */

        function collectIds (trackId) {
            playlistTracks.push(trackId);
            updatePlaylist(playlistTracks.length);
        }

        function updatePlaylist (num) {
            let elem = playlist.find(":link");
            let icon = playlist.find("i");
            let regex = /\d+/g;
            let title = elem.text();
            let updateTitle = title.replace(regex, num);
            elem.empty();
            elem.append(icon);
            elem.append(updateTitle);
        }

        function showPlaylist (tracks) {
            let ids = tracks.join(",");
            $.getJSON(`https://api.spotify.com/v1/tracks/?ids=${ids}`)
                .then(function (response) {
                    let trackList = response.tracks.map(function (elem) {
                        return tracksListTemplate(elem)
                    });
                    let playListTemplate = $(playlistTemplate());
                    playListTemplate.append(trackList);
                    albumsContainer.empty();
                    singleAlbum.empty();
                    singleAlbum.append(playListTemplate);
                    let playBtn = $(".play-preview");
                    playPreview(playBtn, playBar);
                    $(".track-add").parent("td").remove();

                })
        }

        /* --------------------
         playlist drag n drop n click methods
         -------------------- */

        playlist.on("dragover", function (e) {
            let that = $(this);
            e.preventDefault();
            that.find("a").addClass("text-info");
        });

        playlist.on("drop", function (e) {
            let that = $(this);
            let trackId = e.originalEvent.dataTransfer.getData("application/music-id");
            collectIds(trackId);
            that.find("a").removeClass("text-info");
        });

        singleAlbum.on("dragstart", ".track-id", function (e) {
            let that = $(this);
            let trackId = that.data("album-id");
            e.originalEvent.dataTransfer.setData("application/music-id", trackId);
        });

        singleAlbum.on("click", ".track-add", function (e) {
            let that = $(this).parents(".track-id");
            let trackId = that.data("album-id");
            collectIds(trackId);
        });

        /* --------------------
         album
         -------------------- */

        function showAlbum (albumId, album) {
            let urlTracks = `https://api.spotify.com/v1/albums/${albumId}/tracks?limit=8`;
            let urlAlbum = `https://api.spotify.com/v1/albums/${albumId}`;

            $.when(
                $.getJSON(urlTracks),
                (function () {
                    if (!album) {
                        return $.getJSON(urlAlbum)
                    } else {
                        return album
                    }
                })()
            ).then(function (tracks, album) {
                let albumTemp = albumTemplate(album[0]);
                let tracksList = tracks[0].items.map(function (elem) {
                    return tracksListTemplate(elem);
                });
                albumsContainer.empty();
                singleAlbum.empty();
                singleAlbum.append(albumTemp);
                $(".track-list").append(tracksList);
                let playBtn = $(".play-preview");
                playPreview(playBtn, playBar);
            }, function (error) {

            });
        }

        function playPreview (btn, bar) {
            btn.on("click", function () {
                const that = $(this);
                playBar.stop().fadeIn(500);
                playBar[0].src = that.data("preview-url")
            });
        }

        /* --------------------
         cards
         -------------------- */

        function renderCards (query, heading = "Listen music everywhere") {
            let url = `https://api.spotify.com/v1/search?q=${query}&type=album&market=GB`;
            let h1 = $("<h1></h1>");

            $.getJSON(url).then(function (response) {
                preloadImg(response)
                    .then(function () {
                        const albumsList = response.albums.items.map(function (elem) {
                            return cardTemplate(elem)
                        });
                        container.empty();
                        singleAlbum.empty();
                        h1.empty();
                        h1.text(heading).appendTo(container);
                        container.append(albumsList);
                        preloadReset();
                    }, function () {
                        // set method on error
                    }, function (counter, length) {
                        preloadStart(counter, length);
                    })
            });
        }

        /* --------------------
         templates
         -------------------- */

        function cardTemplate (album) {
            let elem = $("<div class='album-card'></div>");
            elem.data("data", album);
            let albumName = album.name.slice(0, 28);
            let template = `<img class="album-img" src="${album.images[1].url}" alt="Sample album">
                            <div class="album-details">
                            <h4 class="">${albumName}</h4>
                            <p class="">${album.artists[0].name}</p>
                            </div>`;
            elem.append(template);
            return elem;
        }

        function tracksListTemplate (track) {
            let time = new Date(track.duration_ms);
            let duration = time.getMinutes() + "m:" + time.getSeconds() + "s";
            return `<tr class="track-id" draggable="true" data-album-id="${track.id}">
                        <th scope="row">${track.track_number}</th>
                        <td><button class="btn btn-success btn-sm play-preview" data-preview-url=${track.preview_url}><i class="fa fa-play-circle-o" aria-hidden="true"></i> Play</button></td>
                        <td><i class="fa fa-plus-square track-add" aria-hidden="true"></i></td>
                        <td>${track.name}</td>
                        <td>${duration}</td>
                    </tr>`
        }

        function albumTemplate (album) {
            return `<figure>
                        <img src=${album.images[0].url} alt="album img" class="img-fluid">
                        <figcaption>${album.artists[0].name}</figcaption>
                    </figure>
                    <table class="table table-hover table-inverse">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th><i class="fa fa-hand-lizard-o text-info" aria-hidden="true"></i> drag</th>
                            <th><i class="fa fa-hand-o-down text-info" aria-hidden="true"></i> add</th>
                            <th>Track Name</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody class="track-list"></tbody>
                    </table>`
        }

        function playlistTemplate () {
            return `<table class="table table-hover table-inverse playlist-table-list">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th></th>
                            <th>Track Name</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody class="track-list"></tbody>
                    </table>`
        }

        /* --------------------
         images preloader
         -------------------- */

        function preloadStart (counter, length) {
            let tl = new TimelineLite();
            tl.to(progress, 0, {
                height:          "2px",
                backgroundColor: "#ffd700",
                opacity:         1
            });
            tl.to(progress, .2, {
                width: (counter / length * 100) + "%",
            })
        }

        function preloadReset () {
            let tl = new TimelineLite();
            tl.to(progress, 0, {
                height:  0,
                opacity: 0,
                delay:   .5
            });
            tl.to(progress, 0, {
                width: "0%"
            })
        }

        function preloadImg (urls) {
            let dfd     = $.Deferred(),
                length  = urls.albums.items.length,
                counter = 0;

            $.each(urls.albums.items, function (i, elem) {
                let img = $("<img>");
                img.on("load", function () {
                    counter++;
                    dfd.notify(counter, length);
                    if (length === counter) {
                        dfd.resolve();
                    }
                });
                img.attr("src", elem.images[0].url);
            });

            return dfd;
        }
    })

})(jQuery);
