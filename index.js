const _ = require('lodash');
const fs = require('fs');

const figuresData = require('./figuresData');
const Field = require('./field');
const Figure = require('./figure');

const ROWS_COUNT = 7;
const COLS_COUNT = 7;

const field = new Field(ROWS_COUNT, COLS_COUNT);
const figures = figuresData.map((lines, index) => new Figure(index, lines));

// start here...

// 1. find figures pos in corners

const cornerFigures = [];

const corners = [
  [0, 0],
  [1, 0],
  [0, 1],
  [1, 1]
];

figures.forEach(f => {
  _.times(f.getMaxRotates(), rotates => {
    corners.forEach(corner => {
      if (f.allowedForCorner(...corner)) {
        cornerFigures.push({
          f,
          figureId: f.id,
          corner,
          pos: {
            r: corner[0] ? ROWS_COUNT - f.getRowsCount() : 0,
            c: corner[1] ? COLS_COUNT - f.getColsCount() : 0
          },
          rotates
        });
      }
    });
    f.rotate();
  });
});

const cornerFiguresGrouped = _.groupBy(cornerFigures, 'corner');

// console.log('cornerFigures length', cornerFigures.length);
// console.log('cornerFigures:\r\n', cornerFigures);
// console.log('cornerFiguresGrouped:\r\n', cornerFiguresGrouped);

// 2. placing

const placements = [];

_.forEach(cornerFiguresGrouped['0,0'], nwFigureData => {
  field.clear();

  if (!field.addFigure(nwFigureData.f.rotateMultiple(nwFigureData.rotates), 0, 0)) {
    throw new Error('Unable set first!');
  }

  _.forEach(cornerFiguresGrouped['0,1'], neFigureData => {

    if (_.uniq([neFigureData.f.id, nwFigureData.f.id]).length < 2) return;

    if (!field.addFigure(neFigureData.f.rotateMultiple(neFigureData.rotates), 0, COLS_COUNT - neFigureData.f.getColsCount())) {
      return;
    }

    _.forEach(cornerFiguresGrouped['1,0'], swFigureData => {

      if (_.uniq([swFigureData.f.id, neFigureData.f.id, nwFigureData.f.id]).length < 3) return;

      if (!field.addFigure(swFigureData.f.rotateMultiple(swFigureData.rotates), ROWS_COUNT - swFigureData.f.getRowsCount(), 0)) {
        return;
      }

      _.forEach(cornerFiguresGrouped['1,1'], seFigureData => {

        if (_.uniq([seFigureData.f.id, swFigureData.f.id, neFigureData.f.id, nwFigureData.f.id]).length < 4) return;

        if (field.addFigure(seFigureData.f.rotateMultiple(seFigureData.rotates), ROWS_COUNT - seFigureData.f.getRowsCount(), COLS_COUNT - seFigureData.f.getColsCount())) {
          placements.push({
            positions: [nwFigureData, neFigureData, swFigureData, seFigureData],
            field: Field.clone(field),
            next: [],
            level: 4,
            indexPath: placements.length
          });
          // console.log('\r\n', field.lines, '\r\n');
        }

      });

    });

  });

});

// console.log('placements of cornered length', placements.length);
// console.log('placements of cornered', placements);

const successPlacements = [];
let maxFilled = 0;
let maxFigures = 4;
buildPlacements(placements);
fs.writeFileSync('./solve.json', JSON.stringify(successPlacements));

/**
 * Placements search recursive function
 * @param placements
 * @param level
 */

function buildPlacements(placements) {
  placements.forEach(placement => {
    const existingIds = _.map(placement.positions, 'figureId');
    const remainedFigures = figures.filter(f => !existingIds.includes(f.id));
    let subPlacementCounter = 0;
    remainedFigures.forEach(f => {
      f.resetRotation();
      _.times(f.getMaxRotates(), rotates => {

        for (let r = 0; r <= ROWS_COUNT - f.getRowsCount(); r++) {
          for (let c = 0; c <= COLS_COUNT - f.getColsCount(); c++) {

            const subField = Field.clone(placement.field);
            if (subField.addFigure(f, r, c)) {
              const fData = {
                f,
                figureId: f.id,
                pos: {r, c},
                rotates
              };
              const subPlacement = {
                positions: placement.positions.concat([fData]),
                field: subField,
                next: [],
                level: placement.level + 1,
                indexPath: `${placement.indexPath}-${subPlacementCounter++}`
              };
              placement.next.push(subPlacement);

              // console.log(`Step info: level ${placement.level}, figure ${f.id} at [${r}, ${c}, rot=${rotates}]`);
              // console.log(`Fill check: figures ${placement.positions.length}, progress ${subField.filledCount() + '/' + subField.cellsCount}`);

              if (subField.filledCount() > maxFilled) {
                maxFilled = subField.filledCount();
                console.log(`---- New filling max: figures ${placement.positions.length}, progress ${subField.filledCount() + '/' + subField.cellsCount}`);
              }

              if (placement.positions.length > maxFigures) {
                maxFigures = placement.positions.length;
                console.log(`---- New max figures: figures ${placement.positions.length}, progress ${subField.filledCount() + '/' + subField.cellsCount}`);
              }

              if (subField.isFullyFilled()) {
                console.log('------ FIELD IS FILLED ----');
                successPlacements.push(subPlacement);
              }
            }
          }
        }

        f.rotate();
      });
    });
    if (placement.next.length > 0) {
      if (placement.level === maxFigures) {
        console.log(`Info: level ${placement.level}, index ${placement.indexPath}, children to check ${placement.next.length}`);
      }
      buildPlacements(placement.next);
    } else {
      // console.warn(`- Placement end at level ${placement.level}`);
    }
  });
}