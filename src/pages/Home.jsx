import React, { Component } from "react";
import SpotifyWebApi from "./spotify-web-api.js";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
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
    spotifyApi.getMyCurrentPlaybackState().then(response => {
      if (response.item) {
        this.setState({
          nowPlaying: {
            name: response.item.name,
            albumArt: response.item.album.images[0].url
          }
        });
        document.getElementById("nocontent").innerHTML = "";
      } else {
        this.setState({
          nowPlaying: {
            name: "No Song",
            ablumArt: ""
          }
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
    if (
      this.props.loggedIn &&
      !this.props.playlistInfo.length &&
      !this.props.playlists.length
    ) {
      spotifyApi.getUserPlaylists().then(response => {
        for (var i = 0; i < response.items.length; ++i) {
          playlists[i] = {
            name: response.items[i].name,
            id: response.items[i].id,
            AlbumArt: this.handleImages(response.items[i]),
            snapshotId: response.items[i].snapshot_id
          };
        }
        this.getTracksForAll();
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

  getTracks(id) {
    for (var i = 0; i <= 600; i += 100) {
      spotifyApi.getPlaylistTracks(id, { offset: i }).then(response => {
        for (var i = 0; i < response.items.length; ++i) {
          playlistNonState[id].push({
            songTitle: response.items[i].track.name,
            songId: response.items[i].track.id,
            artist: this.getArtists(response.items[i].track.artists),
            albumArt: this.handleImages(response.items[i].track.album)
          });
        }
      });
    }
  }

  componentDidMount() {
    if (!this.props.token) {
      const params = this.getHashParams();
      const token = params.access_token;
      const user_id = params.user_id;
      this.props.dispatchLoginUpdate(token, user_id);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.loggedIn !== prevProps.loggedIn && this.props.loggedIn) {
      spotifyApi.setAccessToken(this.props.token);
      this.getPlaylists();
    }
  }

  render() {
    var top = this.props.loggedIn ? 21.5 + "%" : 33 + "%";
    var fontSize = this.props.loggedIn ? 28 + "px" : 35 + "px";
    return (
      <body>
        {this.props.loggedIn !== undefined && !this.props.loggedIn && (
          <div className="login">
            <a
              href="https://spotify-tools.glitch.me"
              className="btn btn-5"
              id="loginButton"
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
                {this.props.user_id ? this.props.user_id : "spotify user"} !
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

const mapStatetoProps = state => ({
  submenuHtml: state.submenuHtml,
  loggedIn: state.loggedIn,
  playlistInfo: state.playlistInfo,
  playlists: playlists,

  curSelectPlaylist: state.playlistID,
  prevSelectPlaylist: state.oldPlaylistId,
  checkboxes: state.checkboxes,
  successDelete: state.successDelete,
  token: state.token,
  user_id: state.user_id
});

const mapDispatchToProps = dispatch => {
  return {
    dispatchCurPlaylistID: playlistId =>
      dispatch({ type: "SELECTED_PLAYLIST", playlistId }),
    dispatchSubmenuHtml: data =>
      dispatch({ type: "UPDATE_SUBMENU", submenuHtml: data }),
    dispatchLoggedIn: () => dispatch({ type: "LOGGED_IN" }),
    dispatchFillPlaylistData: playlistInfo =>
      dispatch({ type: "FILL_PLAYLIST", playlistInfo, playlists }),
    dispatchSuccessDelete: () => dispatch({ type: "SUCCESS_DELETE" }),
    dispatchLoginUpdate: (token, user_id) =>
      dispatch({ type: "UPDATE_LOGGED_IN", token, user_id })
  };
};

export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(Home);
