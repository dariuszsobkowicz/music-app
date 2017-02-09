import { preloadStart, preloadReset, preloadImg } from "../preloader/preloader";
import { cardTemplate } from "../templates/templates";

export let cardsList = $(".cards-list");
export let singleAlbum = $(".single-album");

export function renderCards (query, heading = "Listen music everywhere") {
    let url = `https://api.spotify.com/v1/search?q=${query}&type=album&market=GB`;
    let h1 = $("<h1></h1>");

    $.getJSON(url).then(function (response) {
        preloadImg(response)
            .then(function () {
                h1.empty();
                cardsList.empty();
                singleAlbum.empty();
                const albumsList = response.albums.items.map(function (elem) {
                    return cardTemplate(elem)
                });
                h1.text(heading).appendTo(cardsList);
                cardsList.append(albumsList);
                preloadReset();
            }, null, function (counter, length) {
                preloadStart(counter, length);
            })
    });
}