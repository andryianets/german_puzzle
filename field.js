const _ = require('lodash');

module.exports = class Field {

  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.cellsCount = rows * cols;
    this.filledCount = 0;
    this.cells = _.times(this.rows, rowIndex => _.times(this.cols, colIndex => colIndex + rows * rowIndex));

    /**
     * Locations in form { figure, row, col, rotates }
     * @type {Array}
     */
    this.figureLocations = [];
    this.figureIds = {};
    this.busyCells = {};

    this.indexPath = '';
  }

  get nextRowToFill() {
    let nextRow = 0;
    for (let rowIndex in this.cells) {
      const rowItems = this.cells[rowIndex];
      const rowFilled = rowItems.reduce((acc, val) => acc && this.busyCells[val], true);
      if (rowFilled) {
        nextRow++;
      } else {
        return nextRow;
      }
    }
    return nextRow;
  }

  get isFilled() {
    return this.filledCount === this.cellsCount;
  }

  hasFigure(id) {
    return this.figureIds[id] !== undefined;
  }

  clear() {
    this.figureLocations = [];
    this.figureIds = {};
    this.busyCells = {};
    this.filledCount = 0;
  }

  clone() {
    const clonedField = new Field(this.rows, this.cols);
    clonedField.figureLocations = _.clone(this.figureLocations);
    clonedField.busyCells = _.clone(this.busyCells);
    clonedField.figureIds = _.clone(this.figureIds);
    clonedField.indexPath = this.indexPath;
    clonedField.filledCount = this.filledCount;
    return clonedField;
  }

  addFigure(f, row = 0, col = 0) {
    if (this.figureIds[f.id]) {
      // console.warn('figure is already added!');
      return false;
    }
    if ((row + f.rowsCount > this.rows) || (col + f.colsCount > this.cols)) {
      // console.warn('figure is out of limits!');
      return false;
    }

    const figureBusyCells = [];
    for (let rowIndex in f.lines) {
      const rowItems = f.lines[rowIndex];
      for (let colIndex in rowItems) {
        if (rowItems[colIndex]) {
          const cellValue = this.cells[1 * rowIndex + row][1 * colIndex + col];
          if (this.busyCells[cellValue]) {
            // console.warn('figure overlaps others!');
            return false;
          }
          figureBusyCells.push(cellValue);
        }
      }
    }

    for (let cellValue of figureBusyCells) {
      this.busyCells[cellValue] = `${f.id}_${f.rotates}`;
      this.filledCount++;
    }

    this.figureLocations.push({id: f.id, row, col, rotates: f.rotates});
    this.figureIds[f.id] = true;

    return true;
  }

}