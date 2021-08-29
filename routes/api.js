'use strict';

const {json} = require('body-parser');
const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
	const solver = new SudokuSolver();

	app.route('/api/check').post((req, res) => {
		// console.log(req.body);
		const {puzzle, coordinate, value} = req.body;

		if (!puzzle || !coordinate || !value) {
			return res.json({error: 'Required field(s) missing'});
		}

		// only allow digits from 1 to 9
		if (!/^[1-9]$/.test(value)) {
			// console.log('invalid symbol');
			return res.json({error: 'Invalid value'});
		}

		// if (puzzle.length !== 81) {
		// 	return res.json({error: 'Expected puzzle to be 81 characters long'});
		// }

		// if (!solver.validate(puzzle)) {
		// 	return res.json({error: 'Invalid characters in puzzle'});
		// }
		if (solver.validate(puzzle)) {
			return res.json(solver.validate(puzzle));
		}

		const [rowLetter, column] = coordinate;
		const row = rowLetter.charCodeAt(0) - 'A'.charCodeAt(0) + 1;

		if (coordinate.length > 2 || row < 1 || row > 9 || column < 1 || column > 9) {
			return res.json({error: 'Invalid coordinate'});
		}

		const conflict = [];

		if (!solver.checkRowPlacement(puzzle, Number(row), Number(column), value)) {
			conflict.push('row');
		}
		if (!solver.checkColPlacement(puzzle, Number(row), Number(column), value)) {
			conflict.push('column');
		}
		if (!solver.checkRegionPlacement(puzzle, Number(row), Number(column), value)) {
			conflict.push('region');
		}

		// console.log({conflict});

		if (!conflict.length) {
			// console.log({valid: true});
			return res.json({valid: true});
		}
		// console.log({valid: false, conflict});
		return res.json({valid: false, conflict});
	});

	app.route('/api/solve').post((req, res) => {
		// console.log(req.body);
		const {puzzle} = req.body;

		// if (!puzzle) {
		// 	return res.json({error: 'Required field missing'});
		// }

		// if (!solver.validate(puzzle)) {
		// 	return res.json({error: 'Invalid characters in puzzle'});
		// }
		// if (puzzle.length !== 81) {
		// 	return res.json({error: 'Expected puzzle to be 81 characters long'});
		// }

		if (solver.validate(puzzle)) {
			return res.json(solver.validate(puzzle));
		}

		const solvedPuzzle = solver.solve(puzzle);
		if (!solvedPuzzle) {
			return res.json({error: 'Puzzle cannot be solved'});
		}
		return res.json({solution: solvedPuzzle});
	});
};
