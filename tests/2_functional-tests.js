const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const puzzlesAndSolutions =
	require('../controllers/puzzle-strings.js').puzzlesAndSolutions;

const [puzzle, solution] = puzzlesAndSolutions[0];

suite('Functional Tests', () => {
	test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
		chai
			.request(server)
			.post('/api/solve')
			.send({puzzle})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isObject(res.body, 'post response should be an object');
				assert.property(res.body, 'solution', 'solution key is in response object');
				assert.equal(res.body.solution, solution, 'return equal to actual solution');
				done();
			});
	});
	test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function (done) {
		chai
			.request(server)
			.post('/api/solve')
			.end((err, res) => {
				assert.isObject(res.body, 'post response should be an object');
				assert.property(res.body, 'error', 'error key in response object');
				assert.deepEqual(res.body, {error: 'Required field missing'});
				done();
			});
	});
	test('Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
		chai
			.request(server)
			.post('/api/solve')
			.send({puzzle: '1a..2..'})
			.end((err, res) => {
				assert.isObject(res.body, 'post response should be an object');
				assert.property(res.body, 'error', 'error key in response object');
				assert.deepEqual(res.body, {error: 'Invalid characters in puzzle'});
				done();
			});
	});
	test('Solve a puzzle with incorrect length: POST request to /api/solve', function (done) {
		chai
			.request(server)
			.post('/api/solve')
			.send({puzzle: '1...2..'})
			.end((err, res) => {
				assert.isObject(res.body, 'post response should be an object');
				assert.property(res.body, 'error', 'error key in response object');
				assert.deepEqual(res.body, {error: 'Expected puzzle to be 81 characters long'});
				done();
			});
	});
	test('Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
		chai
			.request(server)
			.post('/api/solve')
			.send({
				puzzle:
					'1.5..2.....6..12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
			})
			.end((err, res) => {
				assert.isObject(res.body, 'post response should be an object');
				assert.property(res.body, 'error', 'error key in response object');
				assert.deepEqual(res.body, {error: 'Puzzle cannot be solved'});
				done();
			});
	});
	test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
		chai
			.request(server)
			.post('/api/check')
			.send({puzzle, coordinate: 'A1', value: '1'})
			.end((err, res) => {
				assert.isObject(res.body, 'post response should be an object');
				assert.notProperty(res.body, 'conflict', 'there should not be any conflict');
				assert.isTrue(res.body.valid, 'the field should be valid');
				done();
			});
	});
	test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
		chai
			.request(server)
			.post('/api/check')
			.send({puzzle, coordinate: 'A2', value: '9'})
			.end((err, res) => {
				assert.isObject(res.body, 'post response should be an object');
				assert.property(res.body, 'conflict', 'there should be a conflict');
				assert.isFalse(res.body.valid, 'the field should be invalid');
				assert.equal(res.body.conflict.length, 1, 'there should be one conflict');
				done();
			});
	});
	test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function (done) {
		chai
			.request(server)
			.post('/api/check')
			.send({puzzle, coordinate: 'B1', value: '3'})
			.end((err, res) => {
				assert.isObject(res.body, 'post response should be an object');
				assert.property(res.body, 'conflict', 'there should be a conflict');
				assert.isFalse(res.body.valid, 'the field should be invalid');
				assert.equal(res.body.conflict.length, 2, 'there should be two conflicts');
				done();
			});
	});
	test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function (done) {
		chai
			.request(server)
			.post('/api/check')
			.send({puzzle, coordinate: 'B1', value: '2'})
			.end((err, res) => {
				assert.isObject(res.body, 'post response should be an object');
				assert.property(res.body, 'conflict', 'there should be a conflict');
				assert.isFalse(res.body.valid, 'the field should be invalid');
				assert.equal(res.body.conflict.length, 3, 'there should be three conflicts');
				done();
			});
	});
	test('Check a puzzle placement with missing required fields: POST request to /api/check', function (done) {
		chai
			.request(server)
			.post('/api/check')
			.send({puzzle})
			.end((err, res) => {
				assert.isObject(res.body, 'post response should be an object');
				assert.property(res.body, 'error', 'there should be an error');
				assert.equal(res.body.error, 'Required field(s) missing');
				done();
			});
	});
	test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
		chai
			.request(server)
			.post('/api/check')
			.send({puzzle: '1a..2..', coordinate: 'A1', value: '1'})
			.end((err, res) => {
				assert.isObject(res.body, 'post response should be an object');
				assert.property(res.body, 'error', 'there should be an error');
				assert.equal(res.body.error, 'Invalid characters in puzzle');
				done();
			});
	});
	test('Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
		chai
			.request(server)
			.post('/api/check')
			.send({puzzle: '1...2..', coordinate: 'A1', value: '1'})
			.end((err, res) => {
				assert.isObject(res.body, 'post response should be an object');
				assert.property(res.body, 'error', 'there should be an error');
				assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
				done();
			});
	});
	test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function (done) {
		chai
			.request(server)
			.post('/api/check')
			.send({puzzle, coordinate: 'A12', value: '1'})
			.end((err, res) => {
				assert.isObject(res.body, 'post response should be an object');
				assert.property(res.body, 'error', 'there should be an error');
				assert.equal(res.body.error, 'Invalid coordinate');
				done();
			});
	});
	test('Check a puzzle placement with invalid placement value: POST request to /api/check', function (done) {
		chai
			.request(server)
			.post('/api/check')
			.send({puzzle, coordinate: 'A1', value: '15'})
			.end((err, res) => {
				assert.isObject(res.body, 'post response should be an object');
				assert.property(res.body, 'error', 'there should be an error');
				assert.equal(res.body.error, 'Invalid value');
				done();
			});
	});
});
