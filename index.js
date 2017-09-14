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

// const field = new Field(ROWS_COUNT, COLS_COUNT);
// field.addFigure(figures[7], 0, 0);
// doStep(field);

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
      for (let col = 0; col <= COLS_COUNT - f.colsCount; col++) {
        const field = prevField.clone();
        if (field.addFigure(f, rowToFill, col)) {

          field.indexPath += `-${subIndexPathCounter++}`;

          if (field.filledCount > maxFilledCount) {
            maxFilledCount = field.filledCount;
            console.log('maxFilledCount', maxFilledCount);
          }

          if (rowToFill > maxRow) {
            maxRow = rowToFill;
            console.log('maxRow', maxRow);
          }

          // console.log('doStep', level, field.indexPath, rowToFill, `${field.filledCount}/${field.cellsCount}`);
          // console.log(prevField.toString());
          // console.log(field.toString());

          if (field.isFilled) {
            const fName = `./solves/solve-${field.figuresHash}.txt`;
            if (fs.existsSync(fName)) {
              // console.warn('DUPLICATE!!!!', field.indexPath);
            } else {
              console.log('FOUND!!!!', field.indexPath);
              console.log(field.toString());
              fs.writeFileSync(fName, field.toString());
            }
            return;
          } else {
            doStep(field, level + 1);
          }
        }
      }
      f.rotate();
    }
    f.resetRotation();
  }

  // console.log(`<-- Back to prev level from ${level} to ${level - 1} \r\n`);

}