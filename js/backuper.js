'use strict';


function MessagesBackup() {

  //-------------------------------------------------------------------------------------
  // OBJET INITIALISATION
  //-------------------------------------------------------------------------------------
  alert('Welcome!\n \n This app allows you to backup SMS messages in XML and HTML format on your SD card.');
  var global = this;
  var messages = [];
  var messages1 = [];

  var backupSMSButton = document.getElementById("backupSMS");
  backupSMSButton.addEventListener('click', function onMessagesBackupHandler() {
      window.setTimeout(global.BackupMessages, 0);
  });


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
   * Build message XML and HTML string
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
   * Export messages in output file (backup-messages.xml and backup-messages.html)
   */
  this.ExportMessages = function(foundSmsCount) {

    alert(foundSmsCount + " messages found.\n Start exporting...");

    messages.unshift('<?xml version="1.0"?>\n'); // XML document declaration
    messages1.unshift('<!DOCTYPE html>','<head><title>SMS backup FXOS</title></head>') // HTML document declaration


    var XMLBlob = new Blob(messages, { "type" : "text\/xml" }); // XML blob
    var HTMLBlob = new Blob(messages1, { "type" : "text\/html" }); // HTML blob

    var sdcard = navigator.getDeviceStorage("sdcard");
    
    if(sdcard!=null) // Check for SDcard
    {
      console.log("Sd card found.");
    }
    else
    {
      alert("Sd card not found on your device.");
    }

    var fileXMLHTML = sdcard.addNamed(XMLBlob, "backup-messages.xml") && sdcard.addNamed(HTMLBlob, "backup-messages.html");   // Save files 
    fileXMLHTML.onsuccess = function() {
      alert('Messages successfully wrote on the sdcard storage area in backup-messages.xml and backup-messages.html');
    }
    // An error typically occur if a file with the same name already exist
    fileXMLHTML.onerror = function() {
      console.warn('Unable to write the file backup-messages.xml and backup-messages.html: ' + this.error.name);
      //alert('Unable to write the file backup-messages.xml and backup-messages.html: ' + this.error.name); // testing error messages

      if(this.error.name=="Unknown") // occurs when you can't access SD card.
      {
        alert("Error: Can't access your SD Card: \nDisable USB storage on your device, unplug USB cable and try again.")
      }
      
      if(this.error.name=="NoModificationAllowedError")
      {
        var XMLexists = window.confirm("Files backup-messages.xml and backup-messages.html already exist. \n \nDo you want to replace them?")

        if(XMLexists)
        {
          var del = sdcard.delete("backup-messages.xml") && sdcard.delete("backup-messages.html"); // delete XML and HTML file 
           
          del.onsuccess = function()
          {
            var replace = sdcard.addNamed(XMLBlob, "backup-messages.xml") && sdcard.addNamed(HTMLBlob, "backup-messages.html"); 
            alert('Files backup-messages.xml and backup-messages.html were replaced with newer versions.');
          }

          del.onerror = function()
          {
            alert('Unable to delete files backup-messages.xml and backup-messages.html');
          }
        }
        else
          alert("Files backup-messages.xml and backup-messages.html were not replaced.");
      }
    }

  }

    return 0;

  };


window.addEventListener('DOMContentLoaded', function() {
  var backuper = new MessagesBackup();
});