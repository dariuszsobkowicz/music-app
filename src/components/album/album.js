import { albumTemplate, tracksListTemplate } from "../templates/templates";
import { cardsList, singleAlbum } from "../cards-list/cards-list";
import { playlistTracks, player } from "../../js/app";

export function showAlbum (albumId) {
    let urlTracks = `https://api.spotify.com/v1/albums/${albumId}/tracks?limit=8`;
    let urlAlbum = `https://api.spotify.com/v1/albums/${albumId}`;

    $.when(
        $.getJSON(urlTracks),
        $.getJSON(urlAlbum)
    ).then(function (tracks, album) {
        let albumTemp = albumTemplate(album[0]);
        let tracksList = tracks[0].items.map(function (elem) {
            return tracksListTemplate(elem);
        });
        cardsList.empty();
        singleAlbum.empty();
        singleAlbum.append(albumTemp);
        let list = $(".track-list");
        list.append(tracksList);
        checkAddedTracks(list);
        let playBtn = $(".play-preview");
        playPreview(playBtn, player);
    }, function (error) {

    });
}

export function playPreview (btn, bar) {
    btn.on("click", function () {
        const that = $(this);
        player.stop().fadeIn(500);
        player[0].src = that.data("preview-url")
    });
}

export function checkAddedTracks (tracks) {
    let trs = tracks.find("tr");
    trs.each(function (i, elem) {
        let item = $(elem);
        let addIcon = item.find(".track-add");
        if (playlistTracks.indexOf(item.data("album-id")) !== -1) {
            addIcon.css({
                color: "#5cb85c"
            })
        }
    })
}