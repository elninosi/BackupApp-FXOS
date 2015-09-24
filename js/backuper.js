'use strict';

function ExitApp(){ // function for closing app
  var global = this;
  var closeAPP = document.getElementById("exit");
  closeAPP.addEventListener('click', function onExitAppHandler(){
    window.setTimeout(global.Exit, 0);
  })

  this.Exit = function()
  {
   window.close(); // close the app
  }
}

function DeleteApp(){
  var global = this;
  var DeleteApplication = document.getElementById("DeleteApp");
  DeleteApplication.addEventListener('click', function onDeleteAppHandler(){
    window.setTimeout(global.DeleteBackupApp, 0);
  })

  this.DeleteBackupApp = function()
  {
     var request = window.navigator.mozApps.getSelf();
      request.onsuccess = function() 
      {
        var origin = request.result;
        var DeleteApplication = navigator.mozApps.mgmt.uninstall(origin);
      };
  }
}

function DeleteFile(){ // function for deleting files
  var global = this;
  var deleteSMSButton = document.getElementById("deleteSMS");
  deleteSMSButton.addEventListener('click', function onDeleteFileHandler()
  {
  window.setTimeout(global.Deleter, 0);
  });

  this.Deleter = function()
  {

  var sdcard = navigator.getDeviceStorage("sdcard");
  var del1 = sdcard.delete("backup-messages.xml") && sdcard.delete("backup-messages.html") && sdcard.delete("backup-contacts.html"); // delete XML and HTML files

    del1.onsuccess = function()
          { 
            alert('Files backup-messages and backup-contacts were successfully deleted.');
          }

    del1.onerror = function()
          {
            alert('Unable to delete files backup-messages and backup-contacts.');
          }
  }
}

function MessagesBackup(){ //function for SMS backup

  document.getElementById("deleteSMS").style.display="none"; // Hide delete button for now.
  document.getElementById("DeleteApp").style.display="none"; // Hide Delete App button. for now.

  alert('Welcome!\n \n This app allows you to backup SMS messages and Contacts in XML and HTML format on your SD card.');
  var global = this;
  var messages = [];
  var messages1 = [];

  var backupSMSButton = document.getElementById("backupSMS");
  backupSMSButton.addEventListener('click', function onMessagesBackupHandler()
  {
      window.setTimeout(global.BackupMessages, 0);
  });


  this.BackupMessages = function() {

    alert('SMS backup in progress ...');

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
    messages1.unshift('<!DOCTYPE html>','<head><title>SMS backup FXOS</title><meta charset="utf-8"></head>') // HTML document declaration, UTF-8 encoding


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

    document.getElementById("deleteSMS").style.display="initial"; // Now show delete button.
    document.getElementById("DeleteApp").style.display="initial"; // Now show Delete App button.
    document.getElementById("backupSMS").style.display="none"; // Hide SMS backup button.


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
        var fileExists = window.confirm("Files backup-messages.xml and backup-messages.html already exist. \n \nDo you want to replace them?")

        if(fileExists)
        {
          var del = sdcard.delete("backup-messages.xml") && sdcard.delete("backup-messages.html"); // delete XML and HTML files 
           
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
}

function ContactsBackup() {
 var global = this;
 var contacts = [];
 var backupContactsButton = document.getElementById("contact");
 backupContactsButton.addEventListener('click', function onConctactBackupHandler() {
    window.setTimeout(global.BackupContacts, 0);
 });

 this.BackupContacts = function()
  {
    alert('Contacts backup in progres ...');

    var request = navigator.mozContacts.getAll();
    var foundContactsCount = 0;

    request.onsuccess = function () {
      var domCursor1 = request;
      if (!domCursor1.result) 
      {
        console.log('End of contacts');
        global.ExportContacts(foundContactsCount);
        return;
      }
      
        var HTMLContact = global.BuildHTMLContact(domCursor1.result);
        contacts.push(HTMLContact);

        foundContactsCount++;
        //console.log(this.result.givenName + ' ' + this.result.familyName + ' ' + JSON.stringify(this.result.tel));
        //alert(domCursor1.result.givenName + ' ' + domCursor1.result.familyName + ' \n' + JSON.stringify(domCursor1.result.tel));
        document.getElementById("log").innerHTML = "Contacts found: " + foundContactsCount; // Contacts counter status.
        domCursor1.continue(); 

    };

    request.onerror = function () {
      alert("Received 'onerror' Contact request event.")
      alert('Get Contacts error: ' + request.error.name);
    };
  }

  this.BuildHTMLContact = function(contact)
  {
       var html1 = '<p>';
        html1 += 'Given name: ' + contact.givenName + '<br>';
        html1 += 'Family name: ' + contact.familyName + '<br>';
        html1 += 'Telephone number: ' + JSON.stringify(contact.tel) + '<br>';
        html1 += '</p>';

        return html1;
  };

  this.ExportContacts = function(foundContactsCount) {
    alert (foundContactsCount + " contacts found. \n Start exporting...");

    contacts.unshift(('<!DOCTYPE html>','<head><title>Contacts backup FXOS</title><meta charset="utf-8"></head>')) //HTML declaration, UTF-8 encoding.

    var HTMLContactsBlob = new Blob(contacts, { "type" : "text\/html" });
    var sdcard = navigator.getDeviceStorage("sdcard");

    if(sdcard!=null) // Check for SDcard
    {
      console.log("Sd card found.");
    }
    else
    {
      alert("Sd card not found on your device.");
    }

    document.getElementById("deleteSMS").style.display="initial"; // Now show delete button.
    document.getElementById("DeleteApp").style.display="initial"; // Now show Delete App button.
    document.getElementById("contact").style.display="none"; // Hide Contacts backup button.

    var fileContactsHTML = sdcard.addNamed(HTMLContactsBlob, "backup-contacts.html");
    fileContactsHTML.onsuccess = function(){
      alert('Contacts successfully wrote on the sdcard storage area in backup-contacts.html')
    }
    fileContactsHTML.onerror = function(){
      if(this.error.name=="Unknown") // occurs when you can't access SD card.
      {
        alert("Error: Can't access your SD Card: \nDisable USB storage on your device, unplug USB cable and try again.")
      }
      
      if(this.error.name=="NoModificationAllowedError")
       {
        var fileExists = window.confirm("File backup-contacts.html already exist. \n \nDo you want to replace it?")

        if(fileExists)
        {
          var del = sdcard.delete("backup-contacts.html"); // delete HTML file 
           
          del.onsuccess = function()
          {
            var replace = sdcard.addNamed(HTMLContactsBlob, "backup-contacts.html"); 
            alert('File backup-contacts.html was replaced with newer versions.');
          }

          del.onerror = function()
          {
            alert('Unable to delete file backup-contacts.html');
          }
        }
        else
          alert("File backup-contacts.html was not replaced.");
      }
    }
  }
}

window.addEventListener('DOMContentLoaded', function(){
  var backuper = new MessagesBackup();
});

window.addEventListener('DOMContentLoaded', function(){
  var contacter = new ContactsBackup();
});

window.addEventListener('DOMContentLoaded', function(){
  var deleter = new DeleteFile();
});

window.addEventListener('DOMContentLoaded', function(){
  var exiter = new ExitApp();
});

window.addEventListener('DOMContentLoaded', function(){
  var appDeleter = new DeleteApp();
})