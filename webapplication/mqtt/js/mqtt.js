/**
 * Here we define basic methods for the MQTT-System and the connection with the MQTT Broker
 */
 
//MQTT variables
var baseTopic;
var startPositionMsg;
var leftPositionMsg;
var rightPositionMsg;
var startCamMsg;
var stopCamMsg;
var qos;
var brokerIP;
var brokerPort;
var systemID;
var client;
var infoTopic;
var alphaTopic;
var gammaTopic;
var startPositionTopic;
var leftPositionTopic;
var rightPositionTopic;
var startVideoTopic;
var stopVideoTopic;
var infoMessage;
var alphaMessage;
var gammaMessage;
var startPositionMessage;
var leftPositionMessage;
var rightPositionMessage;
var startVideoMessage;
var stopVideoMessage;

//Program variables
var sleep;
var startFormationErrMsg;
var disconMsg;
var isConnected = false;
var startFormation = false;
var VideoServerIP;
var VideoServerPort;
var VideoString;
var client;
var canvas;
var player;

/**
 * Gets called when the JS is loaded, sets automatically pre-filled connection input
 * Loads JSON Data from 'mqtt.json' and 'config.json' into variables
 */
$(document).ready(function() {
	
	//Automatically pre-filled Input for the Connect-Mask inside the Browser
    $('#brokerIP').get(0).value = "broker.mqttdashboard.com";
    $('#brokerPort').get(0).value = 8000;
    $('#systemID').get(0).value = "appDesignSyst3m1";
	

	
	//MQTT: Get mqtt.json and load data in variables
	$.getJSON('json/mqtt.json', function(data) {		
		baseTopic=data.mqtt[0].baseTopic;
		startPositionMsg=data.mqtt[0].startPositionMsg;
		leftPositionMsg=data.mqtt[0].leftPositionMsg;
		rightPositionMsg=data.mqtt[0].rightPositionMsg;
		startCamMsg=data.mqtt[0].startCamMsg;
		stopCamMsg=data.mqtt[0].stopCamMsg;
		qos=data.mqtt[0].qos;
		infoMessage=data.mqtt[0].infoMessage;
		alphaMessage=data.mqtt[0].alphaMessage;
		gammaMessage=data.mqtt[0].gammaMessage;
		startPositionMessage=data.mqtt[0].startPositionMessage;
		leftPositionMessage=data.mqtt[0].leftPositionMessage;
		rightPositionMessage=data.mqtt[0].rightPositionMessage;
		startVideoMessage=data.mqtt[0].startVideoMessage;
        stopVideoMessage=data.mqtt[0].stopVideoMessage;	
	
	});	
	
  	//CONFIG: Get config.json and load data in variables
	$.getJSON('json/config.json', function(data) {		
		sleep=data.config[0].sleep;
		startFormationErrMsg=data.config[0].startFormationErrMsg;
		disconMsg=data.config[0].disconMsg;	
		VideoServerIP=data.config[0].VideoServerIP;
		VideoServerPort=data.config[0].VideoServerPort;
		VideoString = "ws://" + VideoServerIP + ":" + VideoServerPort + "/";
	});
});

/**
 * Gets called when the user presses the Button "Connect"
 */
function connectToBroker() {
	//Establish the Connection to the MQTT Broker with the Data from the Browser 
    brokerIP = $('#brokerIP').val();
    brokerPort = $('#brokerPort').val();
    systemID = String($('#systemID').val());
	
	//Set all Topics
    infoTopic = baseTopic + "/" + systemID + "/" + infoMessage;
    alphaTopic = baseTopic + "/" +systemID + "/" + alphaMessage;
    gammaTopic = baseTopic + "/" +systemID + "/" + gammaMessage;
    startPositionTopic = baseTopic + "/" +systemID + "/" + startPositionMessage;
    leftPositionTopic = baseTopic + "/" +systemID + "/" + leftPositionMessage;
    rightPositionTopic = baseTopic + "/" +systemID + "/" + rightPositionMessage;
	stopVideoTopic = baseTopic + "/" +systemID + "/" + stopVideoMessage;
    startVideoTopic = baseTopic + "/" +systemID + "/" + startVideoMessage;

	client = new Messaging.Client(brokerIP, parseInt(brokerPort), "myclientid_" + parseInt(Math.random() * 100, 10));
    client.connect(options);
    isConnected=true;
	

}

