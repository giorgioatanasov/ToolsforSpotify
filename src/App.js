import React, { Component } from "react";
import "./App.css";
import "./style.css";
import NavBar from "./pages/NavBar.jsx";
import ScrollUpButton from "react-scroll-up-button";
import ScrollToTop from "react-router-scroll-top";
import DocumentTitle from "react-document-title";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
//Pages
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import PlaylistTable from "./pages/PlaylistTable.jsx";

class App extends Component {
  render() {
    return (
      <div className="App">
        <DocumentTitle title="SpotifyTools"></DocumentTitle>
        <Router>
          <ScrollToTop>
            <NavBar />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/About" component={About} />
              <Route exact path="/PlaylistTable" component={PlaylistTable} />
              <Redirect to="/" />
            </Switch>
            <ScrollUpButton
              ContainerClassName="scrollUpButton"
              AnimationDuration={400}
            />
          </ScrollToTop>
        </Router>
      </div>
    );
  }
}

export default App;
