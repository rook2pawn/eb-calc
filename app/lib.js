const showActivePanel = function(activePanel, panels) {
  var id = 'section'+activePanel;
  var length = Object.keys(panels).length;
  for (var i = 1; i <= length; i++) {
    if (i == activePanel) {
      panels[id].fadeIn();
      $('section.mktg-landing-hero.section'+i).show();      
    } else {
      panels['section'+i].hide();
      $('section.mktg-landing-hero.section'+i).hide();      
    }
  }
}

exports.showActivePanel = showActivePanel;


const getActivePanelFromURL = function(loc) {

  var mapping = {
    '' : 1,
    '#1' : 1,
    '#2' : 2,
    '#3' : 3,
    '#4' : 4,
    '#5' : 5,
    '#6' : 6,
    '#7' : 7    
  }
  if (mapping[loc.hash] !== undefined) {
    return mapping[loc.hash]
  }
  return 1

}
exports.getActivePanelFromURL = getActivePanelFromURL;