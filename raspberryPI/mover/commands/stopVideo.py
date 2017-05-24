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
crop="killall ffmpeg"

class stopVideo(ICommand):
    """ stops the streaming script    """
        
    def execute(self):
        subprocess.Popen(crop, shell=True)
        print("Video Stream stopped")
    

