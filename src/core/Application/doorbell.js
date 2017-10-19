window.doorbellOptions = {
  appKey: 'Z8RYHGIQeb7QeVtJD1HLn0fMZlhQgPovzorgfutn8gnCuLfTP8t2d3LnybV2Ow1s'
}

function loadDoorbell () {
  window.doorbellOptions.windowLoaded = true
  var g = document.createElement('script')
  g.id = 'doorbellScript'
  g.type = 'text/javascript'
  // Weirdely if Remove the ';' I have an error...
  g.src = 'https://embed.doorbell.io/button/7029?t='+(new Date().getTime());
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(g)
}

export { loadDoorbell }
