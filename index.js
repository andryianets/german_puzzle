const fs = require('fs');

const figuresData = require('./figuresData');
const Field = require('./field');
const Figure = require('./figure');

const ROWS_COUNT = 7;
const COLS_COUNT = 7;

const figures = figuresData.map(lines => new Figure(lines));

// start here...
let indexPathCounter = 0;
let maxFilledCount = 0;
let maxRow = 0;

for (let f of figures) {
  for (let rotates = 0; rotates <= f.maxRotates; rotates++) {
    const field = new Field(ROWS_COUNT, COLS_COUNT);
    if (f.allowedForCorner(0, 0) && field.addFigure(f, 0, 0)) {
      field.indexPath = `${indexPathCounter++}`;
      doStep(field);
    }
    f.rotate();
  }
  f.resetRotation();
}

/**
 * Recursive step
 * @param placement
 */
function doStep(prevField, level = 1) {

  const freeFigures = figures.filter(f => !prevField.hasFigure(f.id));
  const rowToFill = prevField.nextRowToFill;

  if (rowToFill >= ROWS_COUNT) {
    throw new Error('Rows filled!');
  }

  let subIndexPathCounter = 0;
  for (let f of freeFigures) {
    for (let rotates = 0; rotates <= f.maxRotates; rotates++) {
      if (rowToFill + f.rowsCount > ROWS_COUNT - 1) return;
      for (col = 0; col <= COLS_COUNT - f.colsCount; col++) {
        const field = prevField.clone();
        if (field.addFigure(f, rowToFill, col)) {

          if (field.filledCount > maxFilledCount) {
            maxFilledCount = field.filledCount;
            console.log('maxFilledCount', maxFilledCount);
          }

          if (rowToFill > maxRow) {
            maxRow = rowToFill;
            console.log('maxRow', maxRow);
          }

          // console.log('doStep', level, field.indexPath, rowToFill, `${field.filledCount}/${field.cellsCount}`);
          // console.log(prevField.figureLocations);
          // console.log(field.figureLocations);

          field.indexPath += `-${subIndexPathCounter++}`;
          if (field.isFilled) {
            console.log('FOUND!!!!', field.indexPath, field.figureLocations);
            fs.writeFileSync(`./solve-${field.indexPath}.json`, JSON.stringify(field.figureLocations));
          } else {
            doStep(field, level + 1);
          }
        }
      }
      f.rotate();
    }
    f.resetRotation();
  }

}