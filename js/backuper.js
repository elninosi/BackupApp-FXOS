'use strict';

/***
 This class handles the activity regarding
 the messages exports to the SD memory card

 Refer to:
 https://developer.mozilla.org/en-US/docs/Web/API/MozSmsManager -- windows.navigator.MozSmsManager
 https://developer.mozilla.org/en-US/docs/Web/API/MozMobileMessageManager -- window.navigator.mozMobileMessage 
 https://developer.mozilla.org/en-US/docs/Web/API/MozSmsMessage

 **/

function MessagesBackup() {

  //-------------------------------------------------------------------------------------
  // OBJET INITIALISATION
  //-------------------------------------------------------------------------------------
  alert('Welcome!');
  var global = this;
  var messages = [];
  var messages1 = [];

  var backupSMSButton = document.getElementById("backupSMS");
  backupSMSButton.addEventListener('click', function onMessagesBackupHandler() {
      window.setTimeout(global.BackupMessages, 0);
  });

  

  

  //-------------------------------------------------------------------------------------
  // BACKUP MESSAGES
  //-------------------------------------------------------------------------------------

  /**
   * Backup messages
   */ 
  this.BackupMessages = function() {

    alert('Backup in progress ...');

    // Get message manager
     var smsManager = window.navigator.mozSms || window.navigator.mozMobileMessage;

     if(!smsManager)
      alert("SMS API is not supported on this device.")

    // Get read messages
    var request = smsManager.getMessages(null, false);

    // Process messages
    var foundSmsCount = 0;
    request.onsuccess = function() {
      // Get cursor
      var domCursor = request;
      if (!domCursor.result) {
        console.log('End of message');
        global.ExportMessages(foundSmsCount);
        return;
      }

      console.warn('domCursor=' + domCursor);

      var xmlMessage = global.BuildXMLMessage(domCursor.result);
      var HTMLMessage = global.BuildHTMLMessage(domCursor.result);
      messages.push(xmlMessage);
      messages1.push(HTMLMessage);

      foundSmsCount++;
      document.getElementById("log").innerHTML = "SMS found: " + foundSmsCount; // SMS counter status.
      // Now get next message in the list
      domCursor.continue();
    };

    // Ctach error(s)
    request.onerror = function() {
      alert("Received 'onerror' smsrequest event.");
      alert("sms.getMessages error: " + request.error.name);
    };
    

  };

  /**
   * Build message xml string
   */
  this.BuildXMLMessage = function(message) {
    var xml = '<message>\n';
    xml += '\t<type>' + message.type + '</type>\n';
    xml += '\t<id>' + message.id + '</id>\n';
    xml += '\t<threadId>' + message.threadId + '</threadId>\n';
    xml += '\t<body><![CDATA[' + message.body + ']]></body>\n';
    xml += '\t<delivery>' + message.delivery + '</delivery>\n';
    xml += '\t<read>' + message.read + '</read>\n';
    xml += '\t<receiver>' + message.receiver + '</receiver>\n';
    xml += '\t<sender>' + message.sender + '</sender>\n';
    xml += '\t<timestamp>' + message.timestamp + '</timestamp>\n';
    xml += '\t<messageClass>' + message.messageClass + '</messageClass>\n';
    xml += '</message>\n';

    return xml;
  };

  this.BuildHTMLMessage = function(message) {
    var date = new Date (message.timestamp); //convert date to human readable form

    var html = '<p>';
    html += 'Type: ' + message.type + '<br>';
    html += 'Message ID: ' + message.id + '<br>';
    html += 'Message thread ID: ' + message.threadId + '<br>';
    html += 'Message body:<br><b>' + message.body + '</b><br>';
    html += 'Is message sent or recieved? ' + message.delivery + '<br>';
    html += 'Is message readed? ' + message.read + '<br>';
    html += 'Message receiver: <b>' + message.receiver + '</b><br>';
    html += 'Message sender: <b>' + message.sender + '</b><br>';
    html += 'Time: ' + date + '<br>';
    html += 'Message class: ' + message.messageClass + '<hr>';
    html += '</p>';

    return html;
  };

  /**
   * Export messages in output file (sdcard/backup-messages.xml)
   */
  this.ExportMessages = function(foundSmsCount) {
    
    alert(foundSmsCount + " messages found.\n Start exporting...");

    messages.unshift('<?xml version="1.0"?>\n'); // XML document declaration
    messages1.unshift('<!DOCTYPE html>','<head><title>SMS backup FXOS</title></head>') // HTML document declaration


    var XMLBlob = new Blob(messages, { "type" : "text\/xml" }); // XML blob
    var HTMLBlob = new Blob(messages1, { "type" : "text\/html" }); // HTML blob

    var sdcard = navigator.getDeviceStorage("sdcard");

    var del = sdcard.delete("backup-messages.xml"); // delete XML file if exists
 /*  
    del.onsuccess = function(){
      alert('File already exists. Deleting backup-messages.xml');
    }
    del.onerror = function(){
      alert('Unable to delete the file backup-messages.xml');
    }
*/
    var del1 = sdcard.delete("backup-messages.html"); // delete HTML file if exists
 /*   del1.onsuccess = function(){
      alert('File already exists. Deleting backup-messages.html');
    }
    del1.onerror = function(){
      alert('Unable to delete the file backup-messages.html');
    }
*/
    var requestXML = sdcard.addNamed(XMLBlob, "backup-messages.xml");

    requestXML.onsuccess = function() {
      alert('Messages successfully wrote on the sdcard storage area in backup-messages.xml');
    }
    // An error typically occur if a file with the same name already exist
    requestXML.onerror = function() {
      alert('Unable to write the file backup-messages.xml: ' + this.error);
    }

    var requestHTML = sdcard.addNamed(HTMLBlob, "backup-messages.html");
    requestHTML.onsuccess = function() {
      alert('Messages successfully wrote on the sdcard storage area in backup-messages.html');
    }
    requestHTML.onerror = function() {
      alert('Unable to write the file backup-messages.html: ' + this.error);
    }

    return 0;

  };

 

 }

window.addEventListener('DOMContentLoaded', function() {
  var backuper = new MessagesBackup();
});