#include <Encoder.h>

// POT
int pot1Pin = A0;

// BUTTONs
int btn1Pin = 2;
int btn2Pin = 3;
int btn3Pin = 4;
int btn4Pin = 5;

// Encoder objects: (CLK, DT)
Encoder encoder1(11, 12);
Encoder encoder2(9, 10);

int enc1_val = 0;
int enc2_val = 0;

void setup() {
  Serial.begin(9600);

  pinMode(pot1Pin, INPUT);

  pinMode(btn1Pin, INPUT_PULLUP);
  pinMode(btn2Pin, INPUT_PULLUP);
  pinMode(btn3Pin, INPUT_PULLUP);
  pinMode(btn4Pin, INPUT_PULLUP);
  
}

void loop() {
  int pot1 = analogRead(pot1Pin);

  int btn1 = !digitalRead(btn1Pin);
  int btn2 = !digitalRead(btn2Pin);
  int btn3 = !digitalRead(btn3Pin);
  int btn4 = !digitalRead(btn4Pin);

  // Read encoders
  long rawEnc1 = encoder1.read();
  long rawEnc2 = encoder2.read();

enc1_val = constrain(rawEnc1 / 4, -100, 100);
enc2_val = constrain(rawEnc2 / 4, -100, 100);


Serial.print(",RawE1:");
Serial.print(rawEnc1);
Serial.print(",RawE2:");
Serial.println(rawEnc2);

  // Send serial
  Serial.print("P1:");
  Serial.print(pot1);

  Serial.print(",B1:");
  Serial.print(btn1);
  Serial.print(",B2:");
  Serial.print(btn2);
  Serial.print(",B3:");
  Serial.print(btn3);
  Serial.print(",B4:");
  Serial.print(btn4);

  Serial.print(",E1:");
  Serial.print(enc1_val);
  Serial.print(",E2:");
  Serial.println(enc2_val);

  delay(10);
}
