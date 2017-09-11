const _ = require('lodash');

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
          cornerDesc: [...corner].join('-'),
          rotates
        });
      }
    });
    f.rotate();
  });
});

const cornerFiguresGrouped = _.groupBy(cornerFigures, 'cornerDesc');

// console.log('cornerFigures length', cornerFigures.length);
// console.log('cornerFigures:\r\n', cornerFigures);
// console.log('cornerFiguresGrouped:\r\n', cornerFiguresGrouped);

// 2. placing

const placements = [];

_.forEach(cornerFiguresGrouped['0-0'], nwFigureData => {
  field.clear();

  if (!field.addFigure(nwFigureData.f.rotateMultiple(nwFigureData.rotates), 0, 0)) {
    throw new Error('Unable set first!');
  }

  _.forEach(cornerFiguresGrouped['0-1'], neFigureData => {

    if (_.uniq([neFigureData.f.id, nwFigureData.f.id]).length < 2) return;

    if (!field.addFigure(neFigureData.f.rotateMultiple(neFigureData.rotates), 0, COLS_COUNT - neFigureData.f.getColsCount())) {
      return;
    }

    _.forEach(cornerFiguresGrouped['1-0'], swFigureData => {

      if (_.uniq([swFigureData.f.id, neFigureData.f.id, nwFigureData.f.id]).length < 3) return;

      if (!field.addFigure(swFigureData.f.rotateMultiple(swFigureData.rotates), ROWS_COUNT - swFigureData.f.getRowsCount(), 0)) {
        return;
      }

      _.forEach(cornerFiguresGrouped['1-1'], seFigureData => {

        if (_.uniq([seFigureData.f.id, swFigureData.f.id, neFigureData.f.id, nwFigureData.f.id]).length < 4) return;

        if (field.addFigure(seFigureData.f.rotateMultiple(seFigureData.rotates), ROWS_COUNT - seFigureData.f.getRowsCount(), COLS_COUNT - seFigureData.f.getColsCount())) {
          placements.push({
            positions: [nwFigureData, neFigureData, swFigureData, seFigureData],
            next: []
          });
        }

      });

    });

  });

});

console.log('placements of cornered length', placements.length);
console.log('placements of cornered', placements);