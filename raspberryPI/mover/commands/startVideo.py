#!/usr/bin/python
# -*- coding: utf-8 -*-

import json
from ICommand import ICommand
import subprocess

with open('settings.json') as data_file:
        settingsdata = json.load(data_file)

#IP-Address where the video should be streamed to. Defined in settings.json
targetIp = str(settingsdata["targetIp"])


# command to start video streaming to a particular IP-Address
crop="ffmpeg -s 320x240 -f video4linux2 -i /dev/video0 -f mpeg1video \-b 800k -r 30 http://"+targetIp+":8082/admin/320/240/ &"

class startVideo(ICommand):
    """ starts the script for streaming video to a IP-address declared in the settings.json
    """
        
    def execute(self):
        subprocess.Popen(crop, shell=True)
        print("stopped Video Stream")
    

