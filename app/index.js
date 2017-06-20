const lib = require('./lib');

var panels = {};
var activePanel = 1;


$(window).ready(() => {

  // setup panels
  for (var i = 1; i <= 6; i++) {
    var el = $('section#section'+i);
    panels['section'+i] = el;
  }

  var activePanel = lib.getActivePanelFromURL(window.location) || activePanel;
  console.log("activePanel onLoad:", activePanel);
  lib.showActivePanel(activePanel,panels);

  $('section a.mktg-btn').click((e) => {
    e.preventDefault();
    activePanel++;
    window.history.pushState({activePanel:activePanel}, "", "#"+activePanel);    

    if (activePanel == 7) {
      activePanel = 1;
    }
    lib.showActivePanel(activePanel,panels);
  });
  window.onpopstate = function(e) {
    console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
    if (event.state === null) {
      activePanel = lib.getActivePanelFromURL(window.location) || activePanel;
    } else {
      activePanel = event.state.activePanel;
    }
    lib.showActivePanel(activePanel,panels);    
  }
});
