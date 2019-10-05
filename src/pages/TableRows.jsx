import React, { Component } from "react";
import { connect } from "react-redux";

class TableRows extends Component {
  onCheckboxClick(songId) {
    this.props.dispatchUpdateCheckboxes(songId);
  }

  render() {
    return (
      this.props.curSelectPlaylist &&
      this.props.playlistInfo[this.props.curSelectPlaylist].map(
        ({ songTitle, songId, artist, albumArt }, index) => (
          <tr
            className="tableRow"
            key={songId + "." + index}
            onClick={() => this.onCheckboxClick(songId + "." + index)}
          >
            <td className="songTitle">
              <label className="container">
                <input
                  type="checkbox"
                  className="songtitle"
                  id={songId + "." + index}
                  checked={
                    this.props.checkboxes[songId + "." + index]
                      ? this.props.checkboxes[songId + "." + index]
                      : false
                  }
                  onChange={() => this.onCheckboxClick(songId + "." + index)}
                />
                <span className="checkmark"></span>
                {songTitle}
              </label>
            </td>
            <td>{artist}</td>
            <td>
              <img className="albumArt" src={albumArt} alt="" />
            </td>
          </tr>
        )
      )
    );
  }
}

const mapStatetoProps = state => ({
  loggedIn: state.loggedIn,
  playlistInfo: state.playlistInfo,
  playlists: state.playlists,
  curSelectPlaylist: state.playlistID,
  prevSelectPlaylist: state.oldPlaylistId,
  deleteTracks: state.deleteTracks,
  checkboxes: state.checkboxes
});

const mapDispatchToProps = dispatch => ({
  dispatchUpdateCheckboxes: songId =>
    dispatch({ type: "UPDATE_CHECKBOXES", songId })
});
export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(TableRows);
