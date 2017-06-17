const lib = require('./lib');

var panels = {};
var activePanel = 1;

$(window).ready(() => {
  for (var i = 1; i <= 6; i++) {
    var el = $('section#section'+i);
    panels['section'+i] = el;
  }
  $('section a.mktg-btn').click((e) => {
    e.preventDefault();
    activePanel++;
    if (activePanel == 7) {
      activePanel = 1;
    }
    lib.showActivePanel(activePanel,panels);
  });
});
