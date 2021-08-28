class SudokuSolver {
	validate(puzzleString) {}

	getRowValues(puzzleString, row) {
		const startIndex = (row - 1) * 9;
		const endIndex = startIndex + 9;

		// const rowValues = puzzleString.slice(startIndex, endIndex);
		const rowValues = puzzleString.split('').slice(startIndex, endIndex);

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

	getRegionValues(puzzleString, row, column, value) {
		const rowRegion = Math.floor((row - 1) / 3);
		const colRegion = Math.floor((column - 1) / 3);
		// console.log({rowRegion, colRegion});

		const regionValues = [];

		for (let r = 0; r < 3; r++) {
			for (let c = 0; c < 3; c++) {
				// console.log({rowS: rowRegion * 3 + r + 1}, {cols: colRegion * 3 + c + 1});
				// console.log({rowIdx: rowRegion * 3 + r}, {colIdx: colRegion * 3 + c});
				// console.log(puzzleString[(rowRegion * 3 + r) * 9 + colRegion * 3 + c]);
				regionValues.push(puzzleString[(rowRegion * 3 + r) * 9 + colRegion * 3 + c]);
			}
		}

		return regionValues;
	}

	checkRowPlacement(puzzleString, row, column, value) {
		// console.log(row, column);

		const rowValues = this.getRowValues(puzzleString, row);
		// console.log({rowValues});

		// { "valid": false, "conflict": [ "row", "region" ] }
		const validRow = !rowValues.includes(value);

		console.log({validRow});
	}

	checkColPlacement(puzzleString, row, column, value) {
		const columnValues = this.getColumnValues(puzzleString, column);
		// console.log({columnValues});

		const validColumn = !columnValues.includes(value);

		console.log({validColumn});
	}

	checkRegionPlacement(puzzleString, row, column, value) {
		const regionValues = this.getRegionValues(puzzleString, row, column, value);
		// console.log({regionValues});

		const validRegion = !regionValues.includes(value);

		console.log({validRegion});
	}

	solve(puzzleString) {
		console.log('solve', puzzleString);
	}
}

module.exports = SudokuSolver;
