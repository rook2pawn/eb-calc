(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const lib = require('./lib');
const qs = require('querystring');

var panels = {};
var activePanel = 1;

// as we progress through the form, build the formData
var formData = {};
// we also populate fields for calculations
var fields = {};

// used to communicate back to marketo in MktoPersonNotes field
var descriptiveFields = {};

$(window).ready(() => {

  // setup panels
  for (var i = 1; i <= 6; i++) {
    var el = $('section#section'+i);
    panels['section'+i] = el;
  }

  var activePanel = lib.getActivePanelFromURL(window.location) || activePanel;
  lib.showActivePanel(activePanel,panels);

  $('section a.mktg-btn').click((e) => {
    e.preventDefault();

    // get form data within the section
    const id = "section#section" + activePanel;
    const el = $(id);
    const form = el.find('form.responsive-form');
    formData[id] = qs.parse(form.serialize());

    // special case to preload the conversion values
    if (activePanel === 2) {
      fields.field1 = formData[id]['typeOfEvent'];
      descriptiveFields['typeOfEvent'] = lib.mapEvents(fields.field1);
      fields.field2 = parseFloat(formData[id]['amountChargedForTickets']);
      descriptiveFields['amountChargedForTickets'] = lib.mapTicketPrice(fields.field2);
      fields.field3 = parseFloat(formData[id]['howManyPaidEvents']);
      descriptiveFields['howManyPaidEvents'] = lib.mapNumberOfPaidEvents(fields.field3);
      fields.field4 = parseFloat(formData[id]['averageAttendence']);
      descriptiveFields['averageAttendence'] = lib.mapAverageAttendence(fields.field4);
      fields.field5 = parseFloat(formData[id]['howManyVisitEventWebsiteYearly']);
      descriptiveFields['howManyVisitEventWebsiteYearly'] = fields.field5;

      var c1 = (fields.field3 * fields.field4) / fields.field5;
      $('#calculation1').html(c1.toFixed(2) + '%');

      var c2 = 100 - c1;
      $('#calculation2').html(c2.toFixed(2) + '%');
    }

    if (activePanel === 3) {
      fields.field6 = parseFloat(formData[id]['howManyStepsToBuyTicket']);
      descriptiveFields['howManyStepsToBuyTicket'] = fields.field6;
      fields.field7 = parseFloat(formData[id]['whatPercentMobile']);
      descriptiveFields['whatPercentMobile'] = fields.field7;
      fields.field8 = (formData[id]['isBuiltForMobile'] === 'NoPurchaseBuiltForMobile') ? false : true;
      descriptiveFields['isBuiltForMobile'] = fields.field8;
    }

    if (activePanel === 4) {

      fields.field9 = parseFloat(formData[id]['howMuchToMaintainAnnually']);
      descriptiveFields['howMuchToMaintainAnnually'] = fields.field9;
      fields.field10 = parseFloat(formData[id]['hoursEmployeesSpendOnManualTasks']);
      descriptiveFields['hoursEmployeesSpendOnManualTasks'] = fields.field10;
      var finalDollarFigure = 0;
      finalDollarFigure += ((fields.field6 - 3) * 0.1 * fields.field5 * fields.field2);

      if (fields.field8 === false) {
        finalDollarFigure += (fields.field5 * fields.field7 * 1.6);
      }

      finalDollarFigure += fields.field9;
      finalDollarFigure += (fields.field10 * 27.5 * 52);
      const lowerRange = finalDollarFigure * 0.8;
      const higherRange = finalDollarFigure * 1.2;
      var txt_finalDollarFigure = finalDollarFigure.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      var txt_lowerRange = '$'.concat(lowerRange.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
      var txt_higherRange = '$'.concat(higherRange.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
      $('span#finalDollarFigure').html(txt_finalDollarFigure);
      $('span.lowerRange').html(txt_lowerRange);
      $('span.higherRange').html(txt_higherRange);
      descriptiveFields['finalDollarFigure'] = txt_finalDollarFigure;
      descriptiveFields['lowerRange'] = txt_lowerRange;
      descriptiveFields['higherRange'] = txt_higherRange;
    }


    activePanel++;
    window.history.pushState({activePanel:activePanel, descriptiveFields:descriptiveFields}, "", "#"+activePanel);

    if (activePanel == 7) {
      activePanel = 1;
    }
    lib.showActivePanel(activePanel,panels);
    $("html, body").animate({ scrollTop: 250 }, "slow");

  });
  window.onpopstate = function(e) {
    //console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
    if (event.state === null) {
      activePanel = lib.getActivePanelFromURL(window.location) || activePanel;
    } else {
      activePanel = event.state.activePanel;
    }
    lib.showActivePanel(activePanel,panels);
  }
});

},{"./lib":2,"querystring":5}],2:[function(require,module,exports){
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

const mapEvents = function(evt) {
  var map = {
    "Classes" : "Registration",
    "Conferences" : "Registration",
    "FestivalsAndConsumerEvents" : "Festivals/Special Events",
    "MusicFestivalsAndConcerts" : "Music/Promoters",
    "NonProfitEvents" : "Registration",
    "RacesAndParticipatorySports" : "Participatory Sports",
    "UniversityEducation" : "Registration"
  };
  return map[evt];
};

exports.mapEvents = mapEvents;

const mapTicketPrice = function(price) {

  var map = {
    "0" : "Free",
    "5" : "$1–$10",
    "18" : "$11–$25",
    "38" : "$26–$50",
    "63" : "$51–$75",
    "88" : "$76–$100",
    "113" : "$101–$125",
    "138" : "$126-$150",
    "151" : "$151+"
  }
  return map[price];
}
exports.mapTicketPrice = mapTicketPrice;

const mapNumberOfPaidEvents = function(number) {

  var map = {
    "1": "1",
    "2.5" : "2–3",
    "4.5" : "4–5",
    "6.5" : "6–7",
    "9" : "8–10",
    "15.5" : "11–20",
    "23" : "21–25",
    "26" : "26+",
    "0"  : "0"
  };
  return map[number];
};
exports.mapNumberOfPaidEvents = mapNumberOfPaidEvents;

const mapAverageAttendence = function(attendence) {

  var map = {
    "50" : "1–100",
    "175" : "101–250",
    "375" : "251–500",
    "750" : "501–1000",
    "1500" : "1001–2000",
    "2500" : "2001–3000",
    "4000" : "3001-5000",
    "5001" : "5001+"
  };
  return map[attendence];

};

exports.mapAverageAttendence = mapAverageAttendence;
},{}],3:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],4:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],5:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":3,"./encode":4}]},{},[1]);
