/*global game, console, gameState, SECOND*/
'use strict';

// CREATE_ENCOUNTER_TYPES:
// **************************************************************************
gameState.createEncounterTypes = function () {
	var closeFunc,
		mineFunc,
		finalCloseFunc,
		harvestFunc,
		blastFunc,
		ignoreFunc,
		reportFunc,
		lootFunc,
		lootRadiatedFunc,
		repairFunc,
		givePartsFunc,
		giveFuelFunc,
		repairSelfFunc;
	
	this.encounterTypes = {Convict:			{name: 'Convict',			niceName: 'Convict', frame: {Trade: 141, Wild: 141, Hostile: 141}, states: {}},
						   Derelicht:		{name: 'Derelicht',			niceName: 'Derelicht Ship', frame: {Trade: 139, Wild: 139, Hostile: 139}, states: {}},
						   Radiated:		{name: 'Radiated',			niceName: 'Radiated Derelicht', frame: {Trade: 148, Wild: 148, Hostile: 148}, states: {}},
						   Damaged:			{name: 'Damaged',			niceName: 'Damaged Ship', frame: {Trade: 132, Wild: 132, Hostile: 132}, states: {}},
						   OutOfFuel:		{name: 'OutOfFuel',			niceName: 'Out Of Fuel', frame: {Trade: 132, Wild: 132, Hostile: 132}, states: {}},
						   RepairDepot:		{name: 'RepairDepot',		niceName: 'Repair Depot', frame: {Trade: 151, Wild: 151, Hostile: 151}, states: {}}
						  };
	
	closeFunc = function () {
		gameState.currentEncounter.stateName = 'Init';
		gameState.menuStack.pop();
	};
	
	finalCloseFunc = function () {
		gameState.menuStack.pop();
		gameState.currentEncounter.destroy();
	};
	
	ignoreFunc = function () {
		gameState.currentEncounter.stateName = 'Ignored';
		gameState.encounterMenu.refresh();
		gameState.playerCharacter.gainCredits(200);
	};
	
	reportFunc = function () {
		gameState.currentEncounter.stateName = 'Reported';
		gameState.bonusCash += 400;
		gameState.encounterMenu.refresh();
	};
	
	lootFunc = function () {
		var pc = gameState.playerCharacter;
		
		gameState.currentEncounter.reward = gameState.randElem([{typeName: 'Fuel', amount: 5},
																{typeName: 'Vegetables', amount: 5},
																{typeName: 'Fruit', amount: 5},
																{typeName: 'FarmingEquipment', amount: 5},
																{typeName: 'MiningEquipment', amount: 5},
																{typeName: 'Steel', amount: 5},
																{typeName: 'Copper', amount: 5}]);
		
		gameState.currentEncounter.stateName = 'Looted';
		gameState.playerCharacter.inventory.addItem(gameState.currentEncounter.reward.typeName, gameState.currentEncounter.reward.amount);
		gameState.encounterMenu.refresh();
	};
	
	lootRadiatedFunc = function () {
		var pc = gameState.playerCharacter;
		if (game.rnd.integerInRange(0, 100) + pc.skills.shields * 10 > 50) {
			gameState.currentEncounter.reward = gameState.randElem([{typeName: 'Fuel', amount: 8},
																	{typeName: 'Vegetables', amount: 8},
																	{typeName: 'Fruit', amount: 8},
																	{typeName: 'FarmingEquipment', amount: 8},
																	{typeName: 'MiningEquipment', amount: 8},
																	{typeName: 'Steel', amount: 8},
																	{typeName: 'Copper', amount: 8}]);

			gameState.currentEncounter.stateName = 'Looted';
			gameState.playerCharacter.inventory.addItem(gameState.currentEncounter.reward.typeName, gameState.currentEncounter.reward.amount);
		} else {
			pc.takeDamage(5);
			gameState.currentEncounter.stateName = 'Failed';
		}
		gameState.encounterMenu.refresh();
	};
	
	repairFunc = function () {
		var pc = gameState.playerCharacter;
		if (game.rnd.integerInRange(0, 100) + pc.skills.engineering * 10 > 50) {
			pc.gainCredits(200);
			gameState.currentEncounter.stateName = 'Repaired';
		} else {
			gameState.currentEncounter.stateName = 'RepairFailed';
		}
		gameState.encounterMenu.refresh();
	};
	
	givePartsFunc = function () {
		var pc = gameState.playerCharacter;
		if (pc.inventory.countItem('Steel') >= 3) {
			pc.inventory.removeItem('Steel', 3);
			pc.gainCredits(200);
			gameState.currentEncounter.stateName = 'GaveParts';
		} else {
			gameState.currentEncounter.stateName = 'FailedToGiveParts';
		}
		gameState.encounterMenu.refresh();
	};
	
	giveFuelFunc = function () {
		var pc = gameState.playerCharacter;
		if (pc.inventory.countItem('Fuel') >= 3) {
			pc.inventory.removeItem('Fuel', 3);
			pc.gainCredits(200);
			gameState.currentEncounter.stateName = 'GaveFuel';
		} else {
			gameState.currentEncounter.stateName = 'FailedToGiveFuel';
		}
		gameState.encounterMenu.refresh();
	};
	
	repairSelfFunc = function () {
		var pc = gameState.playerCharacter;
		pc.repairDamage(1000);
		gameState.currentEncounter.stateName = 'RepairedSelf';
		gameState.encounterMenu.refresh();
	};
	
	// CONVICT:
	// *********************************************************************
	this.encounterTypes.Convict.states.Init = {text: 'You encounter a convict who is wanted by the authorities. A reward of 400 credits will be yours when you return to start port if you report his location. He offers you 200 credits on the spot to ignore him.',
													buttons: [{text: 'ignore', func: ignoreFunc},
															  {text: 'report', func: reportFunc},
															  {text: 'leave', func: closeFunc}
															 ]};
	this.encounterTypes.Convict.states.Ignored = {text: 'You ignored the convict and got 200 credits',
													  buttons: [{text: 'close', func: finalCloseFunc}]};
	
	this.encounterTypes.Convict.states.Reported = {text: 'You reported the convict. Your reward will be transfered to your account upon your return to star port',
														 buttons: [{text: 'close', func: finalCloseFunc}]};
	
	// DERELICHT:
	// *********************************************************************
	this.encounterTypes.Derelicht.states.Init = {text: 'You encounter a derelicht. You can claim a reward of 400 credits upon returning to start port if you report its location.',
													buttons: [{text: 'loot', func: lootFunc},
															  {text: 'report', func: reportFunc},
															  {text: 'leave', func: closeFunc}
															 ]};
	this.encounterTypes.Derelicht.states.Looted = {text: 'You looted [ITEMAMOUNT] x [ITEMNAME] from the derelicht',
													  buttons: [{text: 'close', func: finalCloseFunc}]};
	
	this.encounterTypes.Derelicht.states.Reported = {text: 'You reported the derelicht',
														 buttons: [{text: 'close', func: finalCloseFunc}]};
	
	// RADIATED:
	// *********************************************************************
	this.encounterTypes.Radiated.states.Init = {text: 'You encounter a heavily radiated derelicht. You believe you may be able to configure your shields to safely loot the vessel [SHIELD SKILL]. Otherwise you can claim a reward of 400 credits upon returning to start port if you report its location.',
													buttons: [{text: 'loot', func: lootRadiatedFunc},
															  {text: 'report', func: reportFunc},
															  {text: 'leave', func: closeFunc}
															 ]};
	this.encounterTypes.Radiated.states.Looted = {text: 'You looted [ITEMAMOUNT] x [ITEMNAME] from the readiated derelicht',
													  buttons: [{text: 'close', func: finalCloseFunc}]};
	
	this.encounterTypes.Radiated.states.Failed = {text: 'You failed to loot the derelicht and took 5 damage.',
														 buttons: [{text: 'close', func: closeFunc}]};
	
	this.encounterTypes.Radiated.states.Reported = {text: 'You reported the derelicht. Your reward will be transfered to your account upon return to start port.',
														 buttons: [{text: 'close', func: finalCloseFunc}]};
	
	// DAMAGED:
	// *********************************************************************
	this.encounterTypes.Damaged.states.Init = {text: 'You encounter a damaged ship signeling for assistance. They require a 3 x steel to repair their ship. You also believe you may be able to repair the ship yourself [ENGINEERING SKILL].',
													buttons: [{text: 'repair', func: repairFunc},
															  {text: 'give parts', func: givePartsFunc},
															  {text: 'leave', func: closeFunc}
															 ]};
	this.encounterTypes.Damaged.states.Repaired = {text: 'You successfully repaired the ship and got 200 credits from the grateful crew.',
													  buttons: [{text: 'close', func: finalCloseFunc}]};
	
	this.encounterTypes.Damaged.states.RepairFailed = {text: 'You failed to repair the ship and the crew, now wary of your lack of abilities reject further assistance.',
														 buttons: [{text: 'close', func: finalCloseFunc}]};
	
	this.encounterTypes.Damaged.states.GaveParts = {text: 'You gave the ship the steel and got 200 credits from the grateful crew.',
														 buttons: [{text: 'close', func: finalCloseFunc}]};
	
	this.encounterTypes.Damaged.states.FailedToGiveParts = {text: 'You do not have the required parts.',
														 buttons: [{text: 'close', func: closeFunc}]};
	
	// OUT_OF_FUEL:
	// *********************************************************************
	this.encounterTypes.OutOfFuel.states.Init = {text: 'You encounter a ship which has run out of fuel. They request 3 x fuel and offer to pay you 200 credits for it.',
													buttons: [{text: 'give fuel', func: giveFuelFunc},
															  {text: 'leave', func: closeFunc}
															 ]};
	this.encounterTypes.OutOfFuel.states.GaveFuel = {text: 'You gave the ship 3 x fuel and got 200 credits',
													  buttons: [{text: 'close', func: finalCloseFunc}]};
	
	this.encounterTypes.OutOfFuel.states.FailedToGiveFuel = {text: 'You do not have enough fuel.',
														 buttons: [{text: 'close', func: closeFunc}]};
	
	// REPAIR_DEPOT:
	// *********************************************************************
	this.encounterTypes.RepairDepot.states.Init = {text: 'You encounter a repair depot which offers scouts a one time free repair.',
													buttons: [{text: 'repair', func: repairSelfFunc},
															  {text: 'leave', func: closeFunc}
															 ]};
	this.encounterTypes.RepairDepot.states.RepairedSelf = {text: 'Your ship has been completely repaired',
													  buttons: [{text: 'close', func: finalCloseFunc}]};
	
};


