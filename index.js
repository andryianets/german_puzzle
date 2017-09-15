const fs = require('fs');

const figuresData = require('./figuresData');
const Field = require('./field');
const Figure = require('./figure');

const ROWS_COUNT = 7;
const COLS_COUNT = 7;

const figures = figuresData.map(lines => new Figure(lines));

// start here...
let indexPathCounter = 0;
const stepsHashes = new Set();

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
      for (let col = 0; col <= COLS_COUNT - f.colsCount; col++) {
        const field = prevField.clone();
        if (field.addFigure(f, rowToFill, col) && !stepsHashes.has(field.figuresHash)) {
          stepsHashes.add(field.figuresHash);
          field.indexPath += `-${subIndexPathCounter++}`;

          // console.log('doStep', level, field.indexPath, rowToFill, `${field.filledCount}/${field.cellsCount}`);
          // console.log(prevField.toString());
          // console.log(field.toString());

          if (field.isFilled) {
            console.log('FOUND!!!!', field.indexPath);
            console.log(field.toString());
            const fName = `./solves/solve-${field.indexPath}.txt`;
            fs.writeFileSync(fName, field.toString());

            f.resetRotation();
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