/**
 * Created by bedeho on 31/05/17.
 */

// Scene which may be active at any given time
var Scene = {
  NotStarted: 0, // before the core application has started
  Loading: 1,
  Downloading : 2,
  Uploading : 3,
  Completed : 4,
  ShuttingDown: 5
}

module.exports = Scene
