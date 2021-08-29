class SudokuSolver {
	validate(puzzleString) {
		if (!!puzzleString.match(/[^0-9.]/)) {
			console.log('invalid symbol');
		}

		return !puzzleString.match(/[^0-9.]/);
	}

	getRowValues(puzzleString, row) {
		const startIndex = (row - 1) * 9;
		const endIndex = startIndex + 9;

		let puzzleArr;
		if (typeof puzzleString === 'string') {
			puzzleArr = puzzleString.split('');
		} else {
			puzzleArr = puzzleString;
		}

		// const rowValues = puzzleString.slice(startIndex, endIndex);
		// const rowValues = puzzleString.split('').slice(startIndex, endIndex);

		const rowValues = puzzleArr.slice(startIndex, endIndex);

		return rowValues;
	}

	getColumnValues(puzzleString, column) {
		const columnValues = [];
		for (let i = 0; i < puzzleString.length; i++) {
			if (i % 9 === column - 1) {
				columnValues.push(puzzleString[i]);
			}
		}
		return columnValues;
	}

	getRegionValues(puzzleString, row, column) {
		const rowRegion = Math.floor((row - 1) / 3);
		const colRegion = Math.floor((column - 1) / 3);
		// console.log({rowRegion, colRegion});

		const regionValues = [];

		for (let r = 0; r < 3; r++) {
			for (let c = 0; c < 3; c++) {
				// console.log(
				// 	{rowNumber: rowRegion * 3 + r + 1},
				// 	{colNumber: colRegion * 3 + c + 1}
				// );
				// console.log({rowIdx: rowRegion * 3 + r}, {colIdx: colRegion * 3 + c});
				// console.log(puzzleString[(rowRegion * 3 + r) * 9 + colRegion * 3 + c]);

				// remove the element of the current coordinate as it won't be checked against
				if (rowRegion * 3 + r + 1 === row && colRegion * 3 + c + 1 === column) {
					// console.log(puzzleString[(rowRegion * 3 + r) * 9 + colRegion * 3 + c]);
					regionValues.push('.');
				} else {
					regionValues.push(puzzleString[(rowRegion * 3 + r) * 9 + colRegion * 3 + c]);
				}
			}
		}

		return regionValues;
	}

	checkRowPlacement(puzzleString, row, column, value) {
		// console.log(row, column);

		const rowValues = this.getRowValues(puzzleString, row);
		// console.log({rowValues});

		// remove the element of the current coordinate as it won't be checked against -->
		/* 			
					If value submitted to /api/check is already placed in puzzle on that coordinate, 
					the returned value will be an object containing a valid property with true if value is not conflicting.
		*/
		// rowValues.splice(column - 1, 1);
		rowValues[column - 1] = '.';
		// console.log({rowValues});

		const validRow = !rowValues.includes(value);
		// console.log({validRow});

		return validRow;
	}

	checkColPlacement(puzzleString, row, column, value) {
		const columnValues = this.getColumnValues(puzzleString, column);
		// console.log({columnValues});

		// remove the element of the current coordinate as it won't be checked against
		// columnValues.splice(row - 1, 1);
		columnValues[row - 1] = '.';
		// console.log({columnValues});

		const validColumn = !columnValues.includes(value);
		// console.log({validColumn});

		return validColumn;
	}

	checkRegionPlacement(puzzleString, row, column, value) {
		const regionValues = this.getRegionValues(puzzleString, row, column);
		// console.log({regionValues});

		const validRegion = !regionValues.includes(value);
		// console.log({validRegion});

		return validRegion;
	}

	countOccurrences(arr, matchValue) {
		return arr.reduce((acc, value) => (value === matchValue ? acc + 1 : acc), 0);
	}

	solve(puzzleString) {
		console.log('solve:', puzzleString);

		let solvedPuzzle = puzzleString.split('');

		console.log(`initial: ${this.countOccurrences(solvedPuzzle, '.')} empty fields`);

		for (let run = 0; run < 14; run++) {
			let i = 0;
			for (let row = 1; row <= 9; row++) {
				// let rowValues = [];
				for (let column = 1; column <= 9; column++) {
					const cellValue = solvedPuzzle[i];
					i++;
					// console.log({cellValue}, i - 1);
					// console.log(rowValues);

					// cell already has a value
					if (cellValue !== '.') {
						continue;
					}
					// // rowValues have already been determined for an empty cell of this row
					// if (!rowValues.length) {
					// rowValues = this.getRowValues(solvedPuzzle, row);
					// }
					const rowValues = this.getRowValues(solvedPuzzle, row);
					const columnValues = this.getColumnValues(solvedPuzzle, column);
					const regionValues = this.getRegionValues(solvedPuzzle, row, column);

					const possibleCellValues = [];

					for (let cellValue = 1; cellValue <= 9; cellValue++) {
						if (
							!rowValues.includes(String(cellValue)) &&
							!columnValues.includes(String(cellValue)) &&
							!regionValues.includes(String(cellValue))
						) {
							possibleCellValues.push(String(cellValue));
						}
					}

					// console.log({rowValues, columnValues, regionValues, possibleCellValues}, i - 1);

					// only one solution possible
					if (possibleCellValues.length === 1) {
						// console.log({cV: solvedPuzzle[i - 1], idx: i - 1}, 'solution before');
						solvedPuzzle[i - 1] = possibleCellValues[0];
						// console.log({cV: solvedPuzzle[i - 1], idx: i - 1}, 'solution after');
					}
				}
			}
			console.log(
				`${this.countOccurrences(solvedPuzzle, '.')} empty fields after ${run + 1} runs`
			);
			if (!this.countOccurrences(solvedPuzzle, '.')) {
				console.log(`final solution after ${run + 1} runs: ${solvedPuzzle}`);
				// break;

				return solvedPuzzle.join('');
			}
		}

		return false;
	}
}

module.exports = SudokuSolver;
