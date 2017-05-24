/**
 * Here we we convert all sensor data coming from 'mqtt.js' into PWM values which can
 * be used by the servos of the camera. Then we pass back the data to 'mqtt.js' with publish()
 *
 */

//Servo variables
var minImpulse;
var middleImpulse;
var maxImpulse;
var servoBlasterFactor;
var pulseSpan;
var sensorSteps;

/**
 * Gets called when the JS is loaded
 * Loads JSON Data from 'servo.json' into Servo variables
 */
$(document).ready(function() {
	//SERVO: Get servo.json and load data in variables
	$.getJSON('json/servo.json', function(data) {		
		//Set servo variables used to convert sensor data
		minImpulse=data.servo[0].minImpulse;
		middleImpulse=data.servo[0].middleImpulse;
		maxImpulse=data.servo[0].maxImpulse;
        servoBlasterFactor=data.servo[0].servoBlasterFactor;
		sensorSteps=data.servo[0].sensorSteps;
	});
});  

/**
 * This function sends the converted sensor values to the desired MQTT-Topic
 *
 * @param {string} publishString Payload broadcasted to specified Topic
 * @param {string} publishTopic Topic where the payload should be broadcasted
 * @param {number} publishQos Desired Quality of Service Level
 */
function publishSensorData(publishString, publishTopic, publishQos){
	var pString = publishString;
	var pTopic = publishTopic;
	var pQos = publishQos;
	
	publish(pString, pTopic, pQos);
}


/**
 * This method processes all alpha-sensor data inside the requested range
 * @param {string} alpha Sensor Value from DeviceOrientationEvent
 */
function processGyroAlpha(alpha) {
    var alphaInt = parseInt(alpha);
    var alphaString;
    if (alphaInt <= 90 || (alphaInt >= 270 && alphaInt <= 360)) {

        if (isConnected == true) {
			//Convert raw Alpha Coordinates into a Servo-PWM-Signal
            alphaString = this.getConvertedAlphaCoordinates(alphaInt);
            document.getElementById("convertedAlpha").innerHTML = alphaString;
			//Publish data to Servo using MQTT
            this.publishSensorData(alphaString, alphaTopic, qos);
        }
    }
}

/**
 * This method processes all gamma-sensor data inside the requested range
 * @param {string} gamma Sensor Value from DeviceOrientationEvent
 */
function processGyroGamma(gamma) {
    var gammaInt = parseInt(gamma);
    var gammaString;

    if (((gammaInt >= -90  && gammaInt <= -60) || (gammaInt >= 30  && gammaInt <= 90)) && gammaInt !== 0 ) {

        if (isConnected == true) {
			//Convert raw Gamma Coordinates into a Servo-PWM-Signal
            gammaString = this.getConvertedGammaCoordinates(gammaInt);
            document.getElementById("convertedGamma").innerHTML = gammaString;
			//Publish data to Servo using MQTT
            this.publishSensorData(gammaString, gammaTopic, qos);
        }
    }
}

/**
 * Convert raw Alpha-Sensor-Data into PWM-Signals required by the Servo
 * @param {number} rawAlpha Sensor Value Integer which will be converted into PWM Signals
 */
function getConvertedAlphaCoordinates(rawAlpha) {
    // The raw coordinates reach from 270-360(0) With 360(0) as middle position and from there to 0-90
    // Therefore the motorseconds are 0,0005 ms - 0,0015ms (middlePosition) - 0,0025ms

    //For the convertation we need 2 different functions:
    // 1. raw coordinates from 270-360 degrees:
    // (Means a movement from the middle to max Right Position = max clockwise movement)
    // a = 0,0005 + ((RawAlpha-270)* (0,0010/90)  [90 Steps;  0,0010 Range]
    var newAlpha;
    var intAlpha;
	//Maximal width of the PWM signal sent to the Servo
    pulseSpan = maxImpulse - minImpulse;

    if (rawAlpha >= 270 && rawAlpha <= 360){
        newAlpha = (minImpulse + ((rawAlpha - 270) * ((pulseSpan/2)/sensorSteps)))*servoBlasterFactor;
    }
    // 1. raw coordinates from 0-90 degrees:
    // (Means a movement from the middle to max Left Position = max counterclockwise movement)

    if (rawAlpha >= 0 && rawAlpha <= 90){
        newAlpha = (middleImpulse + (rawAlpha * ((pulseSpan/2)/sensorSteps)))*servoBlasterFactor;
    }

    //newAlpha = newAlpha.toFixed(0);
    intAlpha = parseInt(newAlpha);

    return intAlpha.toString();
}

/**
 * Convert raw Gamma-Sensor-Data into PWM-Signals required by the Servo
 * @param {number} rawGamma Sensor Value Integer which will be converted into PWM Signals
 */
function getConvertedGammaCoordinates(rawGamma) {
    // The raw coordinates reach from top: 0 to 90(-90) With 90/-90 as middle position and from -90(90) to 0 (bottom position)
    // Because of the bracket its just possible to move 30 degrees down. Also it makes no sense to move more than 60 degrees to top.
    // The motorseconds are ~85 (topPosition) - 150 (middlePosition) - ~185 (bottomPosition)
    var newGamma;
    var intGamma;
	//Maximal width of the PWM signal sent to the Servo
    pulseSpan = maxImpulse - minImpulse;

    // 1. raw coordinates from 30 to 90 degrees:
    // (Means a movement from the top to the middle position

    if (rawGamma >= 30 && rawGamma <= 90){
        newGamma = (minImpulse + (rawGamma * ((pulseSpan/2)/sensorSteps)))*servoBlasterFactor;
    }

    // 1. raw coordinates from -90 to -60 degrees:
    // (Means a movement from the middle to the bottom
    if (rawGamma >= -90 && rawGamma <= -60){
        newGamma = (maxImpulse + (rawGamma * ((pulseSpan/2)/sensorSteps)))*servoBlasterFactor;
    }

    //newAlpha = newAlpha.toFixed(0);
    intGamma = parseInt(newGamma);
    return intGamma.toString();
}
