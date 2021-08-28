'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
	const solver = new SudokuSolver();

	app.route('/api/check').post((req, res) => {
		// console.log(req.body);
		const {puzzle, coordinate, value} = req.body;

		const [rowLetter, column] = coordinate;
		const row = rowLetter.charCodeAt(0) - 'A'.charCodeAt(0) + 1;

		solver.checkRowPlacement(puzzle, Number(row), Number(column), value);
		solver.checkColPlacement(puzzle, Number(row), Number(column), value);
		solver.checkRegionPlacement(puzzle, Number(row), Number(column), value);
	});

	app.route('/api/solve').post((req, res) => {
		// console.log(req.body);
		const {puzzle} = req.body;
		solver.solve(puzzle);
	});
};
