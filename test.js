const expect = require('chai').expect;

const figuresData = require('./figuresData');
const Field = require('./field');
const Figure = require('./figure');

const ROWS_COUNT = 5;
const COLS_COUNT = 5;

const field = new Field(ROWS_COUNT, COLS_COUNT);

describe('Puzzle tests', () => {

  beforeEach(() => {
    field.clear();
  });

  it('should rotate figure', () => {
    const f = new Figure([
      [1, 0],
      [1, 1],
      [1, 0],
      [1, 0],
    ]);

    f.rotate();
    expect(f.lines).to.eql([
      [1, 1, 1, 1],
      [0, 0, 1, 0]
    ]);
    expect(f.rotates).to.eql(1);

    f.rotate();
    expect(f.lines).to.eql([
      [0, 1],
      [0, 1],
      [1, 1],
      [0, 1]
    ]);
    expect(f.rotates).to.eql(2);
  });

  it('should place figure on field correctly', () => {
    const f = new Figure([
      [1, 0],
      [1, 1],
      [1, 0],
      [1, 0],
    ]);
    expect(field.addFigure(f, 1, 3)).to.be.true;
    expect(field.lines).to.eql([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0]
    ]);
  });

});

