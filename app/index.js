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

$(window).ready(function() {

  // setup panels
  for (var i = 1; i <= 6; i++) {
    var el = $('section#section'+i);
    panels['section'+i] = el;
  }

  var activePanel = lib.getActivePanelFromURL(window.location) || activePanel;
  lib.showActivePanel(activePanel,panels);

  $('section a.mktg-btn').click(function(e) {
    e.preventDefault();

    // get form data within the section
    const id = "section#section" + activePanel;
    const el = $(id);
    const form = el.find('form.responsive-form');
    formData[id] = qs.parse(form.serialize());
    if (activePanel === 2) {
      formData[id]['howManyVisitEventWebsiteYearly'] = formData[id]['howManyVisitEventWebsiteYearly'].replace(/\D/g,"");
    }
    if (activePanel === 3) {
      formData[id]['whatPercentMobile'] = formData[id]['whatPercentMobile'].replace(/[\D]/g,"");
    }

    if (activePanel === 4) {
      formData[id]['howMuchToMaintainAnnually'] = formData[id]['howMuchToMaintainAnnually'].replace(/[\D]/g,"");
    }
    var obj = lib.checkFilled(formData[id],activePanel);
    if (obj.error !== null) {
      $(id + " div.error").show();
      var isIphone = navigator.userAgent.test(/iPhone/i);
      alert("isIphone : " + isIphone.toString());
      if (isIphone) {
        if (activePanel == 2) {
          $("html, body").animate({ scrollTop: 0 }, "slow");
        }
        if (activePanel == 3) {
          $("html, body").animate({ scrollTop: 0 }, "slow");
        }
        if (activePanel == 4) {
          $("html, body").animate({ scrollTop: 0 }, "slow");
        }        
      } else {
        if (activePanel == 2) {
          $("html, body").animate({ scrollTop: 250 }, "slow");
        }
        if (activePanel == 3) {
          $("html, body").animate({ scrollTop: 950 }, "slow");
        }
        if (activePanel == 4) {
          $("html, body").animate({ scrollTop: 250 }, "slow");
        }
      }
      return;
    }
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

      var howManyPaidEvents = fields.field3;
      if (howManyPaidEvents == 0) {
        howManyPaidEvents = 1;
      }

      var c1 = ((howManyPaidEvents * fields.field4) / fields.field5) * 100;
      $('#calculation1').html(c1.toFixed(2) + '%');

      var c2 = 100 - c1;
      if (c2 <= 0) {
        $('#calculation2').html('0%');
      } else {
        $('#calculation2').html(c2.toFixed(2) + '%');
      }
    }

    if (activePanel === 3) {
      fields.field6 = parseFloat(formData[id]['howManyStepsToBuyTicket']);
      descriptiveFields['howManyStepsToBuyTicket'] = fields.field6;
      fields.field7 = (parseFloat(formData[id]['whatPercentMobile']) / 100);
      descriptiveFields['whatPercentMobile'] = fields.field7;
      fields.field8 = (formData[id]['isBuiltForMobile'] === 'NoPurchaseBuiltForMobile') ? false : true;
      descriptiveFields['isBuiltForMobile'] = fields.field8;
    }

    if (activePanel === 4) {

      formData[id]['howMuchToMaintainAnnually'] = formData[id]['howMuchToMaintainAnnually'].replace(/[$,]/g,"");
      fields.field9 = parseFloat(formData[id]['howMuchToMaintainAnnually']);
      descriptiveFields['howMuchToMaintainAnnually'] = fields.field9;
      fields.field10 = parseFloat(formData[id]['hoursEmployeesSpendOnManualTasks']);
      descriptiveFields['hoursEmployeesSpendOnManualTasks'] = fields.field10;
      var finalDollarFigure = 0;
      finalDollarFigure += ((fields.field6 - 3) * 0.1 * fields.field4 * fields.field2);

      if (fields.field8 === false) {
        //console.log("MOBILE NO: field 4:", fields.field4, " field 7 :", fields.field7, " field2:", fields.field2);
        const amt = (fields.field4 * fields.field7 * fields.field2 * 1.6);
        //console.log("field4 * field7 * 1.6 * field2 = " + amt);
        finalDollarFigure += amt;
      }

      finalDollarFigure += fields.field9;
      finalDollarFigure += (fields.field10 * 27.5 * 52);
      const lowerRange = finalDollarFigure * 0.8;
      const higherRange = finalDollarFigure * 1.2;
      var txt_finalDollarFigure = finalDollarFigure.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      var txt_lowerRange = '$'.concat(lowerRange.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
      var txt_higherRange = '$'.concat(higherRange.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));

      if (finalDollarFigure <= 200) {
        $('p#errorState5').hide();
        $('div.isLessThan200').show();
        $('div.isGreaterThan200').hide();
      } else {
        $('p#errorState5').show();
        $('div.isLessThan200').hide();
        $('div.isGreaterThan200').show();
      }

      $('span#finalDollarFigure').html('$ ' + txt_finalDollarFigure);
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
    var isMobile = window.matchMedia("only screen and (max-width: 760px)");
    if (!isMobile.matches) {
      $("html, body").animate({ scrollTop: 250 }, "slow");
    } else {
      $("html, body").animate({ scrollTop: 0 }, "slow");
    }

  });
  window.onpopstate = function(e) {
    if (e.state === null) {
      activePanel = lib.getActivePanelFromURL(window.location) || activePanel;
    } else {
      activePanel = e.state.activePanel;
    }
    lib.showActivePanel(activePanel,panels);
  }
});
