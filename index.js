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
const hashes = {};

_.forEach(cornerFiguresGrouped['0,0'], nwFigureData => {
  field.clear();

  if (!field.addFigure(nwFigureData.f.rotateMultiple(nwFigureData.rotates), 0, 0)) {
    throw new Error('Unable set first!');
  }

  const nwField = Field.clone(field);

  _.forEach(cornerFiguresGrouped['0,1'], neFigureData => {

    field.fillFromField(nwField);

    if (_.uniq([neFigureData.figureId, nwFigureData.figureId]).length < 2) return;

    if (!field.addFigure(neFigureData.f.rotateMultiple(neFigureData.rotates), 0, COLS_COUNT - neFigureData.f.getColsCount())) {
      return;
    }

    const neField = Field.clone(field);

    _.forEach(cornerFiguresGrouped['1,0'], swFigureData => {

      field.fillFromField(neField);

      if (_.uniq([swFigureData.figureId, neFigureData.figureId, nwFigureData.figureId]).length < 3) return;

      if (!field.addFigure(swFigureData.f.rotateMultiple(swFigureData.rotates), ROWS_COUNT - swFigureData.f.getRowsCount(), 0)) {
        return;
      }

      const swField = Field.clone(field);

      _.forEach(cornerFiguresGrouped['1,1'], seFigureData => {

        field.fillFromField(swField);

        if (_.uniq([seFigureData.figureId, swFigureData.figureId, neFigureData.figureId, nwFigureData.figureId]).length < 4) return;

        if (field.addFigure(seFigureData.f.rotateMultiple(seFigureData.rotates), ROWS_COUNT - seFigureData.f.getRowsCount(), COLS_COUNT - seFigureData.f.getColsCount())) {
          const positions = [nwFigureData, neFigureData, seFigureData, swFigureData];
          const figuresHashData = positions.map(fPos => `${fPos.figureId}_${fPos.rotates}`);

          if (
            hashes[[figuresHashData[1], figuresHashData[2], figuresHashData[3], figuresHashData[0]].join(':')] ||
            hashes[[figuresHashData[2], figuresHashData[3], figuresHashData[0], figuresHashData[1]].join(':')] ||
            hashes[[figuresHashData[3], figuresHashData[0], figuresHashData[1], figuresHashData[2]].join(':')]
          ) {
            return;
          }

          placements.push({
            positions,
            field: Field.clone(field),
            next: [],
            level: 4,
            indexPath: placements.length,
            figuresHash: figuresHashData.join(':')
          });
          hashes[figuresHashData.join(':')] = 1;
          // console.log('\r\n', field.lines, '\r\n');
        }

      });

    });

  });

});

console.log('placements of cornered length', placements.length);
// console.log('placements of cornered', placements);


const successPlacements = [];
let maxFilled = 0;
let maxFigures = 4;
buildPlacements(_.shuffle(placements));

// fs.writeFileSync('./solve.json', JSON.stringify(successPlacements));

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
                fs.writeFileSync(`./solve-${subPlacement.indexPath}.json`, JSON.stringify(subPlacement.positions));
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
      setImmediate(() => {
        buildPlacements(_.shuffle(placement.next));
      });
    } else {
      // console.warn(`- Placement end at level ${placement.level}`);
    }
  });
}