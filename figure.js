const _ = require('lodash');

let counter = 0;

module.exports = class Figure {

  constructor(lines) {
    this.id = counter++;
    this.lines = lines;
    this.linesInitial = lines;
    this.rotates = 0;
    this.filledCount = _.flatten(this.lines).reduce((acc, val) => acc + val, 0);
  }

  get rowsCount() {
    return this.lines.length;
  }

  get colsCount() {
    return this.lines[0].length;
  }

  get maxRotates() {
    if (this.rowsCount === 1 && this.colsCount === 1) return 0;
    if (this.rowsCount === 1 || this.colsCount === 1) return 1;

    return 3;
  }

  resetRotation() {
    this.lines = this.linesInitial;
    this.rotates = 0;
  }

  rotate() {
    this.rotates = (this.rotates + 1) % (this.maxRotates + 1);

    const rows = this.rowsCount;
    const cols = this.colsCount;

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

  toString() {
    return this.lines.map(row => row.join(' ')).join('\r\n');
  }

}