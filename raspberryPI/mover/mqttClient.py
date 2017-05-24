#!/usr/bin/python
# -*- coding: utf-8 -*-

import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO
import json
import numbers
from commands import *
from IClient import IClient
from pprint import pprint

GPIO.setmode(GPIO.BOARD)

## List with systemID, Broker IP and Port
## and target IP for video streaming 
with open('settings.json') as data_file:
        settingsdata = json.load(data_file)
        
## List with configurations for developers        
with open('config.json') as data_file:
        configdata = json.load(data_file)

## List with commands, the system should be able to execute
with open('lookuptable.json') as data_file:
        lookuptable = json.load(data_file)

systemID = settingsdata["systemid"]
## The system connects to a topic that is the main topic and the systemID as a 
baseTopic = configdata["baseTopic"] + "/" + systemID
connectionInfoMessage = configdata["connectionInfoMessage"]
## Element from library that makes the servo moves smoother
servoblaster = open('/dev/servoblaster','w')


class mqttClient(IClient):
    """
    Main Class for the current system. Implements IClient.
    """


    def initalize(self, systemID):
        """
        Initialize mqtt Client of paho library
        :param systemID: The specific ID of the RaspberryPi system
        :return: Returns an mqtt-library object that takes command (e.g. connect)
        
        """
        client = mqtt.Client(client_id = systemID)
        return client

    def connect (self, client, mqttBrokerAddress, mqttBrokerPort):
        """
        Connects to specific mqttBroker with connect function of mqtt library
        :param client: client object
        :param mqttBrokerAddress: IP-Address of Mqtt Broker
        :para mqttBroker Port: Port of Mqtt Broker

        """        
        client.connect(mqttBrokerAddress, mqttBrokerPort)
       

    def subscribe (self, client):
        """
        subscribe a client to a topic
        :param client: client object

        """
        client.subscribe(baseTopic + "/#")
        print(connectionInfoMessage + " : " + baseTopic)

    def react(self, client):
        """
        Uses the on_message function of the mqtt library.
        When there is a new message execute reactOnMessages() function
        :param client: client object

        """
        client.on_message = self.reactOnMessages
        client.loop_forever()
        
    def reactOnMessages(self, client, userdata, msg):
        """
        Compares an incoming message (last subtopic) with the lookuptable.json
        and executes functions from the commands module.
        
        :param client: client object
        :param userdata: user defined data of any type that is passed as the userdata parameter to callbacks
        :param msg: The whole message object with msg.payload, msg.topic, ...

        """

        print(msg.topic + str(msg.payload))

        # get The last subtopic of the message, that represents the function that should be executed.
        subtopic = msg.topic.rsplit('/',1)[1]

        try:
            # Match the subtopic with the command name
            commandName = lookuptable[subtopic][0]["Command"]
            # Get Possible parameters that should be executed when calling the command
            commandOptionNames = (lookuptable[subtopic][0]["Options"])
            # Store the command Paramers in an array
            commandOptions= []
            for command in commandOptionNames:
                commandOptions.append(configdata[command])

            ## Create the command Class
            constructor = globals()[commandName]
            ## give the command block possible parameters (stored in lookuptable)
            try:
                command = constructor(commandOptions)   
            except TypeError:
                command = constructor()

            ## This is need when the variable movedata is needed    
            if lookuptable[subtopic][0]["Servoblaster"] == "true" and lookuptable[subtopic][0]["VaryingMoves"] == "true" :
                command.execute(servoblaster, str(msg.payload))
            ## For static moves
            elif lookuptable[subtopic][0]["Servoblaster"] == "true" :
                command.execute(servoblaster)
            ## For all other functions
            else:
                command.execute()
        ## If the command is unkown , do nothing        
        except KeyError:
           pass
        
        ## Has to be called after every move	        
        servoblaster.flush()
     




    
