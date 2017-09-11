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
    const f = new Figure(0, [
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

  it('should correctly calc getMaxRotates', () => {
    const f = new Figure(0, [
      [1, 1, 1]
    ]);

    f.rotate();
    expect(f.lines).to.eql([
      [1],
      [1],
      [1]
    ]);
    expect(f.getMaxRotates()).to.eql(2);
    expect(f.rotates).to.eql(1);
  });

  it('should place figure on field correctly', () => {
    const f = new Figure(0, [
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

  it('#allowedForCorner', () => {

    const corners = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1]
    ];

    const tests = [
      {
        lines: [
          [1, 0],
          [1, 1],
          [1, 1],
          [1, 0],
        ],
        expects: [
          true,
          true,
          false,
          false
        ]
      },
      {
        lines: [
          [1, 1],
          [0, 1],
          [1, 1],
          [1, 0],
        ],
        expects: [
          false,
          false,
          true,
          false
        ]
      }
    ];

    tests.forEach((test, figureIndex) => {
      const f = new Figure(figureIndex, test.lines);
      corners.forEach((corner, i) => {
        expect(f.allowedForCorner(...corner)).to.eql(test.expects[i]);
      });
    });
  });

});

