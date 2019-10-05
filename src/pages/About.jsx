import React from "react";
import { connect } from "react-redux";

const About = () => {
  return (
    <div className="App">
      <body>
          <div class="About">
              <h1>
                  Tools for Spotify
              </h1>
              <h2>
                  Quickly delete songs
              </h2>
              <h3 className="websiteInfo">
              <span id="boldWords">ToolsforSpotify</span> is a web application that allows you to easily <span id="boldWords">delete multiple tracks</span> in a selected playlist at once. 
                  Once you have chosen the desired tracks to delete from your playlist, hit the <span id="boldWords">delete tracks button</span>. 
                  Upon clicking this button, you are able to select more songs to delete or pick a new playlist to delete tracks from by hovering over "playlists" in the navigation bar.
              </h3>
          </div>
      </body>
    </div>
  );
};

export default connect()(About);
