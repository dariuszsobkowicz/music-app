import { playlistTemplate, tracksListTemplate } from "../templates/templates";
import { playPreview } from "../album/album";
import { cardsList, singleAlbum } from "../cards-list/cards-list";
import { playlistTracks, player } from "../../js/app";

export let playlist = $(".playlist");

export function collectIds (trackId, elem) {
    if (playlistTracks.indexOf(trackId) === -1) {
        playlistTracks.push(trackId);
        elem.find(".track-add").css({color: "#5cb85c"});
        window.localStorage.setItem("playlist", JSON.stringify(playlistTracks))
    }
    updatePlaylist(playlistTracks.length);
}

export function updatePlaylist (num) {
    let elem = playlist.find(":link");
    let icon = playlist.find("i");
    let regex = /\d+/g;
    let title = elem.text();
    let updateTitle = title.replace(regex, num);
    elem.empty();
    elem.append(icon);
    elem.append(updateTitle);
}

export function showPlaylist (tracks) {
    let ids = tracks.join(",");
    let num = 0;
    $.getJSON(`https://api.spotify.com/v1/tracks/?ids=${ids}`)
        .then(function (response) {
            let trackList = response.tracks.map(function (elem) {
                num++;
                return tracksListTemplate(elem, num)
            });
            let playListTemplate = $(playlistTemplate());
            playListTemplate.append(trackList);
            cardsList.empty();
            singleAlbum.empty();
            singleAlbum.append(playListTemplate);
            let playBtn = $(".play-preview");
            let removeIcon = $("<i class='fa fa-trash-o remove-playlist-track' aria-hidden='true'></i>");
            let cell = $("<td></td>");
            playPreview(playBtn, player);
            $(".track-add").parent("td").remove();
            removeIcon.bind("click", function () {
                removeTrack(this)
            });
            cell.append(removeIcon);
            $(".track-id").append(cell);
        }, function (error) {
            // on error
        })
}

export function removeTrack (elem) {
    let that = $(elem);
    let parent = that.parent().parent();
    let trackId = parent.data("album-id");
    let index = playlistTracks.indexOf(trackId);
    playlistTracks.splice(index, 1);
    updatePlaylist(playlistTracks.length);
    if (playlistTracks.length > 1) {
        showPlaylist(playlistTracks)
    } else {
        parent.remove();
    }
    window.localStorage.setItem("playlist", JSON.stringify(playlistTracks))
}