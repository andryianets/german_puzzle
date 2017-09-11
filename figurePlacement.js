const _ = require('lodash');

class FigurePlacement {

  constructor(figure) {
    this.figure = figure;
    this.rotates = 0;
    this.position = {r: 0, c: 0};
  }

}

module.exports = FigurePlacement;