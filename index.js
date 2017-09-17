var Alexa = require('alexa-sdk');

var goodByMessage,
    helpMessage,
    introduction,
    reprompts,
    dirtyMessages,
    pronomen,
    Anrede;

function loadLocale(sLocale) {
  var oLocale;
  switch(sLocale) {
    case "de-DE":
      oLocale = require("./locales/de.js");
      break;
    case "en-US":
    case "en-GB":
    default:
      oLocale = require("./locales/en.js");
      break;
  }
  goodByMessage = oLocale.goodByMessage;
  helpMessage = oLocale.helpMessage;
  introduction = oLocale.introduction;
  reprompts = oLocale.reprompts;
  dirtyMessages = oLocale.dirtyMessages;
  pronomen = oLocale.pronomen;
  Anrede = oLocale.Anrede;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getAnsprache() {
  var AnspracheOptions = ["", " " + pronomen[getRandomInt(0, pronomen.length)] + " " + Anrede[getRandomInt(0, Anrede.length)], " " + pronomen[getRandomInt(0, pronomen.length)] + " " + Anrede[getRandomInt(0, Anrede.length)]]
  return AnspracheOptions[getRandomInt(0, 3)];
}

function getReprompt() {
  return reprompts[getRandomInt(0, reprompts.length)] + getAnsprache() + "?";
}

function getDirtyTalkMessage() {
  return dirtyMessages[getRandomInt(0, dirtyMessages.length)] + getAnsprache() + "!";
}

function doDirtyTalk(message) {
  this.emit(':ask', message + "<break time=\"1s\"/>" + getReprompt(), getReprompt());
}

function startDirtyTalk() {
  this.emit(':ask', introduction, getReprompt());
}

var handlers = {
    'LaunchRequest': function () {
        startDirtyTalk.call(this);
    },
    'Unhandled': function() {
      this.emit("AMAZON.HelpIntent");
    },
    'AMAZON.NoIntent': function() {
      this.emit("CloseSession");
    },
    'AMAZON.YesIntent': function() {
      doDirtyTalk.call(this, getDirtyTalkMessage());
    },
    'TalkDirtyIntent': function () {
      doDirtyTalk.call(this, getDirtyTalkMessage());
    },
    'CloseSession': function() {
      this.emit(':tell', goodByeMessage);
    },
    'AMAZON.CancelIntent': function() {
      this.emit("CloseSession");
    },
    'AMAZON.StopIntent': function() {
      this.emit("CloseSession");
    },
    'AMAZON.HelpIntent': function() {
      this.emit(":ask", helpMessage);
    }
 };

 exports.handler = function(event, context, callback) {
      loadLocale(event.request.locale);
      var alexa = Alexa.handler(event, context);
      alexa.registerHandlers(handlers);
      alexa.execute();
  };