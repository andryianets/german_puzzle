const _ = require('lodash');
const fs = require('fs');

const figuresData = require('./figuresData');
const Field = require('./field');
const Figure = require('./figure');

const ROWS_COUNT = 7;
const COLS_COUNT = 7;

const figures = figuresData.map(lines => new Figure(lines));

// start here...
let indexPathCounter = 0;
figures.forEach(f => {
  _.times(f.maxRotates, rotates => {
    const field = new Field(ROWS_COUNT, COLS_COUNT);
    if (field.addFigure(f, 0, 0, rotates)) {
      field.indexPath = `${indexPathCounter++}`;
      doStep(field);
    }
    f.rotate();
  });
  f.resetRotation();
});

/**
 * Recursive step
 * @param placement
 */
function doStep(prevField, level = 0) {

  console.log('doStep', level, prevField.indexPath, prevField.filledCount);

  const freeFigures = figures.filter(f => !prevField.hasFigure(f.id));
  const rowToFill = prevField.nextRowToFill;

  if (rowToFill >= ROWS_COUNT) {
    throw new Error('Rows filled!');
  }

  let subIndexPathCounter = 0;
  freeFigures.forEach(f => {
    _.times(f.maxRotates, rotates => {
      if (rowToFill + f.rowsCount > ROWS_COUNT - 1) return;
      for (col = 0; col <= COLS_COUNT - f.colsCount; col++) {
        const field = prevField.clone();
        if (field.addFigure(f, rowToFill, col, rotates)) {
          field.indexPath += `-${subIndexPathCounter++}`;
          if (field.isFilled) {
            console.log('FOUND!!!!');
            fs.writeFileSync(`./solve-${field.indexPath}.json`, JSON.stringify(field.figureLocations));
          } else {
            setImmediate(() => {
              doStep(field, level + 1);
            });
          }
        }
      }
      f.rotate();
    });
    f.resetRotation();
  });

}