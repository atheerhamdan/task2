#include <Servo.h>
/*
 A servo motor has everything built in: 
 a motor, a feedback circuit, and most 
 important, a motor driver. It just needs 
 one power line, one ground, and one control 
 pin.

 Following are the steps to connect 
 a servo motor to the Arduino:

   1 The servo motor has a female connector 
     with three pins. The darkest or even 
     black one is usually the ground. 
     Connect this to the Arduino GND.
   2 Connect the power cable that in all 
     standards should be red to 5V on the 
     Arduino.
   3 Connect the remaining line on the servo 
     connector to a digital pin on the Arduino.
*/
Servo myservo;  // create servo object to control a servo


int servoPin = 9; // Declare the Servo pin 
void setup() {
  Serial.begin(9600);
  // attaches the servo on pin 9 to the servo object
  myservo.attach(servoPin);  
}
void loop() {
  if (Serial.available() > 0) {
    int serialMessage = Serial.parseInt();
    if(serialMessage == 1) {
      Serial.println("Move Right");
     myservo.write(180); 
    } else if(serialMessage == 0) {
      Serial.println("Move Left ");
      myservo.write(0); 
    }
  }
}
