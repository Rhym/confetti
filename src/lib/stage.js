import _range from 'lodash/range';

import Confetti from './confetti';

class Stage {

  /**
   * Generate a random number between two values.
   *
   * @param a
   * @param b
   * @param factor
   * @returns {*}
   */
  static randomFrom(a, b, factor) {
    if (!factor) {
      factor = 1;
    }
    return a + (Math.floor((b - a) * Math.random() * factor) / factor);
  }

  constructor() {
    if(this._element === null) {
      return;
    }

    this.nodeCount = 500;
    this._animate = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        setTimeout(callback, 1000 / 60);
      };

    this._element = document.getElementById('confettiContainer');
    this._canvas = document.getElementById('confettiCanvas');
    this._angle = 0.01;
    this._animate = this._animate.bind(window);

    this.draw = this.draw.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
  }

  /**
   * Instigate the class
   */
  init(config = {}) {
    const _this = this;

    if(this._element === null || this._canvas === null) {
      return;
    }

    this._context = this._canvas.getContext('2d');
    this._width = this._element.offsetWidth;
    this._height = this._element.offsetHeight;

    // Update configs based on props.
    Object.keys(config).forEach((prop) => {
      _this[prop] = config[prop];
    });

    window.addEventListener('resize', this.setDimensions.bind(this));
    this.setDimensions();

    this.particles = _range(0, this.nodeCount).map(() => {
      return new Confetti({
        color: _this.color,
        numberOfParticles: _this.nodeCount,
        canvas: this._canvas,
        x: _this.constructor.randomFrom(0, _this._canvas.width),
        y: _this.constructor.randomFrom(0, _this._canvas.height),
        r: _this.constructor.randomFrom(5, 30),
        tilt: _this.constructor.randomFrom(-10, 0),
        tiltAngle: 0,
        tiltAngleIncrement: _this.constructor.randomFrom(0.05, 0.12, 100),
      });
    });

    this.step(this.particles, {
      angle: 0.01,
      tiltAngle: 0.1,
    })();
  }

  /**
   * Set the dimensions for the canvas.
   */
  setDimensions() {
    if (!document.body.contains(this._element) || !document.body.contains(this._canvas)) {
      console.log();
      this.destroy();
      return;
    }

    this._width = this._element.offsetWidth;
    this._height = this._element.offsetHeight;
    this._canvas.width = this._width;
    this._canvas.height = this._height;
  }

  /**
   * @param particles
   * @param stepConfig
   * @returns {animator}
   */
  step(particles, stepConfig) {
    const _this = this;

    return function animator() {
      if (_this.halt) {
        return;
      }
      _this._context.clearRect(0, 0, _this._width, _this._height);
      if (_this.updateState) {
        _this.updateState();
      }
      for (let i = 0; i < particles.length; i += 1) {
        _this.draw(particles[i], i);
        _this.updatePosition(particles[i], i);
      }
      window.Confetti._animate(_this.step(particles, stepConfig));
    };
  }

  /**
   * Remove the event listeners from the element.
   */
  destroy() {
    const _this = this;
    window.removeEventListener('resize', _this.setDimensions);
    _this.halt = true;
  }

  /**
   * @param confetti - The particle object
   * @param index - The index of the particle
   */
  updatePosition(confetti, index) {
    const confettiNode = confetti;

    confettiNode.tiltAngle += confettiNode.tiltAngleIncrement;
    confettiNode.y += (Math.cos(this._angle + confettiNode.d) + 1 + (confettiNode.r / 2)) / 4;
    confettiNode.x += Math.sin(this._angle);
    confettiNode.tilt = 15 * (Math.sin(confettiNode.tiltAngle - (index / 3)));

    // IF the flake is still rendered inside the canvas.
    if (confettiNode.isFlakeExiting()) {
      if (index % 5 > 0 || index % 2 === 0) {
        confettiNode.x = this.constructor.randomFrom(0, this._canvas.width);
        confettiNode.y = -10;
        confettiNode.tilt = this.constructor.randomFrom(-10, 0);
      } else if (Math.sin(this._angle) > 0) {
        confettiNode.x = -5;
        confettiNode.y = this.constructor.randomFrom(0, this._canvas.height);
        confettiNode.tilt = this.constructor.randomFrom(-10, 0);
      } else {
        confettiNode.x = this._canvas.width + 5;
        confettiNode.y = this.constructor.randomFrom(0, this._canvas.height);
        confettiNode.tilt = this.constructor.randomFrom(-10, 0);
      }
    }
  }

  /**
   *
   * @param confetti
   */
  draw(confetti) {
    this._context.beginPath();
    this._context.lineWidth = confetti.r / 3;
    this._context.strokeStyle = confetti.color;
    this._context.moveTo(confetti.x + confetti.tilt + (confetti.r / 4), confetti.y);
    this._context.lineTo(confetti.x + confetti.tilt, confetti.y + confetti.tilt + (confetti.r / 6));
    this._context.stroke();
  }

  /**
   *
   */
  updateState() {
    this.angle += 0.01;
    this.tiltAngle += 0.1;
  }

}

export default window.Confetti = new Stage();
