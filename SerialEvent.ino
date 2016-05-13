void setup() {
  Serial.begin(9600);
  pinMode(13, OUTPUT);
}

int last = 0;

void loop() {
  while(Serial.available() > 0) {
    last = !last;
    //digitalWrite(13, last);
    //Serial.print("yeah");
    String data = Serial.readStringUntil('|');
    //Serial.print(data.charAt(0));
    Serial.print(data + '|');
    if(data.charAt(0) == '1') {
      digitalWrite(13, HIGH);
    }
    else {
      digitalWrite(13, LOW);
    }
  }
  //Serial.print("loop|");
  delay(5);
}

