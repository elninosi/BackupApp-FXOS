# BackupApp-FXOS

Firefox OS app for fetching SMS + MMS messages, Contacts and WiFi info from phone.

Creates backup-messages.html, backup-contacts.html and backup-WIFI.html on SD card.

###App screenshots:
<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/11082452/10456233/820528f0-71c0-11e5-81f8-85ae75567839.jpg" width="45%" height="45%" />
</p>

###Install App:
1. ``` git clone https://github.com/elninosi/BackupApp-FXOS.git ```
or [download ZIP](https://github.com/elninosi/BackupApp-FXOS/archive/master.zip).
2. Open Firefox
3. Open WebIDE in Firefox. [(Help?)](https://developer.mozilla.org/en-US/docs/Tools/WebIDE/Opening_WebIDE)
4. WebIDE: Project -> Open Packaged App -> Select Directory of App [(Help?)](https://developer.mozilla.org/en-US/docs/Tools/WebIDE/Creating_and_editing_apps)
5. WebIDE: Select Runtime -> Choose Firefox OS device to connect [(Help?)](https://developer.mozilla.org/en-US/docs/Tools/WebIDE/The_runtime_menu)
6. WebIDE: Click "play" button in the center of the WebIDE toolbar. [(Help?)](https://developer.mozilla.org/en-US/docs/Tools/WebIDE/Running_and_debugging_apps)
7. App is now installed in the selected runtime.

###Exported messages schemes:

SMS Messages are stored as HTML regarding the scheme below :
<message>

```
Type: sms
Message ID: XXX
Message thread ID: XXX
Message body:
Test
Is message sent or received? received
Message read? true
Message receiver: xxxxxxxxxx
Message sender: xxxxxxxxxx
Time: Day Month DD YYYY TT:TT:TT GMT+XXXX (CET)
Message class: normal/class-0/class-1/class-2/class-3

```
</message>

MMS Messages are stored as HTML regarding the scheme below :
<message>

```
Type: mms
Message ID: XXX
Message thread ID: XXX
Message subject:
Test
Message attachments: 
[{"id":"<100MEDIA_IMAGXXXX>","location":"100MEDIA_IMAGXXXX.jpg","content":{}},{"id":"","location":"text_0.txt","content":{}}]
State of message? sending/sent/not-download/received/error
Message read? true/false
Message receiver: xxxxxxxxxx
Message sender: xxxxxxxxxx
Time: Day Month DD YYYY TT:TT:TT GMT+XXXX (CET)

```
</message>

###Exported Contacts scheme:
Contacts are stored as HTML regarding the scheme below :
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

Example for 11600+ messages, 200+ Contacts, 35 WiFi networks = RAM consumption is 75MB+
<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/11082452/9956713/2f118662-5dfb-11e5-9922-1d591fa7dce9.gif" />
</p>


## Thanks:
* To [SMSBackupRestore](https://github.com/frayar/SMSBackupRestore/) for the idea.
* To [FabianOvrWrt](https://github.com/FabianOvrWrt) for the native look tweaks.
