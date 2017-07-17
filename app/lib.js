const Joi = require('joi-browser');

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
    "5" : "$1-$10",
    "18" : "$11-$25",
    "38" : "$26-$50",
    "63" : "$51-$75",
    "88" : "$76-$100",
    "113" : "$101-$125",
    "138" : "$126-$150",
    "151" : "$151+"
  }
  return map[price];
}
exports.mapTicketPrice = mapTicketPrice;

const mapNumberOfPaidEvents = function(number) {

  var map = {
    "1": "1",
    "2.5" : "2-3",
    "4.5" : "4-5",
    "6.5" : "6-7",
    "9" : "8-10",
    "15.5" : "11-20",
    "23" : "21-25",
    "26" : "26+",
    "0"  : "0"
  };
  return map[number];
};
exports.mapNumberOfPaidEvents = mapNumberOfPaidEvents;

const mapAverageAttendence = function(attendence) {

  var map = {
    "50" : "1-100",
    "175" : "101-250",
    "375" : "251-500",
    "750" : "501-1000",
    "1500" : "1001-2000",
    "2500" : "2001-3000",
    "4000" : "3001-5000",
    "5001" : "5001+"
  };
  return map[attendence];

};

exports.mapAverageAttendence = mapAverageAttendence;

const checkFilled = function(form, activePanel) {
  var schema = {};
  switch (activePanel) {
    case 2 :
      schema = Joi.object().keys({
      amountChargedForTickets : Joi.string().required(),
      averageAttendence : Joi.string().required(),
      howManyPaidEvents : Joi.string().required(),
      howManyVisitEventWebsiteYearly : Joi.string().required(),
      typeOfEvent : Joi.string().required()
      });
      return Joi.validate(form,schema);
    break;
    case 3 :
      schema = Joi.object().keys({
      howManyStepsToBuyTicket : Joi.string().required(),
      isBuiltForMobile : Joi.string().required(),
      whatPercentMobile : Joi.string().required()
      })
      return Joi.validate(form,schema);
    break;
    case 4 :
      schema = Joi.object().keys({
      hoursEmployeesSpendOnManualTasks :Joi.string().required(),
      howMuchToMaintainAnnually :Joi.string().required()
      });
      return Joi.validate(form,schema);
    break;
    default:
      return Joi.validate(form, schema);
    break;
  }
};
exports.checkFilled = checkFilled;
