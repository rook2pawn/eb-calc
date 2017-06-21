const lib = require('./lib');
const qs = require('querystring');

var panels = {};
var activePanel = 1;

// as we progress through the form, build the formData
var formData = {};
// we also populate fields for calculations
var fields = {};

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

    // get form data within the section
    const id = "section#section" + activePanel;
    const el = $(id);
    const form = el.find('form.responsive-form');
    formData[id] = qs.parse(form.serialize());
    console.log(formData[id]);

    // special case to preload the conversion values
    if (activePanel === 2) {

      fields.field2 = parseFloat(formData[id]['amountChargedForTickets']);
      fields.field3 = parseFloat(formData[id]['howManyPaidEvents']);
      fields.field4 = parseFloat(formData[id]['averageAttendence']);
      fields.field5 = parseFloat(formData[id]['howManyVisitEventWebsiteYearly']);


      var c1 = (fields.field3 * fields.field4) / fields.field5;
      console.log("C1:", c1);
      $('#calculation1').html(c1.toFixed(2) + '%');

      var c2 = 100 - c1;
      $('#calculation2').html(c2.toFixed(2) + '%');
    }

    if (activePanel === 3) {


      fields.field6 = parseFloat(formData[id]['howManyStepsToBuyTicket']);
      fields.field7 = parseFloat(formData[id]['whatPercentMobile']);
      fields.field8 = (formData[id]['isBuiltForMobile'] === 'NoPurchaseBuiltForMobile') ? false : true;

    }

    if (activePanel === 4) {

      fields.field9 = parseFloat(formData[id]['howMuchToMaintainAnnually']);
      fields.field10 = parseFloat(formData[id]['hoursEmployeesSpendOnManualTasks']);
      console.log("FIELDS:", fields);
      var finalDollarFigure = 0;
      finalDollarFigure += ((fields.field6 - 3) * 0.1 * fields.field5 * fields.field2);

      console.log(finalDollarFigure);
      if (fields.field8 === false) {
        finalDollarFigure += (fields.field5 * fields.field7 * 1.6);
        console.log("NOT MOBILE :", finalDollarFigure);        
      }

      finalDollarFigure += fields.field9;
      console.log("+ field9" , finalDollarFigure);      
      finalDollarFigure += (fields.field10 * 27.5 * 52);
      console.log(" + field 10" , finalDollarFigure);
      const lowerRange = finalDollarFigure * 0.8;
      const higherRange = finalDollarFigure * 1.2;
      $('span#finalDollarFigure').html(finalDollarFigure.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
      $('span.lowerRange').html('$'.concat(lowerRange.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')));
      $('span.higherRange').html('$'.concat(higherRange.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')));      

    }


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
