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
                        progress.animate({width: "0%"}, .1);
                    }, function () {

                    }, function (counter, length) {
                        progress.stop().animate({
                            width: (counter / length * 100) + "%"
                        }, 300);
                    })
            });
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
