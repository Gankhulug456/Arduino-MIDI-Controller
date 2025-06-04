# 🎛️ Arduino MIDI Controller & Sensor Interface

A custom-built MIDI controller using an **Arduino Nano** that interfaces with web-based synthesizers using **WebSerial** and **Tone.js**. This project demonstrates a full embedded-to-web pipeline: reading real-world hardware inputs (knobs, buttons, sensors) and translating them into live browser-based audio effects.

---

## 🧩 Platform & Tools

- **Platform**: Arduino Nano  
- **Languages**: Arduino C++, JavaScript  
- **Frontend Libraries**: Tone.js, WebSerial API  
- **Design Tool**: Blender (for PCB layout)

---

## 🔧 Hardware & Firmware

Built a custom Arduino-based MIDI controller with:

- 🌀 **Potentiometers** – mapped to MIDI control change messages  
- 🔘 **Debounced Buttons** – trigger MIDI note-on/note-off events  
- 🌞 **Photoresistor** – controls a filter cutoff frequency in real time  
- 🌈 **RGB LEDs** – provide visual feedback for active parameters

### Firmware Features

- Analog-to-digital conversion for knobs
- Hardware-level debouncing for clean button signals
- MIDI-over-USB signal formatting
- Soldered components onto a custom PCB board (designed in Blender)

---

## 🌐 Web Integration

Built a browser-based interface using **WebSerial API** and **Tone.js**:

- Reads serial MIDI data directly from Arduino
- Maps MIDI CC values to synth parameters (e.g., filter cutoff, reverb)
- Provides real-time visual + audio feedback from physical input changes

### Result

> Turn a knob → MIDI signal sent → WebSerial receives → Tone.js updates synth parameter → Audio changes in browser 🔊

---

## 🧪 Skills Demonstrated

- Embedded Systems Programming  
- Hardware Prototyping & Soldering  
- PCB Design (Blender)  
- JavaScript + WebSerial Integration  
- Real-Time Audio with Tone.js  

---

## 📸 Media

> *(Add photos of the controller, wiring diagram, and a short demo video or GIF of it in action here.)*

---

## 🚀 Getting Started

1. Upload the Arduino firmware from `/firmware/arduino_midi_controller.ino`
2. Open the `/web/` folder and run the HTML/JS interface locally (Chrome recommended)
3. Connect your Arduino via USB and grant WebSerial permission
4. Twist knobs, press buttons, and play your synth in real-time!

---

## 🔗 See More

Visit [yourwebsite.com](https://ganaa.work) for more projects and demos.

