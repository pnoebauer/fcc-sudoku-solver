const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const solver = new Solver();

const puzzlesAndSolutions =
	require('../controllers/puzzle-strings.js').puzzlesAndSolutions;

const [puzzle, solution] = puzzlesAndSolutions[0];
console.log(puzzlesAndSolutions[0][0]);
// const solvedPuzzle = solver.solve(puzzle);
// console.log(solvedPuzzle === solution);

suite('UnitTests', () => {
	test('Logic handles a valid puzzle string of 81 characters', function () {
		assert.isUndefined(solver.validate(puzzle), 'a valid puzzle returns no error');
	});
	test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function () {
		assert.isObject(solver.validate('1a.3..4'), 'an error object will be returned');
		assert.deepEqual(solver.validate('1a.3..4'), {error: 'Invalid characters in puzzle'});
	});
	test('Logic handles a puzzle string that is not 81 characters in length', function () {
		assert.isObject(solver.validate('1..3..4'), 'an error object will be returned');
		assert.deepEqual(solver.validate('1..3..4'), {
			error: 'Expected puzzle to be 81 characters long',
		});
	});
	test('Logic handles a valid row placement', function () {
		assert.isTrue(
			solver.checkRowPlacement(puzzle, 1, 3, '5'),
			'the placement in that row with that value is valid'
		);
	});
	test('Logic handles a valid row placement', function () {
		assert.isFalse(
			solver.checkRowPlacement(puzzle, 1, 3, '1'),
			'the placement in that row with that value is invalid (1 already occurs)'
		);
	});
	test('Logic handles a valid column placement', function () {
		assert.isTrue(
			solver.checkColPlacement(puzzle, 1, 3, '3'),
			'the placement in that column with that value is valid'
		);
	});
	test('Logic handles an invalid column placement', function () {
		assert.isFalse(
			solver.checkColPlacement(puzzle, 1, 3, '1'),
			'the placement in that column with that value is invalid (1 already occurs)'
		);
	});
	test(' Logic handles a valid region (3x3 grid) placement', function () {
		assert.isTrue(
			solver.checkRegionPlacement(puzzle, 1, 3, '3'),
			'the placement in that column with that value is valid'
		);
	});
	test(' Logic handles an invalid region (3x3 grid) placement', function () {
		assert.isFalse(
			solver.checkRegionPlacement(puzzle, 1, 3, '1'),
			'the placement in that column with that value is invalid (1 already occurs)'
		);
	});
	test('Valid puzzle strings pass the solver', function () {
		assert.isString(
			solver.solve(puzzle),
			'a string with the solution string is returned'
		);
	});
	test('Invalid puzzle strings fail the solver', function () {
		assert.isFalse(
			solver.solve(
				'1.5..2.....6..12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
			),
			'if the puzzle cannot be solved false is returned'
		);
	});
	test('Solver returns the expected solution for an incomplete puzzle', function () {
		assert.equal(solver.solve(puzzle), solution);
	});
});
