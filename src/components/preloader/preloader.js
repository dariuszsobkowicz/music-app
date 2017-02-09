export let preloaderImg = $("#preload-progress");

export function preloadStart (counter, length) {
    let tl = new TimelineLite();
    tl.to(preloaderImg, 0, {
        height:          "2px",
        backgroundColor: "#ffd700",
        opacity:         1
    });
    tl.to(preloaderImg, .2, {
        width: (counter / length * 100) + "%",
    })
}

export function preloadReset () {
    let tl = new TimelineLite();
    tl.to(preloaderImg, 0, {
        height:  0,
        opacity: 0,
        delay:   .5
    });
    tl.to(preloaderImg, 0, {
        width: "0%"
    })
}

export function preloadImg (urls) {
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
