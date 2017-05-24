#!/usr/bin/python
# -*- coding: utf-8 -*-

from abc import ABCMeta, abstractmethod

class ICommand():
    """Interface for all commands to implement a function called execute"""
    __metaclass__ = ABCMeta

    @abstractmethod
    def execute(self): pass