// CREATE_ENCOUNTER:
// **************************************************************************
gameState.createEncounter = function (tileIndex, typeName) {
	var position = this.getPositionFromTileIndex(tileIndex),
		encounter = {},
		radiateAsteroids,
		scrapAsteroids,
		mineralAsteroids,
		newTileIndex;
	
	if (typeName !== 'SteelAsteroid'
			&& typeName !== 'CopperAsteroid'
			&& typeName !== 'IceAsteroid'
			&& typeName !== 'UraniumAsteroid'
			&& typeName !== 'FuelCloud'
			&& typeName !== 'GrassAsteroid'
			&& typeName !== 'CowAsteroid'
			&& typeName !== 'CrystalAsteroid'
			&& typeName !== 'FruitAsteroid'
			&& typeName !== 'MineField') {
		// Attributes:
		encounter.type = this.encounterTypes[typeName];
		encounter.stateName = 'Init';
		encounter.tileIndex = {x: tileIndex.x, y: tileIndex.y};

		// Sprite:
		encounter.sprite = gameState.createSprite(position.x, position.y, 'MapTileset', this.characterSpritesGroup);
		encounter.sprite.frame = encounter.type.frame[gameState.sectorTypeName];
		encounter.sprite.anchor.setTo(0.5, 0.5);

		// Functions:
		encounter.destroy = this.destroyEncounter;

		this.encounterList.push(encounter);

		this.getTile(tileIndex).encounter = encounter;
		this.getTile(tileIndex).type = this.tileTypes.Space;
	}

	// MINERAL_ASTEROIDS:
	mineralAsteroids = function (centerTileIndex, tileRadius, typeName, percent) {
		var x, y;
		for (x = centerTileIndex.x - tileRadius; x <= centerTileIndex.x + tileRadius; x += 1) {
			for (y = centerTileIndex.y - tileRadius; y <= centerTileIndex.y + tileRadius; y += 1) {
				if (gameState.isTileIndexInBounds({x: x, y: y})
						&& game.math.distance(centerTileIndex.x, centerTileIndex.y, x, y) <= tileRadius
						&& gameState.getTile({x: x, y: y}).type.name === 'Asteroid'
						&& game.rnd.frac() < percent) {
					
					if (gameState.tileTypes['Large' + typeName] && game.rnd.frac() < gameState.spawnLargePercent[gameState.sectorLevel]) {
						gameState.getTile({x: x, y: y}).type = gameState.tileTypes['Large' + typeName];
					} else {
						gameState.getTile({x: x, y: y}).type = gameState.tileTypes[typeName];
					}
				}
			}
		}
	};
	
	if (typeName === 'Radiated') {
		mineralAsteroids(tileIndex, 2, 'Debris', 0.8);
		this.spawnShips(tileIndex, ['Eel'], game.rnd.integerInRange(1, gameState.sectorLevel + 1));
	} else if (typeName === 'Derelicht') {
		mineralAsteroids(tileIndex, 2, 'Debris', 0.8);
		this.spawnShips(tileIndex, ['Scavenger'], game.rnd.integerInRange(1, gameState.sectorLevel + 2));
	} else if (typeName === 'IceAsteroid') {
		mineralAsteroids(tileIndex, 3, 'IceAsteroid', 0.3);
		if (game.rnd.frac() < 0.25) {
			this.spawnShips(tileIndex, ['IceFish'], game.rnd.integerInRange(1, gameState.sectorLevel + 1));
		}
	} else if (typeName === 'MineField') {
		mineralAsteroids(tileIndex, 2, 'Debris', 0.8);
		this.spawnShips(tileIndex, ['Mine'], game.rnd.integerInRange(1, gameState.sectorLevel + 4));
	} else if (typeName === 'SteelAsteroid') {
		mineralAsteroids(tileIndex, 2, 'SteelAsteroid', 0.3);
	} else if (typeName === 'CopperAsteroid') {
		mineralAsteroids(tileIndex, 2, 'CopperAsteroid', 0.3);
	} else if (typeName === 'UraniumAsteroid') {
		mineralAsteroids(tileIndex, 1, 'UraniumAsteroid', 0.3);
		this.spawnShips(tileIndex, ['Eel'], game.rnd.integerInRange(1, gameState.sectorLevel + 1));
	} else if (typeName === 'CrystalAsteroid') {
		mineralAsteroids(tileIndex, 1, 'CrystalAsteroid', 0.3);
		this.spawnShips(tileIndex, ['Crystal'], game.rnd.integerInRange(1, gameState.sectorLevel + 2));
	} else if (typeName === 'GrassAsteroid') {
		mineralAsteroids(tileIndex, 3, 'GrassAsteroid', 0.3);
	} else if (typeName === 'FruitAsteroid') {
		mineralAsteroids(tileIndex, 2, 'FruitAsteroid', 0.3);
	} else if (typeName === 'CowAsteroid') {
		mineralAsteroids(tileIndex, 2, 'CowAsteroid', 0.3);
	} else if (typeName === 'FuelCloud') {
		mineralAsteroids(tileIndex, 2, 'FuelCloud', 0.3);
	}
};

