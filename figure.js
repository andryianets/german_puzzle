const _ = require('lodash');

class Figure {

  constructor(id, lines) {
    this.id = id;
    this.lines = lines;
    this.linesInitial = lines;
    this.rotates = 0;
  }

  filledCount() {
    return _.flatten(this.lines).reduce((acc, val) => acc + val, 0);
  }

  getRowsCount() {
    return this.lines.length;
  }

  getColsCount() {
    return this.lines[0].length;
  }

  getMaxRotates() {
    const rows = this.lines.length;
    const cols = this.getColsCount();

    if (rows === 1 && cols === 1) return 1;
    if (rows === 1 || cols === 1) return 2;

    return 4;
  }

  resetRotation() {
    this.lines = this.linesInitial;
    this.rotates = 0;
  }

  rotateMultiple(times) {
    this.resetRotation();
    _.times(times, () => {
      this.rotate();
    })
    return this;
  }

  rotate() {
    this.rotates = (this.rotates + 1) % this.getMaxRotates();

    const rows = this.lines.length;
    const cols = this.getColsCount();

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

  allowedForCorner(r, c) {
    const startPoint = {r: r ? this.lines.length - 1 : 0, c: c ? this.getColsCount() - 1 : 0};
    const direction = {r: r ? -1 : 1, c: c ? -1 : 1};

    // test rows
    let counter = 0;
    let test = [1];
    let p = _.clone(startPoint);
    do {
      test.push(this.lines[p.r][p.c]);
      p.r += direction.r;
    } while (++counter < this.lines.length);

    if (/10+1/.test(test.join(''))) return false;

    // test cols
    counter = 0;
    test = [1];
    p = _.clone(startPoint);
    do {
      test.push(this.lines[p.r][p.c]);
      p.c += direction.c;
    } while (++counter < this.getColsCount());

    if (/10+1/.test(test.join(''))) return false;

    return true;
  }

}

module.exports = Figure;