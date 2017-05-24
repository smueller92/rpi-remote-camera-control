#!/usr/bin/python
# -*- coding: utf-8 -*-

import json
from ICommand import ICommand

class moveServoAlpha(ICommand):
    """
    gets data from the movement-sensors and executes alpha-direction movements
    """
    def __init__(self, commandOptions):
        self.servoNumAlpha = commandOptions[0]
        """ Construct a new moveServoAlpha bject
        :param commandOptions: List with servoNumber of the left/right - servo
        """
      
    def execute(self, servoblaster, position):
        """
        :param servolaster: Servoblaster object
        :param position: varying position data
        """
        servoblaster.write(self.servoNumAlpha + "=" + position + '\n')
