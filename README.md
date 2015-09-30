# BackupApp-FXOS

Firefox OS app for fetching SMS messages, Contacts and WiFi info from phone.

Creates backup-messages.xml, backup-messages.xml, backup-contacts.html and backup-WIFI.html in your SD card.

###App screenshots:
![backupapp](https://cloud.githubusercontent.com/assets/11082452/10190407/976c6cc0-676c-11e5-9e2b-07806b4709c0.jpg)

###Exported messages schemes:
Messages are stored as XML regarding the scheme below :

<message>

	<type>sms</type>
	<id>1</id> 
	<threadId >1</threadId> 
	<body>Test </body>
	<delivery>received</delivery>
	<read>true</read>
	<receiver>xxxxxxxxxx</receiver>
	<sender>xxxxxxxxxx</sender>
	<timestamp> TIME </timestamp>
	<messageClass>normal</messageClass>
	
</message>

Messages are stored as HTML regarding the scheme below :
<message>

```
Type: sms
Message ID: 1
Message thread ID: 1
Message body:
Test
Is message sent or recieved? received
Is message readed? true
Message receiver: xxxxxxxxxx
Message sender: xxxxxxxxxx
Time: TIME
Message class: normal

```
</message>
###Exported Contacts scheme:
Contats are stored as HTML regarding the scheme below :
<message>

```
Given name: name
Family name: surname
Telephone number: [{"type":["other"],"value":"xxxxxxxxxx"}]

```
</message>

</message>
###Exported Wifi info scheme:
Wifi info (known networks) are stored as HTML regarding the scheme below :
<message>

```
MAC Address: xx:xx:xx:xx:xx:xx
SSID: SSID of network
Security: Network security type (WEP/WPA-EAP/WPA-PSK)
Known: true

```

### RAM consumption:
Warning: If the number of SMS and/or Contacts is high RAM consuption will greatly increase.

Example for 11600+ messages and 200+ Contacts RAM consumption is 75MB+
![ezgif com-crop](https://cloud.githubusercontent.com/assets/11082452/9956713/2f118662-5dfb-11e5-9922-1d591fa7dce9.gif)


This is detached fork of [SMSBackupRestore](https://github.com/frayar/SMSBackupRestore/) in standalone repository.
