const _ = require('lodash');

class Figure {

  constructor(lines) {
    this.lines = lines;
    this.rotates = 0;
  }

  rotate() {
    this.rotates = (this.rotates + 1) % 4;

    const rows = this.lines.length;
    const cols = this.lines[0].length;

    const newLines = _.times(cols, () => _.times(rows, _.constant(0)));

    for (let c = 0; c < cols; c++) {
      for (let r = rows - 1; r >= 0; r--) {
        const newRow = c;
        const newCol = rows - 1 - r;
        newLines[newRow][newCol] = this.lines[r][c];
      }
    }

    this.lines = newLines;

    return this;
  }

}

module.exports = Figure;