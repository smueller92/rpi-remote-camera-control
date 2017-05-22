# Control the Raspberry PI Camera Movement using your Smartphone

## Hardware
This Prototype uses the following components:
#### Raspberry PI 3 (with WLAN Module)
#### Raspberry PI Camera
#### Camera Bracket:
http://www.exp-tech.de/raspberry-pi-kamerahalterung?gclid=Cj0KEQiA08rBBR-DUn4qproqwzYMBEiQAqpzns2OCN2veDyvJ5fQdBhPXfeCb0ru8NBU-TeEDS6dJiy_oaAkUo8P8HAQ
#### Pan-Tilt Kit with Servo-Motors:
http://www.exp-tech.de/dagu-pan-tilt-kit-with-servos?gclid=Cj0KEQiA08rBBR-DUn4qproqwzYMBEiQAqpzns8qGGMGf9-_mTLiQbipMpNHeQY-E8uau1437SaPlqqcaAlt18P8HAQ

## Installation
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
### Video Livestream (only working on a Desktop Browser)
NOTE: In this Prototype you can only view a Livestream of the Raspberry PI Camera on a Desktop PC and not on your Smartphone. 
Therefore open up the Webapplication on your Windows PC's Browser to see the Video: [Windows-IP-Adress]/rasp
#### Raspberry PI:
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
#### Server (Windows PC)
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
