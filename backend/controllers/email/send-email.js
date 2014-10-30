'use strict';

module.exports = function(emailReceiver, userSendingInvitation, sessionId) {

  var swig  = require('swig'),
      nodemailer = require('nodemailer'),
      path = require('path'),
      templateFolder = path.resolve(__dirname, 'templates'),
      config = require('../../config.js');

  var html = swig.renderFile(templateFolder + '/template.html', {
      user:       userSendingInvitation,
      sessionId:  sessionId
  });

  var transport = nodemailer.createTransport('SMTP', {
    service: config.mailer.service,
    auth: {
      user: config.mailer.user,
      pass: config.mailer.pass
    }
  });

  function sendEmail() {
    transport.sendMail({
      from: 'Webresume <mailer@webresume.com>',
      to: emailReceiver,
      subject: 'Somebody wants to have a chat with you',
      html: html,
      // generateTextFromHTML: true,
      // text: text
    }, function(err, responseStatus) {
      if (err) {
        console.log(err);
      } else {
        console.log(responseStatus.message);
      }
    });
  }

  return { sendEmail: sendEmail };
};