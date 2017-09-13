const _ = require('lodash');

module.exports = class Field {

  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.cellsCount = rows * cols;
    this.cellsTotalSum = this.cellsCount * (this.cellsCount - 1) / 2;
    this.cells = _.times(this.rows, rowIndex => _.times(this.cols, colIndex => colIndex + rows * rowIndex));

    /**
     * Locations in form { figure, row, col, rotates }
     * @type {Array}
     */
    this.figureLocations = [];
    this.figureIds = {};
    this.busyCells = {};
  }

  isRowBusy(rowIndex) {
    return false;
  }

  isColBusy(colIndex) {
    return false;
  }

  clear() {
    this.figureLocations = [];
    this.figureIds = {};
    this.busyCells = {};
  }

  clone() {
    const clonedField = new Field(this.rows, this.cols);
    this.figureLocations = _.clone(this.figureLocations);
    this.busyCells = _.clone(this.figureLocations);
    this.figureIds = _.clone(this.figureIds);
    return clonedField;
  }

  addFigure(f, row = 0, col = 0, rotates = 0) {
    f.rotateMultiple(rotates);

    if (this.figureIds[f.id]) return false;
    if ((row + f.rowsCount > this.rows - 1) || (col + f.colsCount > this.cols - 1)) return false;

    const figureBusyCells = [];
    f.lines.forEach((rowItems, rowIndex) => {
      rowItems.forEach((flag, colIndex) => {
        if (flag) {
          const cellValue = this.cells[rowIndex + row][colIndex + col];
          if (this.busyCells[cellValue]) return false;
          figureBusyCells.push(cellValue);
        }
      });
    });

    figureBusyCells.forEach(cellValue => {
      this.busyCells[cellValue] = true;
    });

    this.figureLocations.push({ f, row, col, rotates });
    this.figureIds[f.id] = true;

    return true;
  }

}