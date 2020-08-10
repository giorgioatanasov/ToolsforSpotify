import React, { Component } from "react";
import { connect } from "react-redux";
import TableRows from "./TableRows.jsx";
import SpotifyWebApi from "../spotify-web-api.js";

const spotifyApi = new SpotifyWebApi();

class PlaylistTable extends Component {
  deleteTracks() {
    let playlist = this.props.curSelectPlaylist;
    if (
      this.props.checkboxes !== undefined &&
      Object.values(this.props.checkboxes).includes(true) &&
      playlist
    ) {
      var deleteTracks = [];
      var trackID = [];
      Object.entries(this.props.checkboxes)
        .filter(([, value]) => value) // only extract true valued checkboxes
        .map(([key]) => {
          trackID.push(key.split(".")[0]);
          deleteTracks.push("spotify:track:" + key.split(".")[0]);
        });
      spotifyApi.removeTracksFromPlaylist(playlist, deleteTracks);
      this.props.playlistInfo[playlist] = this.props.playlistInfo[
        playlist
      ].filter((obj) => !trackID.includes(obj.songId));
      this.props.dispatchUpdatePlaylistInfo(this.props.playlistInfo);
      this.props.dispatchSuccessDelete();
      this.forceUpdate();
    }
  }

  getIndex(playlistId) {
    if (this.props.curSelectPlaylist && this.props.playlistInfo) {
      return this.props.playlists
        .map(function (o) {
          return o.id;
        })
        .indexOf(playlistId);
    }
    return 0;
  }

  render() {
    if (this.props.curSelectPlaylist && this.props.playlistInfo) {
      var index = this.getIndex(this.props.curSelectPlaylist);
    }

    return (
      <body>
        {this.props.loggedIn !== undefined &&
          this.props.playlistInfo !== undefined &&
          this.props.loggedIn &&
          this.props.playlistInfo[this.props.curSelectPlaylist] && (
            <div id="content">
              {this.props.curSelectPlaylist && this.props.playlistInfo && (
                <>
                  <div className="AlbumInfo">
                    <img
                      className="AlbumArt"
                      src={this.props.playlists[index].AlbumArt}
                      alt=""
                      width="250"
                      height="250"
                    ></img>
                    <h1>Playlist</h1>
                    <h2 className="PlaylistName">
                      {this.props.playlists[index].name}
                    </h2>
                  </div>{" "}
                </>
              )}
              <table className="fixed_headers">
                <thead>
                  <tr className="headers">
                    <th>TITLE</th>
                    <th>ARTIST</th>
                    <th>ALBUM</th>
                  </tr>
                </thead>
                <tbody className="tableBody">
                  <TableRows />
                </tbody>
              </table>
              <div className="buttonContainer">
                <a className="btn btn-5" onClick={() => this.deleteTracks()}>
                  Delete Tracks
                </a>
                {this.props.successDelete && (
                  <div className="deleteSongs">Tracks Removed</div>
                )}
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
  playlists: state.playlists,
  curSelectPlaylist: state.playlistID,
  prevSelectPlaylist: state.oldPlaylistId,
  checkboxes: state.checkboxes,
  successDelete: state.successDelete,
  token: state.token,
  user_id: state.user_id,
});

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchCurPlaylistID: (playlistId) =>
      dispatch({ type: "SELECTED_PLAYLIST", playlistId }),
    dispatchSubmenuHtml: (data) =>
      dispatch({ type: "UPDATE_SUBMENU", submenuHtml: data }),
    dispatchLoggedIn: () => dispatch({ type: "LOGGED_IN" }),
    dispatchSuccessDelete: () => dispatch({ type: "SUCCESS_DELETE" }),
    dispatchLoginUpdate: (token, user_id) =>
      dispatch({ type: "UPDATE_LOGGED_IN", token, user_id }),
    dispatchUpdatePlaylistInfo: (playlistInfo) =>
      dispatch({ type: "UPDATE_PLAYLIST", playlistInfo }),
  };
};

export default connect(mapStatetoProps, mapDispatchToProps)(PlaylistTable);
