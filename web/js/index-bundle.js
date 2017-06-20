(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./lib":2}],2:[function(require,module,exports){
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
},{}]},{},[1]);
