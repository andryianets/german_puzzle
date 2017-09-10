const _ = require('lodash');

class Field {

  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.cellsCount = rows * cols;
    this.clear();
  }

  clear() {
    this.lines = _.times(this.rows, () => _.times(this.cols, _.constant(0)));
  }

  filledCount() {
    return _.flatten(this.lines).reduce((acc, val) => acc + val, 0);
  }

  isFullyFilled() {
    return this.filledCount() === this.cellsCount;
  }

  addFugure(f, row = 0, col = 0) {
    const newLines = _.cloneDeep(this.lines);
    for (let r = row; r < row + f.lines.length; r++) {
      if (r >= this.rows) return false;
      for (let c = col; c < col + f.lines[0].length; c++) {
        if (c >= this.cols) return false;
        if (newLines[r][c]) return false;
        newLines[r][c] = f.lines[r - row][c - col];
      }
    }
    this.lines = newLines;
    return true;
  }
}

module.exports = Field;