const Gpio = require("pigpio").Gpio;

const red = new Gpio(17, { mode: Gpio.OUTPUT });
const green = new Gpio(27, { mode: Gpio.OUTPUT });
const blue = new Gpio(22, { mode: Gpio.OUTPUT });

function setColor(r, g, b) {
  red.pwmWrite(r);
  green.pwmWrite(g);
  blue.pwmWrite(b);
}

function transitionColors(startColor, endColor, duration, callback) {
  const steps = 100;
  const stepDelay = duration / steps;
  let step = 0;

  const rStep = (endColor[0] - startColor[0]) / steps;
  const gStep = (endColor[1] - startColor[1]) / steps;
  const bStep = (endColor[2] - startColor[2]) / steps;

  function stepTransition() {
    if (step <= steps) {
      const r = Math.round(startColor[0] + rStep * step);
      const g = Math.round(startColor[1] + gStep * step);
      const b = Math.round(startColor[2] + bStep * step);

      setColor(r, g, b);
      step++;
      setTimeout(stepTransition, stepDelay);
    } else {
      if (callback) callback();
    }
  }

  stepTransition();
}

function startTransitions() {
  transitionColors([255, 0, 0], [0, 255, 0], 3000, () => {
    transitionColors([0, 255, 0], [0, 0, 255], 3000, () => {
      transitionColors([0, 0, 255], [255, 0, 0], 3000, startTransitions); // Blue to Red and loop
    });
  });
}

startTransitions();

process.on("SIGINT", () => {
  setColor(0, 0, 0);
  process.exit();
});
