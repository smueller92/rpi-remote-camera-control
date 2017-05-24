#!/usr/bin/python
# -*- coding: utf-8 -*-

from abc import ABCMeta, abstractmethod

#Interface for Clients
class IClient():
    """ Interface/Abstract class for Clients"""
    __metaclass__ = ABCMeta

    @abstractmethod
    def connect(self):
        """
        Connect to server
        """
        pass

    @abstractmethod
    def subscribe(self):
        """
        Depending on protocol subscribe to topic or client
        """
        pass

    @abstractmethod
    def react(self):
        """
        Here the main functionality should be implemented. (Reaction to messages)
        """    
        pass
