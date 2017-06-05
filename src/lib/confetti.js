import _isArray from 'lodash/isArray';
import _shuffle from 'lodash/shuffle';
import _head from 'lodash/head';

class Confetti {

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

  /**
   *
   * @param config
   */
  constructor(config) {
    const _this = this;
    Object.keys(config).forEach((prop) => {
      _this[prop] = config[prop];
    });

    this.d = this.constructor.randomFrom(10, _this.numberOfParticles + 10);

    if (!config.color) {
      this.color = this.setColor();
    } else {
      this.color = this.setColor(config.color);
    }

    this.isFlakeExiting = this.isFlakeExiting.bind(this);
  }

  /**
   * Check if the flake is outside of the canvas.
   *
   * @returns {boolean}
   */
  isFlakeExiting() {
    return (this.x > this.canvas.width + 5 || this.x < -5 || this.y > this.canvas.height);
  }

  /**
   * Generate a random color.
   *
   * @returns {string}
   */
  setColor(color) {
    // If the color prop exists.
    if (typeof color !== 'undefined' && color !== null) {
      if (_isArray(color)) {
        // Return a random color from the array.
        return _head(_shuffle(color));
      } else {
        return color;
      }
    }

    return `rgba(${this.constructor.randomFrom(0, 256)}, ${this.constructor.randomFrom(0, 256)}, ${this.constructor.randomFrom(0, 256)}, ${Math.random()})`;
  }

}

export default Confetti;
