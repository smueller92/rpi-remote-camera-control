#!/usr/bin/python
# -*- coding: utf-8 -*-

import json
from ICommand import ICommand

with open('config.json') as data_file:
        configdata = json.load(data_file)

gammaLeft = configdata["gammaMaxBottom"]
alphaLeft = configdata["alphaMaxLeft"]


class motorLeft(ICommand):
    """
    Moves the servos to the max. left/bottom position
    """

    def __init__(self, commandOptions):
        """ Construct a new motorLeft Object
        :param commandOptions: List with servoNumbers of both servos
        """
        self.servoNumAlpha = commandOptions[0]
        self.servonNumGamma = commandOptions[1]
        
    def execute(self, servoblaster):
        print>>servoblaster, self.servoNumAlpha + "=" + alphaLeft
        print>>servoblaster, self.servonNumGamma + "=" + gammaLeft
        
        print("Moved to left position")
    

