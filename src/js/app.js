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
            btnSearch       = $("#search-form");

        btnSearch.on("submit", function (e) {
            e.preventDefault();
            query = $(this).find("input").val();
            renderCards(query);
        });

        albumsContainer.on("click", ".album-card", function () {
            let that = $(this);
            let album = that.data("data");
            let toHistory = "/#" + album.id;
            showAlbum(album.id, [album]);
            window.history.pushState(null, null, toHistory)
        });

        window.addEventListener("hashchange", function (e) {
            if (!window.location.hash) {
                renderCards(query);
            } else {
                let album = window.location.hash.slice(1);
                showAlbum(album);

            }
        });

        renderCards(query);


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
            }, function (error) {
                console.log(error)
            });
        }

        /* --------------------
         cards
         -------------------- */

        function renderCards (query) {
            let url = `https://api.spotify.com/v1/search?q=${query}&type=album&market=GB`;

            $.getJSON(url).then(function (response) {
                preloadImg(response)
                    .then(function () {
                        const albumsList = response.albums.items.map(function (elem) {
                            return cardTemplate(elem)
                        });
                        container.empty();
                        singleAlbum.empty();
                        $("<h1>Listen music everywhere</h1>").appendTo(container).hide().fadeIn(500);
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
            return `<tr>
                        <th scope="row">${track.track_number}</th>
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