// CREATE_BLACK_HOLE:
// **************************************************************************
gameState.createBlackHole = function (tileIndex) {
	var blackHole = {},
		position = this.getPositionFromTileIndex(tileIndex),
		clearAsteroids;
	
	// Attributes:
	blackHole.tileIndex = {x: tileIndex.x, y: tileIndex.y};
	blackHole.type = {name: 'BlackHole', niceName: 'Black Hole'};
	
	// Sprite:
	blackHole.sprite = gameState.createSprite(position.x, position.y, 'MapTileset', this.characterSpritesGroup);
	blackHole.sprite.frame = 145;
	blackHole.sprite.anchor.setTo(0.5, 0.5);
	
	this.getTile(tileIndex).encounter = blackHole;
	this.encounterList.push(blackHole);

	// Function:
	blackHole.update = this.updateBlackHole;
	
	// CLEAR_ASTEROIDS:
	clearAsteroids = function (centerTileIndex, tileRadius) {
		var x, y;
		for (x = centerTileIndex.x - tileRadius; x <= centerTileIndex.x + tileRadius; x += 1) {
			for (y = centerTileIndex.y - tileRadius; y <= centerTileIndex.y + tileRadius; y += 1) {
				if (gameState.isTileIndexInBounds({x: x, y: y})
						&& game.math.distance(centerTileIndex.x, centerTileIndex.y, x, y) <= tileRadius
						&& gameState.getTile({x: x, y: y}).type.name === 'Asteroid') {
					gameState.getTile({x: x, y: y}).type = gameState.tileTypes.Space;
				}
			}
		}
	};
	
	clearAsteroids(tileIndex, 3);
	
	this.blackHoleList.push(blackHole);
	return blackHole;
};