/**
 * Connection Options
 */
var options = {
    timeout:3,
    //Gets Called if the connection has sucessfully been established
    onSuccess: function () {
        alert("Connected");
        document.getElementById("connect").className = "connectInvisible";
        document.getElementById('mainStuff').style.cssText = 'display: block'
        //publish(startCamMsg, infoTopic, qos);
    },
    //Gets Called if the connection could not be established
    onFailure: function (message) {
        alert("Connection failed: " + message.errorMessage);
    }
};

/**
 * Creates a new Messaging.Message Object and sends it to the HiveMQ MQTT Broker
 *
 * @param {string} payload Desired Content you want to sent to a specific Topic
 * @param {string} topic MQTT Topic which broadcasts the payload
 * @param {number} qos Desired Quality of Service Level
 */
var publish = function (payload, topic, qos) {
    //Send your message (also possible to serialize it as JSON or protobuf or just use a string, no limitations)
    var message = new Messaging.Message(payload);
    message.destinationName = topic;
    message.qos = qos;
    client.send(message);
}

/**
 * Gets called when the user presses the Button "Move To Start Formation"
 */
function moveToStartPosition() {
    publish(startPositionMsg, startPositionTopic, qos)
    startFormation = true;
}

/**
 * Gets called when the user presses the Button "Move to max. Left Formation"
 */
function moveToLeftPosition() {
    publish(leftPositionMsg, leftPositionTopic, qos)
}

/**
 * Gets called when the user presses the Button "Move to max. Right Position"
 */
function moveToRightPosition() {
    publish(rightPositionMsg, rightPositionTopic, qos)
}

/**
 * Gets called when the user presses the Button "Start Movement"
 */
function startReadingMoves() {
    //Check if the Camera centered at its' start position
    if (startFormation == true) {
		//Start reading sensor alpha & gamma data
        if (window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", function () {
				//Display sensor data in Browser
                document.getElementById("gamma").innerHTML = event.gamma;
                document.getElementById("alpha").innerHTML = event.alpha;
				//call sensor data processing functions in sensor.js and wait for a while
                processGyroAlpha(event.alpha);
                processGyroGamma(event.gamma);
                sleepFor(sleep);
            }, true);
        }
    }
    else {
		//Prompts the user to center the Camerasystem at it's start position
        alert(startFormationErrMsg);
    }
}

/**
 * Gets called when the user presses the Button "Start Livestream"
 */
function startVideo() {
    publish(startCamMsg, startVideoTopic, qos)
}

/**
 * Gets called when the user presses the Button "Stop Livestream"
 */
function stopVideo() {
    publish(stopCamMsg, stopVideoTopic, qos)
}


/**
 * Gets called when the user presses the Button "Disconnect"
 * Terminates the current session and sets the user's Browser back to the login form
 */
function disconnectIt() {
	publish(stopCamMsg, stopVideoTopic, qos);
    client.disconnect()
    alert(disconMsg);
    document.getElementById("connect").className = "connectVisible";
    document.getElementById('mainStuff').style.cssText = 'display: none';
    
}

/**
 * This method determines the speed/frequency of the transmitted MQTT Data
 * @param {number} sleepDuration Specifies how long the application will sleep/wait.
 */
function sleepFor(sleepDuration) {
    var now = new Date().getTime();
    while (new Date().getTime() < now + sleepDuration) 
	{ 
		/* do nothing */
    }
}
