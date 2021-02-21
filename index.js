const mtg = require('mtgsdk');
const parse = require('./parse.js');

const testDeck = {
	'goblin warchief': 16,
	'festering goblin': 10,
	'swamp': 24,
};

const handleErr = e => console.log('caught' + e.message);

// Card object
async function card(cardName) {
	const cardObj = await mtg.card.where({ name: cardName })
		.catch(handleErr);
	return cardObj[0];
}

// Card colors object 
async function cardColors(cardName) {
	const c = await card(cardName).catch(handleErr);

	if(!c) {
		console.log("Warning: card: " + cardName + " undefined");
		return {
			R: 0,
			U: 0,
			G: 0,
			B: 0,
			W: 0,
			C: 0
		};
	}

	const manaCost = c.manaCost;
	const cmc = c.cmc;

	const numColor = color => {
		const regex = new RegExp('[^' + color + ']','g');
		return manaCost ? manaCost.replace(regex, "").length : 0;
	};

	const _R=numColor('R'),
	      _G=numColor('G'),
	      _U=numColor('U'),
	      _W=numColor('W'),
	      _B=numColor('B');

	const colorsArr = [_R,_G,_U,_W,_B];
	const _C = cmc - colorsArr.reduce((acc,curr) => acc + curr);

	return {
		R: _R,  
		G: _G,  
		U: _U,  
		W: _W,  
		B: _B,  
		C: _C
	};
}

// Get the object for all the colors in the deck
async function deckColors(deck) {
	// Build an array of objects containing colors of cards	
	const colorObjs = await Promise.all(
		Object.keys(deck).map(async cardName => {
			const numCards = deck[cardName];
			console.log(cardName, numCards);
			// Get the colors object for the card
			const colors = await cardColors(cardName).catch(handleErr);
			// Adjust for amount for each color and place in an array
			const adjColorsArr = Object.values(colors).map(value => value * numCards) ;
			// The total number of colors corresponding to the card
			return {
				R: adjColorsArr[0],
				U: adjColorsArr[1],
				G: adjColorsArr[2],
				W: adjColorsArr[3],
				B: adjColorsArr[4],
				C: adjColorsArr[5]
			} ;
		})
	);

	// Looking now for the reduced colors object array. Sum but for objects
	// I cannot believe this just works
	return colorObjs.reduce((acc, curr) => ({ 
			R: acc.R + curr.R,
			U: acc.U + curr.U,
			G: acc.G + curr.G,
			W: acc.W + curr.W,
			B: acc.B + curr.B,
			C: acc.C + curr.C
		})
	);
}

(async () => { 
	const control = parse.deck('sultai_control.txt');
	console.log(control);
	const colors = await deckColors(control);
	console.log(colors);
})();