// CREATE_PULSER:
gameState.createPulser = function (tileIndex) {
	var pulser = this.createBlackHole(tileIndex);
	
	// Attributes:
	pulser.shootTime = 0;
	pulser.type = {name: 'Pulser', niceName: 'Pulser'};
	
	// Sprite:
	pulser.sprite.frame = 144;
	
	pulser.update = this.updatePulser;
	
};

gameState.updateBlackHole = function () {
	this.sprite.rotation += 0.01;
	
	if (gameState.getTile(this.tileIndex).explored) {
		this.sprite.visible = true;
	} else {
		this.sprite.visible = false;
	}
};

gameState.updatePulser = function () {
	this.sprite.rotation += 0.01;
	
	this.shootTime += 1;
	if (this.shootTime > SECOND && gameState.getDistance(this.sprite.position, gameState.playerCharacter.sprite.position) < 400) {
		this.shootTime = 0;
		gameState.createProjectile(this, {x: this.sprite.x + game.rnd.integerInRange(-10, 10), y: this.sprite.y + game.rnd.integerInRange(-10, 10)}, 'FireBall', 0, 'hull');
	}
	
	if (gameState.getTile(this.tileIndex).explored) {
		this.sprite.visible = true;
	} else {
		this.sprite.visible = false;
	}
};

