const showActivePanel = function(activePanel, panels) {
  var id = 'section'+activePanel;
  var length = Object.keys(panels).length;
  for (var i = 1; i <= length; i++) {
    if (i == activePanel) {
      panels[id].fadeIn();
    } else {
      panels['section'+i].hide();
    }
  }
}

exports.showActivePanel = showActivePanel;
