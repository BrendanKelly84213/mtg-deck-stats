const fs = require('fs');

// TODO:
// More options for parsing and error handling

function fileToDeck(file) {
	let deckObj = {}; 
	const tail = ([,...t]) => t;

	const fileContents = fs.readFileSync(file).toString();
	const lines = fileContents.split('\r\n');
	const splitLines = lines.map(line => [Number(line[0]), tail(tail(line)).join("")] ); 

	filteredLines = splitLines.filter(line => !(line[0] == NaN || line[1] == ''));
	filteredLines.forEach(line => deckObj[line[1]] = line[0]);

	return deckObj;
}

exports.deck = fileToDeck;