// DESTROY_ENCOUNTER:
// **************************************************************************
gameState.destroyEncounter = function () {
	// Remove from tile:
	gameState.getTile(this.tileIndex).encounter = null;
	
	// Destroy Sprite:
	this.sprite.destroy();
};

// DESTROY_ALL_ENCOUNTERS:
// **************************************************************************
gameState.destroyAllEncounters = function () {
	var i;
	
	for (i = 0; i < this.encounterList.length; i += 1) {
		this.encounterList[i].sprite.destroy();
	}
	
	this.encounterList = [];
};

// DESTROY_ALL_BLACK_HOLES:
// **************************************************************************
gameState.destroyAllBlackHoles = function () {
	var i;
	
	for (i = 0; i < this.blackHoleList.length; i += 1) {
		this.blackHoleList[i].sprite.destroy();
	}
	
	this.blackHoleList = [];
	
};
// GET_ENCOUNTER_TEXT:
// **************************************************************************
gameState.getEncounterText = function () {
	var text = this.currentEncounter.type.states[this.currentEncounter.stateName].text;
	
	if (this.currentEncounter.reward) {
		text = text.replace('[ITEMNAME]', this.itemTypes[this.currentEncounter.reward.typeName].niceName);
		text = text.replace('[ITEMAMOUNT]', this.currentEncounter.reward.amount);
	}
	return text;
};

// GET_ENCOUNTER_BUTTONS:
// **************************************************************************
gameState.getEncounterButtons = function () {
	return this.currentEncounter.type.states[this.currentEncounter.stateName].buttons;
};