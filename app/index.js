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
