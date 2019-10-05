import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

class NavBar extends Component {
  fillSubmenuHtml() {
    return this.props.playlists.map(playlist => (
      <li key={playlist.id}>
        <NavLink
          to="PlaylistTable"
          onClick={() => {
            this.props.dispatchCurPlaylistID(playlist.id);
            this.props.dispatchRevertSuccessDelete();
          }}
        >
          <button className="submenuHtmlButton" id={playlist.id}></button>
          {playlist.name}
        </NavLink>
      </li>
    ));
  }

  componentDidUpdate() {
    if (this.props.curSelectPlaylist !== undefined) {
      this.createCheckboxes(this.props.curSelectPlaylist);
    }
  }

  createCheckboxes(selectedPlaylist) {
    if (selectedPlaylist) {
      var checkboxes = this.props.playlistInfo[selectedPlaylist].reduce(
        (obj, { songId }, index) => {
          obj[songId + "." + index] = false;
          return obj;
        },
        {}
      );
      this.props.dispatchCreateCheckboxes(checkboxes);
    }
  }

  checkboxState() {
    this.props.checkboxes();
  }

  render() {
    var overflowY = this.props.loggedIn ? "scroll" : "none";
    return (
      <div>
        <nav className="dropdownmenu">
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/About">About</NavLink>
            </li>
            <li>
              <NavLink to="/">Playlists</NavLink>
              <ul id="submenu" style={{ overflowY }}>
                {this.props.loggedIn && this.fillSubmenuHtml()}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

const mapStatetoProps = state => ({
  loggedIn: state.loggedIn,
  playlistInfo: state.playlistInfo,
  playlists: state.playlists,
  curSelectPlaylist: state.playlistID
});

const mapDispatchToProps = dispatch => {
  return {
    dispatchCurPlaylistID: playlistId =>
      dispatch({ type: "SELECTED_PLAYLIST", playlistId }),
    dispatchCreateCheckboxes: checkboxes =>
      dispatch({ type: "CREATE_CHECKBOXES", checkboxes: checkboxes }),
    dispatchRevertSuccessDelete: () => dispatch({ type: "REVERT_DELETE" })
  };
};

export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(NavBar);
