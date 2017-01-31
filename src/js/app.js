(function ($) {

    $(function () {
        let query     = "batman",
            container = $("#main"),
            progress  = $("#preload-progress"),
            btnSearch = $("#search-form");

        btnSearch.on("submit", function (e) {
            e.preventDefault();
            query = $(this).find("input").val();
            renderCard(query);
        });

        function renderCard (query) {
            let url = `https://api.spotify.com/v1/search?q=${query}&type=album&market=GB`;

            $.getJSON(url).then(function (response) {
                preloadImg(response)
                    .then(function () {
                        const albumsList = response.albums.items.map(function (elem) {
                            return createTemplate(elem)
                        });
                        container.empty();
                        container.append(albumsList);
                        preloadReset();
                    }, function () {

                    }, function (counter, length) {
                        preloadStart(counter, length);
                    })
            });
        }

        function preloadStart (counter, length) {
            let tl = new TimelineLite();
            tl.to(progress, 0, {
                height:  "2px",
                backgroundColor: "#ffd700",
                opacity: 1
            });
            tl.to(progress, .2, {
                width:   (counter / length * 100) + "%",
            })
        }

        function preloadReset () {
            let tl = new TimelineLite();
            tl.to(progress, 0, {
                height: 0,
                opacity: 0,
                delay: .5
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

        function createTemplate (album) {
            return `<div class="card card-inverse card-img-shadow" style="flex-basis: 400px;">
                        <img class="card-img-top img-fluid" src="${album.images[0].url}" alt="Sample album">
                        <div class="card-img-overlay card-img-text-bottom">
                        <h4 class="card-title">${album.name}</h4>
                        <p class="card-text">${album.artists[0].name}</p>
                        </div>
                    </div>`;
        }

        renderCard(query);
    })

})(jQuery);
