# Raspberry PI Camera Movement Control
## Control your Raspberry PI Camera by using your Smartphone
In this project I have created a Remote Camera Control Prototype with a Raspberry PI. The Raspberry PI Camera is attached to a Pan/Tilt Kit with two servo-motors for X and Y Movement. You can control the motor's movement with sensors integrated in your Smartphone by simply opening up a Web Page in your Browser. The Project is using the MQTT Protocol to send the Smartphone's sensor data to your Raspberry. The required Web Application is stored on your Windows Computer which acts as the MQTT Server.

## How Does It Work?
Your Windows PC is using a local Apache Server to host the Web Application. After opening the Web Application on your Smartphone's Browser the Application processes the Phone's Sensor Data and sends them to multiple MQTT Channels. 
The Software running on the Raspberry is listening to any incoming MQTT Messages from your MQTT Server (Windows PC) and sends the converted Sensor Data as PWM Signals to the servo-motors of the Camera Pan/Tilt Kit.

## Hardware
This Prototype uses the following components:
#### Raspberry PI 3 (with WLAN Module)
#### Raspberry PI Camera
#### Camera Bracket:
http://www.exp-tech.de/raspberry-pi-kamerahalterung?gclid=Cj0KEQiA08rBBR-DUn4qproqwzYMBEiQAqpzns2OCN2veDyvJ5fQdBhPXfeCb0ru8NBU-TeEDS6dJiy_oaAkUo8P8HAQ
#### Pan-Tilt Kit with Servo-Motors:
http://www.exp-tech.de/dagu-pan-tilt-kit-with-servos?gclid=Cj0KEQiA08rBBR-DUn4qproqwzYMBEiQAqpzns8qGGMGf9-_mTLiQbipMpNHeQY-E8uau1437SaPlqqcaAlt18P8HAQ
#### Breakaway Platin Pins (optional for Servo-Motor Cable-Socket Extension)
https://www.amazon.de/Steckerleiste-Kopfleiste-Stiftleiste-Stecker-Arduino/dp/B01LWD5MPB/ref=sr_1_2?s=ce-de&ie=UTF8&qid=1495632244&sr=1-2&keywords=pin+arduino

# Installation
- Put together the Pan/Tilt Kit and attach the Camera Bracket
- Mount the Rpi Camera onto the Bracket
- Extend the Servomotor Cable Sockets with Pins or just cut away the Socket
- Make sure the Raspberry Pi 3 is turned off
- **Plug in the Servo Cables as followed:**
```Servo for X Movement (Left/Right or Smartphone Alpha Sensor): 
Data (Orange)  -> Pin 7 (GPIO-4)
Power (Red)    -> Pin 2 (DC Power 5V)
Ground (Brown) -> Pin 9 (Ground)

Servo for Y Movement (Up/Down or Smartphone Gamma Sensor):
Data (Orange)  -> Pin 11 (GPIO-17)
Power (Red)    -> Pin 4 (DC Power 5V)
Ground (Brown) -> Pin 6 (Ground)
```
Raspberry PI 3 Pinout Help Image: 
https://www.element14.com/community/servlet/JiveServlet/previewBody/73950-102-10-339300/pi3_gpio.png
### Server (Windows PC)
- Install XAMPP: https://www.apachefriends.org/de/download.html
- Extract mqtt folder to C:\xampp\htdocs
- Run XAMPP Control Panel and start Apache Server
- Open cmd.exe and type ipconfig
- Note your IPv4-Adress
- This sets up the Webapplication (MQTT Server) which you can later access using your Smartphone
### Raspberry PI
- Start Raspberry and connect it to the Internet
- Open up the Terminal
```
$ ifconfig
```
- Note your WLAN IP-Adress (For Windows RemoteAccess)
```
$ sudo apt-get update
$ sudo apt-get upgrade
```
- extract 'mover' folder to e.g. Rasbperry Pi Desktop
- Setup Servoblaster:
```
$ cd /Desktop/mover/Servoblaster/user
$ sudo make servod
$ cd /Desktop/mover
$ sudo chmod 777 beforeStart.sh start.py
$ sudo ./beforeStart.sh
$ sudo python start.py
```
- This starts the application and the Raspberry is now listening to any Sensor Data sent from your Smartphone over your MQTT Server (Windows PC) 
### Smartphone
- Open Browser (tested with Google Chrome)
- type [Windows-IP-Adress]/rasp (e.g. 192.168.2.30/rasp)
- Press Connect
- Press Move To Start Position
- Press Start Movement
- Now you can move the Camera-Pan-Tilt-Kit by rotating your Smartphone



## Video Livestream (only working on a Desktop Browser)
NOTE: In this Prototype you can only view a Livestream of the Raspberry PI Camera on a Desktop PC and not on your Smartphone. 
Therefore open up the Webapplication on your Windows PC's Browser to see the Video: [Windows-IP-Adress]/rasp
### Raspberry PI:
- Change IP-Adress in /Desktop/mover/settings.json to the Server (Windows) IP
- Install FFMPEG on Raspberry:
```
# build and install x264
git clone --depth 1 git://git.videolan.org/x264
cd x264
./configure --host=arm-unknown-linux-gnueabi --enable-static --disa-ble-opencl
make -j 4
sudo make install
# build and make ffmpeg
git clone --depth=1 git://source.ffmpeg.org/ffmpeg.git
cd ffmpeg
./configure --arch=armel --target-os=linux --enable-gpl --enable-libx264 --enable-nonfree
make -j4
sudo make install
```
### Server (Windows PC)
- Google Chrome Browser: localhost/rasp
- Install node.js on Windows: https://nodejs.org/en/download/
- Restart System and open cmd.exe
```
node
npm install npm -g
npm install jsmpeg
cd C:/xampp/htdocs/rasp/jsmpeg
node stream-server.js admin
```
- open index.html in 'rasp' folder and insert your Windows-IP
```
var client = new WebSocket( 'ws://WINDOWS_IP:8084/' );
```
- Press Livestream Button on Smartphone and you can see the stream on your Desktop Browser
