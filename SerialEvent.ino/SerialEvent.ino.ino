int pins[] = {2, 3, 8, 9, 10, 11, 12, 13};

float motor1 = 0;

void setup() {
  Serial.begin(9600);
  for(int i = 0; i < 8; i++) {
    pinMode(pins[i], OUTPUT);
  }
}

int last = 0;

float timer0 = 0;

void loop() {
  while(Serial.available() > 0) {
    char first = Serial.read();
    if(first != 'x') {
       Serial.print(first + "|");
      break;
    }
    last = !last;
    //digitalWrite(13, last);
    //Serial.print("yeah");
    String data = Serial.readStringUntil('|');
    //Serial.print(data.charAt(0));
    //Serial.print(data + "|");
    String xval = "";
    String yval = "";

    int i = 0;
    while(true) {
      if(data.charAt(i) == ',') {
        break;
      }
      else {
        xval += data.charAt(i);
      }
      i++;
    }
    while(i < data.length() - 1) {
      i++;
      yval += data.charAt(i);
    }

    float x = xval.toFloat();
    float y = yval.toFloat();

    motor1 = x;

    Serial.print("recieved: " + xval + ", " + yval + "|");
    
    /*if(data.charAt(0) == '1') {
      for(int i = 0; i < 8; i++) {
        digitalWrite(pins[i], HIGH);
      }
    }
    else if (data.charAt(0) == '0') {
      for(int i = 0; i < 8; i++) {
        digitalWrite(pins[i], LOW);
      }
    }
    else {
    }*/
  }

  if(motor1 != 0) {
     timer0++;
     Serial.print(String(timer0) + "|");
  
     if(timer0 > 10 - 10*motor1) {
         digitalWrite(pins[0], HIGH);
         timer0 = 0;
     }
     else {
         digitalWrite(pins[0], LOW);
     }
   }
   else {
      digitalWrite(pins[0], LOW);
   }
  //Serial.print("loop|");
  delay(5);
}

