const figuresData = require('./figuresData');
const Field = require('./field');
const Figure = require('./figure');

const ROWS_COUNT = 7;
const COLS_COUNT = 7;

const field = new Field(ROWS_COUNT, COLS_COUNT);
const figures = figuresData.map(lines => new Figure(lines));

const f = figures[5];
console.log('BEFORE', f.lines);
f.rotate(); console.log('ROTATE 1', f.lines, f.rotates);
f.rotate(); console.log('ROTATE 2', f.lines, f.rotates);
f.rotate(); console.log('ROTATE 3', f.lines, f.rotates);
f.rotate(); console.log('ROTATE 4', f.lines, f.rotates);
