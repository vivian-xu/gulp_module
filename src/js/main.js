var logger = require('./logger');

logger.greet(', it works!! And it well');
logger.fuck(', it errors!!');

let name = `Vivian`;

let add = (a, b) => a + b;

let sum = (...numbers) => {
	return numbers.reduce( (prev, curr) => {
		return prev + curr;
	});
};
