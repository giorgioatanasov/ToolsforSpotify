import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

const initialState = {
  loggedIn: false,
  token: "",
  playlistInfo: [],
  playlists: [],
  playlistID: "",
  oldPlaylistId: "",
  deleteTracks: [],
  checkboxes: {},
  successDelete: false,
  display_name: "",
};

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_SUBMENU":
      return {
        ...state,
        submenuHtml: state.submenuHtml,
      };
    case "LOGGED_IN":
      return {
        ...state,
        loggedIn: true,
      };

    case "UPDATE_LOGGED_IN":
      return {
        ...state,
        loggedIn: action.token ? true : false,
        token: action.token ? action.token : "",
        display_name: action.display_name || "Spotify User",
      };
    case "FILL_PLAYLIST":
      return {
        ...state,
        playlistInfo: action.playlistInfo,
        playlists: action.playlists,
      };
    case "SELECTED_PLAYLIST":
      return {
        ...state,
        oldPlaylistId: state.oldPlaylistId
          ? state.playlistID
          : action.playlistId,
        playlistID: action.playlistId,
      };
    case "CREATE_CHECKBOXES":
      return {
        ...state,
        checkboxes: action.checkboxes,
      };
    case "UPDATE_CHECKBOXES":
      return {
        ...state,
        checkboxes: {
          // update checkboxes
          ...state.checkboxes,
          [action.songId]: !state.checkboxes[action.songId],
        },
      };
    case "SUCCESS_DELETE":
      return {
        ...state,
        successDelete: true,
      };
    case "REVERT_DELETE":
      return {
        ...state,
        successDelete: false,
      };
    case "LOGOUT":
      return {
        initialState,
      };

    case "UPDATE_PLAYLIST":
      return {
        ...state,
        playlistInfo: action.playlistInfo,
      };
    default:
      return state;
  }
};

const stores = createStore(
  mainReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

ReactDOM.render(
  <Provider store={stores}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
