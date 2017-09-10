const figuresData = require('./figuresData');
const Field = require('./field');
const Figure = require('./figure');

const ROWS_COUNT = 7;
const COLS_COUNT = 7;

const field = new Field(ROWS_COUNT, COLS_COUNT);
const figures = figuresData.map(lines => new Figure(lines));

field.addFugure(figures[8].rotate(), 0, 0) || console.warn('Unable to add figure');
console.log(field.lines);