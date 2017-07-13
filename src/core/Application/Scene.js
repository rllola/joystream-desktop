/**
 * Created by bedeho on 31/05/17.
 */

// Scene which may be active at any given time
var Scene = {
  //None: 0, // before the core application has started
  //Starting: 1,
  //Stopping: 2,
  Downloading : 3,
  Uploading : 4,
  Completed : 5
}

module.exports = Scene
