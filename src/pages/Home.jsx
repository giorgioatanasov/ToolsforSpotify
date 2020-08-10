import React, { Component } from "react";
import SpotifyWebApi from "../spotify-web-api.js";
import axios from "axios";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import qs from "qs";
import redirectAuth from "../authorize.js";

const spotifyApi = new SpotifyWebApi();
const playlists = [];
var playlistNonState = {};

class Home extends Component {
  getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q);
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying() {
    // for future implementation
    spotifyApi.getMyCurrentPlaybackState().then((response) => {
      if (response.item) {
        this.setState({
          nowPlaying: {
            name: response.item.name,
            albumArt: response.item.album.images[0].url,
          },
        });
        document.getElementById("nocontent").innerHTML = "";
      } else {
        this.setState({
          nowPlaying: {
            name: "No Song",
            ablumArt: "",
          },
        });
        document.getElementById("nocontent").innerHTML =
          "No song is currently being played";
      }
    });
  }

  getArtists(artistLst) {
    var res = [];
    for (var i in artistLst) res.push(artistLst[i].name);
    if (res.length > 2) {
      return res.splice(0, 2).join(",") + "...";
    } else {
      return res.join(",");
    }
  }

  handleImages(responseAlbum) {
    if (
      !responseAlbum ||
      !Array.isArray(responseAlbum.images) ||
      !responseAlbum.images.length
    ) {
      return null;
    }
    return responseAlbum.images[0].url;
  }

  getPlaylists() {
    spotifyApi.getUserPlaylists().then((response) => {
      let count = 0;
      for (var i = 0; i < response.items.length; ++i) {
        if (response.items[i].tracks.total > 0) {
          playlists[count++] = {
            name: response.items[i].name,
            id: response.items[i].id,
            AlbumArt: this.handleImages(response.items[i]),
            snapshotId: response.items[i].snapshot_id,
          };
        }
      }
      this.getTracksForAll();
    });
  }

  getTracks(id) {
    for (var i = 0; i <= 600; i += 100) {
      spotifyApi.getPlaylistTracks(id, { offset: i }).then((response) => {
        for (var i = 0; i < response.items.length; ++i) {
          response.items[i].track &&
            playlistNonState[id].push({
              songTitle: response.items[i].track.name,
              songId: response.items[i].track.id,
              artist: this.getArtists(response.items[i].track.artists),
              albumArt: this.handleImages(response.items[i].track.album),
            });
        }
      });
    }
  }

  getTracksForAll() {
    for (var i = 0; i < playlists.length; ++i) {
      playlistNonState[playlists[i].id] = [];
    }
    for (var idx = 0; idx < playlists.length; ++idx) {
      this.getTracks(playlists[idx].id);
    }
    this.props.dispatchFillPlaylistData(playlistNonState);
  }

  componentDidMount() {
    let auth_token = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    }).code;
    if (auth_token) {
      const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;
      axios
        .get(API_DOMAIN + "/access/" + auth_token)
        .then((res) => {
          const token = res.data.access_token;
          spotifyApi.setAccessToken(token);
          spotifyApi.getMe().then((res) => {
            this.props.dispatchLoginUpdate(token, res.display_name);
          });
          this.getPlaylists();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  render() {
    var top = this.props.loggedIn ? 21.5 + "%" : 33 + "%";
    var fontSize = this.props.loggedIn ? 28 + "px" : 35 + "px";
    return (
      <body>
        {!this.props.token && (
          <div className="login">
            <a
              className="btn btn-5"
              id="loginButton"
              onClick={() => redirectAuth()}
            >
              Login to Spotify
            </a>
          </div>
        )}

        <div className="content" style={{ top, fontSize }}>
          <div className="content__container">
            <p className="content__container__text">Hello</p>

            <ul className="content__container__list">
              <li className="content__container__list__item" id="user">
                {this.props.display_name} !
              </li>
              <li
                className="content__container__list__item"
                id="selectPlaylist"
              >
                {this.props.loggedIn ? "select a playlist" : "please login"} !
              </li>
              <li className="content__container__list__item">
                {this.props.loggedIn ? "let's delete tracks" : "world"} !
              </li>
              <li className="content__container__list__item">
                {this.props.loggedIn ? "pick a playlist below" : "music lover"}{" "}
                !
              </li>
            </ul>
          </div>
        </div>
        {this.props.loggedIn !== undefined &&
          this.props.playlistInfo !== undefined &&
          this.props.loggedIn && (
            <div className="wrapper">
              <div className="grid">
                {this.props.playlists.map(({ name, id, AlbumArt }) => (
                  <div className="grid-item">
                    <figure>
                      <NavLink
                        to="PlaylistTable"
                        onClick={() => this.props.dispatchCurPlaylistID(id)}
                        className="link"
                      >
                        <img
                          src={
                            AlbumArt !== null
                              ? AlbumArt
                              : "https://drive.google.com/uc?id=1DyACi59SG-L6mDFUGLmR4E2SbEFEcuzG"
                          }
                          width="250"
                          height="250"
                          alt=""
                        ></img>
                        <figcaption>{name}</figcaption>
                      </NavLink>
                    </figure>
                  </div>
                ))}
              </div>
            </div>
          )}
      </body>
    );
  }
}

const mapStatetoProps = (state) => ({
  submenuHtml: state.submenuHtml,
  loggedIn: state.loggedIn,
  playlistInfo: state.playlistInfo,
  playlists: playlists,

  curSelectPlaylist: state.playlistID,
  prevSelectPlaylist: state.oldPlaylistId,
  checkboxes: state.checkboxes,
  successDelete: state.successDelete,
  token: state.token,
  display_name: state.display_name,
});

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchCurPlaylistID: (playlistId) =>
      dispatch({ type: "SELECTED_PLAYLIST", playlistId }),
    dispatchSubmenuHtml: (data) =>
      dispatch({ type: "UPDATE_SUBMENU", submenuHtml: data }),
    dispatchLoggedIn: () => dispatch({ type: "LOGGED_IN" }),
    dispatchFillPlaylistData: (playlistInfo) =>
      dispatch({ type: "FILL_PLAYLIST", playlistInfo, playlists }),
    dispatchSuccessDelete: () => dispatch({ type: "SUCCESS_DELETE" }),
    dispatchLoginUpdate: (token, display_name) =>
      dispatch({ type: "UPDATE_LOGGED_IN", token, display_name }),
  };
};

export default connect(mapStatetoProps, mapDispatchToProps)(Home);
