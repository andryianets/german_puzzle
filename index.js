const _ = require('lodash');

const figuresData = require('./figuresData');
const Field = require('./field');
const Figure = require('./figure');

const ROWS_COUNT = 7;
const COLS_COUNT = 7;

const field = new Field(ROWS_COUNT, COLS_COUNT);
const figures = figuresData.map(lines => new Figure(lines));

// start here...

// 1. find figures pos in corners

const cornerFigures = [];

const corners = [
  [0, 0],
  [1, 0],
  [0, 1],
  [1, 1]
];

figures.forEach((f, figureIndex) => {
  _.times(f.getMaxRotates(), rotation => {
    corners.forEach(corner => {
      if (f.allowedForCorner(...corner)) {
        cornerFigures.push({
          figureIndex,
          corner,
          rotation
        });
      }
    });
    f.rotate();
  });
});

console.log('cornerFigures:\r\n', cornerFigures, cornerFigures.length);

// 2.