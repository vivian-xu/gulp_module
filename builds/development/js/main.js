'use strict';

var logger = require('./logger');

logger.greet(', it works!! And it well');
logger.fuck(', it errors!!');

var name = 'Vivian';

var add = function add(a, b) {
	return a + b;
};

var sum = function sum() {
	for (var _len = arguments.length, numbers = Array(_len), _key = 0; _key < _len; _key++) {
		numbers[_key] = arguments[_key];
	}

	return numbers.reduce(function (prev, curr) {
		return prev + curr;
	});
};