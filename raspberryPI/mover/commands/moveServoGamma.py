#!/usr/bin/python
# -*- coding: utf-8 -*-

import json
from ICommand import ICommand

class moveServoGamma(ICommand):
    """
    gets data from the movement-sensors and executes gamma-direction movements
    """
    def __init__(self, commandOptions):
        """ Construct a new moveServoGamma bject
        :param commandOptions: List with servoNumber of the up/down - servo
        """
        self.servoNumGamma = commandOptions[0]
      
    def execute(self, servoblaster, position):
        """
        :param servoblaster: Servoblaster object
        :param position: variying position data 
        """
        servoblaster.write(self.servoNumGamma + "=" + position + '\n')
