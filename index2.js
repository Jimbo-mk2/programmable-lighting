const Gpio = require("pigpio").Gpio;
const schedule = require("node-schedule");

// Define GPIO pins for the RGB channels
const red = new Gpio(17, { mode: Gpio.OUTPUT });
const green = new Gpio(27, { mode: Gpio.OUTPUT });
const blue = new Gpio(22, { mode: Gpio.OUTPUT });

// Function to set the color of the RGB LED with PWM
function setColor(r, g, b) {
  red.pwmWrite(r);
  green.pwmWrite(g);
  blue.pwmWrite(b);
}

// Define colors
const colors = {
  orange: [255, 165, 0],
  lightBlue: [173, 216, 230],
  red: [255, 0, 0],
  off: [0, 0, 0],
};

// Schedule tasks based on the time of day
schedule.scheduleJob("0 7 * * *", () => {
  // At 07:00
  setColor(...colors.orange);
});

schedule.scheduleJob("0 9 * * *", () => {
  // At 09:00
  setColor(...colors.lightBlue);
});

schedule.scheduleJob("0 17 * * *", () => {
  // At 17:00
  setColor(...colors.red);
});

schedule.scheduleJob("0 22 * * *", () => {
  // At 22:00
  setColor(...colors.off);
});

// Set initial color based on current time
function setInitialColor() {
  const now = new Date();
  const hours = now.getHours();

  if (hours >= 7 && hours < 9) {
    setColor(...colors.orange);
  } else if (hours >= 9 && hours < 15) {
    setColor(...colors.lightBlue);
  } else if (hours >= 15 && hours < 22) {
    setColor(...colors.red);
  } else {
    setColor(...colors.off);
  }
}

console.log("index2");
setInitialColor();

// Cleanup on exit
process.on("SIGINT", () => {
  setColor(0, 0, 0);
  process.exit();
});
