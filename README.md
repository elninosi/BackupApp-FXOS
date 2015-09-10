# SMS-backup-FXOS
Firefox OS app for fetching SMS messages from phone.

Creates backup-messages.xml and backup-messages.xml in your SD card.

###App screenshots:
![sms backup](https://cloud.githubusercontent.com/assets/11082452/9797252/79ed4b1e-57fa-11e5-9c1d-89928698e42f.jpg)

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
<br>
</message>

### RAM consumption:
Warning: If the number of SMS is high RAM consuption will greatly increase.

Example for 11000+ messages, RAM consumption = 70MB+
![RAM conspumtion](https://cloud.githubusercontent.com/assets/11082452/9714199/85285434-5556-11e5-9bc2-953123935270.gif)


This is detached fork of [SMSBackupRestore](https://github.com/frayar/SMSBackupRestore/) in standalone repository.
