# SMS-backup-FXOS
Firefox OS app for fetching contacts from phone.

Creates backup-messages.xml and backup-messages.xml in your SD card.

App screenshots:
![smsbackup](https://cloud.githubusercontent.com/assets/11082452/9671607/55ea3044-5294-11e5-817a-ae11ef80cb45.jpg)


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

Type: sms<br>
Message ID: 1<br>
Message thread ID: 1<br>
Message body:<br>
Test<br>
Is message sent or recieved? received<br>
Is message readed? true<br>
Message receiver: xxxxxxxxxx<br>
Message sender: xxxxxxxxxx<br>
Time: TIME<br>
Message class: normal
<hr>
<br>
</message>


This is detached fork of https://github.com/frayar/SMSBackupRestore/ in standalone repository.
