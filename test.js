const expect = require('chai').expect;

const figuresData = require('./figuresData');
const Field = require('./field');
const Figure = require('./figure');

const ROWS_COUNT = 5;
const COLS_COUNT = 5;

/*
  0   1   2   3   4
  5   6   7   8   9
  10  11  12  13  14
  15  16  17  18  19
  20  21  22  23  24
 */
const field = new Field(ROWS_COUNT, COLS_COUNT);

describe('Puzzle tests', () => {

  beforeEach(() => {
    field.clear();
  });

  it('should init field', () => {
    expect(field.cells[0]).to.eql([0, 1, 2, 3, 4]);
    expect(field.cells[2]).to.eql([10, 11, 12, 13, 14]);
  });

  it('should add figure successfully', () => {
    const f = new Figure([
      [1, 1],
      [1, 0],
    ]);
    const f2 = new Figure([
      [1, 0],
      [1, 1],
      [1, 0],
      [1, 0],
    ]);
    expect(field.addFigure(f, 3, 2, 1)).to.be.true;
    expect(field.addFigure(f2, 0, 1, 0)).to.be.true;
    expect(field.hasFigure(f.id)).to.be.true;
    expect(field.hasFigure(f2.id)).to.be.true;
    expect(Object.keys(field.busyCells)).to.have.members([
      '23', '17', '18',
      '1', '6', '11', '16', '7'
    ]);
  });

  it('should fail to add figure if out of limits', () => {
    const f = new Figure([
      [1, 0],
      [1, 1],
      [1, 0],
      [1, 0],
    ]);
    expect(field.addFigure(f, 4, 1, 0)).to.be.false;
  });

  it('should fail to add figure if overlaps', () => {
    const f = new Figure([
      [1, 1],
      [1, 0],
    ]);
    const f2 = new Figure([
      [1, 0],
      [1, 1],
      [1, 0],
      [1, 0],
    ]);
    expect(field.addFigure(f, 1, 0, 0)).to.be.true;
    expect(field.addFigure(f2, 0, 1, 0)).to.be.false;
  });

});

