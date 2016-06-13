int pins[] = {3, 8, 2, 9, 10, 11, 12, 13};

float motor1 = 0;
float motor2 = 0;
float motor3 = 0;

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
    String zval = "";

    int i = 0;
    while(true) {
      if(data.charAt(i) == ',') {
        i++;
        break;
      }
      else {
        xval += data.charAt(i);
      }
      i++;
    }
    while(true) {
       if(data.charAt(i) == ',') {
        i++;
        break;
      }
      else {
        yval += data.charAt(i);
      }
      i++;
    }
     while(i < data.length()) {
      zval += data.charAt(i);
      i++;
    }

    float x = xval.toFloat();
    float y = yval.toFloat();
    float z = zval.toFloat();

    motor1 = x;
    motor3 = -x;
    motor2 = y;

    if(z != 0) {
      motor1 = z;
      motor3 = z;
    }

    Serial.print("recieved: " + String(yval) +  ", " + String(zval) + "|");
    
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

  if (motor1 > 0.3) {
    digitalWrite(pins[0], LOW);
    digitalWrite(pins[1], HIGH);
  }
  else if (motor1 < -0.3) {
    digitalWrite(pins[0], HIGH);
    digitalWrite(pins[1], LOW);
  }
  else {
    digitalWrite(pins[0], LOW);
    digitalWrite(pins[1], LOW);
  }

  if (motor3 > 0.3) {
    digitalWrite(pins[5], LOW);
    digitalWrite(pins[6], HIGH);
  }
  else if (motor3 < -0.3) {
    digitalWrite(pins[5], HIGH);
    digitalWrite(pins[6], LOW);
  }
  else {
    digitalWrite(pins[5], LOW);
    digitalWrite(pins[6], LOW);
  }

  if(motor2 > 0) {
    digitalWrite(pins[2], LOW);
    digitalWrite(pins[3], HIGH);
  }
  else if(motor2 < 0) {
    digitalWrite(pins[3], LOW);
    digitalWrite(pins[2], HIGH);
  }
  else {
    digitalWrite(pins[2], LOW);
    digitalWrite(pins[3], LOW);
  }
  //Serial.print("loop|");
  delay(5);
}

