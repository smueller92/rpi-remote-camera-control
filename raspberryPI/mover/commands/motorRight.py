#!/usr/bin/python
# -*- coding: utf-8 -*-

import json
import os
from ICommand import ICommand

with open('config.json') as data_file:
        configdata = json.load(data_file)

gammaRight = configdata["gammaMaxTop"]
alphaRight = configdata["alphaMaxRight"]

class motorRight(ICommand):
    """ moves the servos to the max right/top position """   

    def __init__(self, commandOptions):
        """ Construct a new motorRight Object
        :param commandOptions: List with servoNumbers of both servos
        """
        self.servoNumAlpha = commandOptions[0]
        self.servonNumGamma = commandOptions[1]
        
    def execute(self, servoblaster):
        print>>servoblaster, self.servoNumAlpha + "=" + alphaRight
        print>>servoblaster, self.servonNumGamma + "=" + gammaRight
        
        print("Moved to right position")
    

