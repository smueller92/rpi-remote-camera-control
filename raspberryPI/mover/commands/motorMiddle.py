#!/usr/bin/python
# -*- coding: utf-8 -*-

import json
from ICommand import ICommand

with open('config.json') as data_file:
        configdata = json.load(data_file)

gammaMiddle = configdata["gammaMiddle"]
alphaMiddle = configdata["alphaMiddle"]


class motorMiddle(ICommand):
    """
    moves the servos to the middle position. Has to be done before
    start reading sensor-movement data
    """

    def __init__(self, commandOptions):
        """ Construct a new motorMiddle Object
        :param commandOptions: List with servoNumbers of both servos
        """
        self.servoNumAlpha = commandOptions[0]
        self.servonNumGamma = commandOptions[1]
        
    def execute(self, servoblaster):
        print>>servoblaster, self.servoNumAlpha + "=" + alphaMiddle
        print>>servoblaster, self.servonNumGamma + "=" + gammaMiddle
        
        print("Moved to middle position")
    

