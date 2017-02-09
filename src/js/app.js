import { renderCards, cardsList, singleAlbum } from "../components/cards-list/cards-list";
import { showAlbum } from "../components/album/album";
import { collectIds, showPlaylist, updatePlaylist, playlist } from "../components/playlist/playlist";

export let playlistTracks = JSON.parse(window.localStorage.getItem("playlist")) || [];
export let player = $(".player");


$("body").cookieAlert({
    message: "This site uses cookies to personalize content and ads to make our site easier for you to use."
});

let query        = "batman",
    navContainer = $(".nav-container"),
    searchForm   = $("#search-form");


updatePlaylist(playlistTracks.length);
player.hide();

window.addEventListener("scroll", function (e) {
    if (document.body.scrollTop > 50) {
        navContainer.stop().fadeOut(5);
    } else {
        navContainer.stop().fadeIn(5);
    }
});

searchForm.on("submit", function (e) {
    e.preventDefault();
    query = $(this).find("input").val();
    renderCards(query);
});

cardsList.on("click", ".album-card", function () {
    let that = $(this);
    let album = that.data("data");
    window.location.hash = "/album/" + album.id;
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
}, false);

playlist.on("dragover", function (e) {
    let that = $(this);
    e.preventDefault();
    that.find("a").addClass("text-info");
});

playlist.on("drop", function (e) {
    let that = $(this);
    let trackId = e.originalEvent.dataTransfer.getData("application/music-id");
    let elem = singleAlbum.find("tr[data-album-id='" + trackId + "']");
    collectIds(trackId, elem);
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
    collectIds(trackId, that);
});

renderCards(query);
