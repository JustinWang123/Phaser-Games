/*global Phaser, mainMenuState, menuState, loseState, console, winState, LARGE_BLACK_FONT */
'use strict';

var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;

var INVENTORY_SIZE = 7;
var HARD_POINTS_SIZE = 7;
var SPAWN_ENEMY_TURN = 200;

var SECOND = 60;
var TILE_SIZE = 48;
var TURN_TIME = 60 * SECOND;
var PIRATE_DESPAWN_TICKS = 20;
var PIRATE_SPAWN_TICKS = 10;
var DISTANCE_PER_FUEL = 35 * 42;
var TIME_LIMIT = 20 * 60 * 60;

var SKILL_DESC = {navigation: 'Navigation Skill:\n\nAdds +1 to the speed of your ship and improves fuel efficiency. Also reduces the chance of taking damage when navigating asteroid fields.',
				  logistics: 'Logistics Skill:\n\nAdds +2 to your cargo capacity.',
				  shields: 'Shields Skill:\n\nAdds +1 to your shield hit points and reduces shield recharge time by 5%.',
				  gunnery: 'Gunnery Skill:\n\nReduces weapon cooldown by 10%.',
				  barter: 'Barter Skill:\n\nMerchants will buy your goods for more and sell you their goods for cheaper.',
				  engineering: 'Engineering Skill:\n\nAdds +5 to your maximum hit points and lowers the cost of repairing your ship at stations.'};


var SECTOR_DESC = {Trade: 'Each colony in this sector specializes in a certain type of trade goods.By shipping goods from colonies where they are produced to colonys where they are desired you can turn a tidy profit.\n\nYour objective is to increase your net worth by [OBJECTIVE] credits within the 20:00 time limit Progess towards this objective is displayed at the top of the screen.\n\n Your net worth is simply the sum of your credits and the value of your cargo and equipment',
				   Wild: 'You will receive credits for every tile that you explore in this sector.\n\nYou should also look into harvesting the sectors abundant resources. \n\nYour objective is to increase your net worth by [OBJECTIVE] credits within the 20:00 time limit. Progess towards this objective is displayed at the top of the screen.\n\n Your net worth is simply the sum of your credits and the value of your cargo and equipment.',
				   Hostile: 'The security council is offering a cash reward for every hostile ship that you destroy in this sector.\n\nYour objective is to increase your net worth by [OBJECTIVE] credits within the 20:00 time limit. Progess towards this objective is displayed at the top of the screen.\n\n Your net worth is simply the sum of your credits and the value of your cargo and equipment'
				  };

var game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.CANVAS, 'gameDiv');

var gameState = {
    numTilesX: 90,
    numTilesY: 90,
	numRegions: 3,
    tileSize: TILE_SIZE,
    scaleFactor: 2,
    numScreenTilesX: 14,
    numScreenTilesY: 14,
    damageText: [],
	currentTurn: 0,
	objectiveComplete: false,
    
    // PRELOAD FUNCTION:
    preload: function () {
        // TIMING (allows fps to show):
        game.time.advancedTiming = true;
    },

    // CREATE FUNCTION:
    create: function () {
        var data;
		
		this.objectiveComplete = false;
		this.testTimer = 0;
		this.bonusCash = 0;
		this.currentTurn = 0;
		this.exploredTiles = 0;
		
		this.keys = {
            one: game.input.keyboard.addKey(Phaser.Keyboard.ONE),
            two: game.input.keyboard.addKey(Phaser.Keyboard.TWO),
            three: game.input.keyboard.addKey(Phaser.Keyboard.THREE),
            four: game.input.keyboard.addKey(Phaser.Keyboard.FOUR),
			c: game.input.keyboard.addKey(Phaser.Keyboard.C)
        };
		
        // Lists:
        this.itemList = [];
        this.characterList = [];
        this.npcList = [];
        this.projectileList = [];
        this.colonyList = [];
		this.encounterList = [];
		this.blackHoleList = [];
        this.agroedShipsList = [];
		
        // Sprite Groups (for layering):
        this.tileMapSpritesGroup = game.add.group();
        this.itemSpritesGroup = game.add.group();
        this.colonySpriteGroup = game.add.group();
        this.characterSpritesGroup = game.add.group();
		this.projectileSpritesGroup = game.add.group();
        this.hudTileSpritesGroup = game.add.group();
        
        
        // Create Types:
        this.createItemTypes();
        this.createTileTypes();
        this.createProjectileTypes();
        this.createColonyTypes();
		this.createShipTypes();
		this.createEncounterTypes();
		this.createJobTypes();
		
        // Map:
		this.wayPointIndex = {x: null, y: null};
		this.initiateTileMap();
		this.createTileMap();
		this.createTileMapSprites();
        
		// Load or initilize player:
		this.createPlayerCharacterInput();
		this.createPlayerShip({x: this.colonyList[0].tileIndex.x - 2, y: this.colonyList[0].tileIndex.y});
		//this.createPlayerShip({x: 2, y: 2});
		this.updateFoV();

		/*
		this.playerCharacter.hardPoints.addItem('MissileLauncher');
		this.playerCharacter.hardPoints.addItem('PlasmaCannon');
		this.playerCharacter.hardPoints.addItem('AdvancedCargoPod');
		this.playerCharacter.hardPoints.addItem('ArmorPod');
		*/
		//this.playerCharacter.hardPoints.addItem('ShieldRecharger');
		// Test enemy:
		//this.createItem({x: this.colonyList[0].tileIndex.x - 2, y: this.colonyList[0].tileIndex.y - 2}, 'Fuel', 20);
		//this.createShip({x: this.colonyList[0].tileIndex.x - 2, y: this.colonyList[0].tileIndex.y - 2}, 'Mine');
		//this.createShip({x: this.colonyList[0].tileIndex.x - 3, y: this.colonyList[0].tileIndex.y - 6}, 'IceFish');
		//this.playerCharacter.inventory.addItem('Missile', 1);
		//this.createEncounter({x: this.colonyList[0].tileIndex.x + 3, y: this.colonyList[0].tileIndex.y}, 'Convict');
		//this.createItem({x: this.colonyList[0].tileIndex.x - 2, y: this.colonyList[0].tileIndex.y - 2}, 'LaserCannonIII', 10);
		//this.createBlackHole({x: this.colonyList[0].tileIndex.x - 2, y: this.colonyList[0].tileIndex.y - 3});
		
        // HUD:
		this.createMenuStack();
        this.createHUDSprites();
        this.createInventoryMenu(true, 80, 40);
        this.createMerchantMenu(80, 40);
		this.createJobMenu();
        this.createColonyMenu();
        this.createCharacterMenu(80, 40);
		this.createMapMenu();
		this.createEncounterMenu();
		this.createTextMenu(80, 40);
        
        // Setup camera:
        game.world.bounds.setTo(-16, -16, this.numTilesX * this.tileSize + 220 + 16, this.numTilesY * this.tileSize + 32);
        game.camera.setBoundsToWorld();
        
        // Game proporties:
        this.gameState = 'GAME_STATE';
		
		// Sector Objective:
		this.initialNetWorth = this.getPlayerNetWorth();
		this.deathTimer = 0;
		
		this.textMenu.setTitle(this.sectorTypeName + ' SECTOR');
		this.textMenu.setText(SECTOR_DESC[this.sectorTypeName].replace('[OBJECTIVE]', this.goalCredits));
		this.textMenu.setButtons([{text: 'CLOSE', func: function () { gameState.menuStack.pop(); }}]);
		this.menuStack.push(this.textMenu);
    },
        
    // UPDATE FUNCTION:
    update: function () {
        var i;
		
		if (this.gameState === 'GAME_STATE') {
			this.testTimer += 1;
			
			this.updateProjectiles();
		
			// Update all ships:
			for (i = 0; i < this.characterList.length; i += 1) {
				if (this.characterList[i].isAlive) {
					this.characterList[i].chooseAction();
					this.characterList[i].update();
				}
			}
			
			// Update black holes:
			for (i = 0; i < this.blackHoleList.length; i += 1) {
				this.blackHoleList[i].update();
			}
			
			if (this.testTimer % TURN_TIME === 0) {
				this.updateTurn();
			}
			
			if (this.deathTimer > 0) {
				this.deathTimer -= 1;
				
				if (this.deathTimer === 0) {
					this.textMenu.setTitle('SHIP DESTROY');
					this.textMenu.setText('Your ship has been destroyed.\n\nClick continue to return to the office or restart to restart the contract.');
					this.textMenu.setButtons([{text: 'CONTINUE', func: function () {
						game.state.start('menu');
					}},
											  {text: 'RESTART', func: function () {
							game.state.start('game');
						}}]);
					this.menuStack.push(this.textMenu);
				}
			}
		}

        // Update sprites:
        this.updateTileMapSprites();
        this.updateDamageText();
        this.updateHUDSprites();
		
		if (this.gameState === 'MAP_MENU_STATE') {
			this.mapMenu.update();
		}
		
		// Test failure:
		if (this.testTimer === TIME_LIMIT) {
			this.textMenu.setTitle('CONTRACT OVER');
			this.textMenu.setText('Your contract in this sector has expired. Returning to base.');
			this.textMenu.setButtons([{text: 'CLOSE', func: function () {
				if (gameState.objectiveComplete) {
					gameState.savePlayerShip();
				}
				game.state.start('menu');
			}}]);
			gameState.menuStack.push(gameState.textMenu);
		}
        
        // Update camera:
        game.camera.focusOnXY(this.playerCharacter.sprite.x + 120 - 16, this.playerCharacter.sprite.y + 16 - 16);
    },
    
    // RENDER FUNCTION:
    render: function () {
        //game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
    }
};

gameState.testObjective = function () {
	var text, reward, pc = gameState.playerCharacter;
	
	if (!this.objectiveComplete) {

		if (this.getPlayerNetWorth() - this.initialNetWorth >= this.goalCredits) {
			this.textMenu.setTitle('Objective Complete');
			text = 'You have successfully increased your net worth by ' + this.goalCredits + ' credits. You may exit the sector at any time by clicking the exit button to the right.';
			
			if (this.bonusCash > 0) {
				text += '\n\nYou have received a bounty of ' + this.bonusCash + ' credits from the sector authorities for your actions.';
			}
			this.bonusCash = 0;
			
			if (this.testTimer < 10 * 60 * SECOND) {
				reward = Math.floor(this.goalCredits / 10);
				text += '\n\nFor completing the sector in under 10:00 you have received a bonus reward of ' + reward + ' credits.';
				this.bonusCash += reward;
			}
			
			this.playerCharacter.credits += this.bonusCash;
			
			this.textMenu.setText(text);
			this.textMenu.setButtons([{text: 'CONTINUE', func: function () { gameState.menuStack.pop(); }}]);
			gameState.menuStack.push(gameState.textMenu);
			
			this.objectiveComplete = true;
			if (menuState.selectedSectorIndex === pc.sectorUnlocked && pc.sectorUnlocked < 8) {
				pc.sectorUnlocked += 1;
			}
			
			pc.contractCount += 1;
			this.savePlayerShip();
		}
	}
};

// SHOW COUNT:
gameState.showCount = function () {
	var sum = this.countChildren(game.world);
	
	console.log('*****************************************');
	console.log('total: ' + this.countChildren(game.world));
	console.log('tileMapSprites: ' + this.countChildren(this.tileMapSpritesGroup));
	console.log('colonySpriteGroup: ' + this.countChildren(this.colonySpriteGroup));
	console.log('characterSpritesGroup: ' + this.countChildren(this.characterSpritesGroup));
	console.log('projectileSpritesGroup: ' + this.countChildren(this.projectileSpritesGroup));
	console.log('hudTileSpritesGroup: ' + this.countChildren(this.hudTileSpritesGroup));
	console.log('HUD.group: ' + this.countChildren(this.HUD.group));
	console.log('inventoryMenu.group: ' + this.countChildren(this.inventoryMenu.group));
	console.log('merchantMenu.group: ' + this.countChildren(this.merchantMenu.group));
	console.log('textMenu.group: ' + this.countChildren(this.textMenu.group));
	console.log('encounterMenu.group: ' + this.countChildren(this.encounterMenu.group));
	console.log('jobMenu.group: ' + this.countChildren(this.jobMenu.group));
	console.log('colonyMenu.group: ' + this.countChildren(this.colonyMenu.group));
	console.log('characterMenu.group: ' + this.countChildren(this.characterMenu.group));
	console.log('mapMenu.group: ' + this.countChildren(this.mapMenu.group));
				
	sum -= this.countChildren(this.tileMapSpritesGroup);
	sum -= this.countChildren(this.colonySpriteGroup);
	sum -= this.countChildren(this.characterSpritesGroup);
	sum -= this.countChildren(this.projectileSpritesGroup);
	sum -= this.countChildren(this.hudTileSpritesGroup);
	sum -= this.countChildren(this.HUD.group);
	sum -= this.countChildren(this.inventoryMenu.group);
	sum -= this.countChildren(this.merchantMenu.group);
	sum -= this.countChildren(this.textMenu.group);
	sum -= this.countChildren(this.encounterMenu.group);
	sum -= this.countChildren(this.jobMenu.group);
	sum -= this.countChildren(this.colonyMenu.group);
	sum -= this.countChildren(this.characterMenu.group);
	sum -= this.countChildren(this.mapMenu.group);
	
	console.log('remaining: ' + sum);
	
};

// UPDATE_TURN:
// ************************************************************************************************
gameState.updateTurn = function () {
	var i, tableEntry;
	this.currentTurn += 1;
	
	// Spawn ships (every 4 minutes):
	if (this.currentTurn % 4 === 0) {
		tableEntry = this.sectorSpawnTable[this.sectorTypeName][this.sectorLevel][game.rnd.integerInRange(0, this.sectorSpawnTable[this.sectorTypeName][this.sectorLevel].length - 1)];
		this.spawnShips(this.getRandomPassableIndex(), tableEntry.typeName, tableEntry.num);
	}
	
	// Restock colonies (every 8 minutes):
	if (this.currentTurn === 7) {
		for (i = 0; i < this.colonyList.length; i += 1) {
			this.colonyList[i].restock();
		}
	}
};

// CREATE_SPRITE:
// ************************************************************************************************
gameState.createSprite = function (x, y, image, group) {
    var sprite;
    sprite = game.add.sprite(x, y, image);
    sprite.smoothed = false;
    sprite.scale.setTo(this.scaleFactor, this.scaleFactor);
    
    if (group) {
        group.add(sprite);
    }
    
    return sprite;
};

// CREATE TEXT:
// ************************************************************************************************
gameState.createText = function (x, y, textStr, font, group) {
    var text;
    text = game.add.text(x, y, textStr, font);
    
    if (group) {
        group.add(text);
    }
    
    return text;
};

// CREATE_BUTTON:
// ************************************************************************************************
gameState.createButton = function (x, y, image, callBack, context, group) {
    var button = game.add.button(x, y, image, callBack, context);
    button.smoothed = false;
    button.scale.setTo(this.scaleFactor, this.scaleFactor);
    
    if (group) {
        group.add(button);
    }
    return button;
};

// CREATE_TEXT_BUTTON:
// ************************************************************************************************
gameState.createTextButton = function (x, y, text, callBack, context, group) {
    var button = {};
    
    // Create button group:
    button.group = game.add.group();
    
    // Create button:
    button.button = game.add.button(x, y, 'Button', callBack, context, 1, 0, 0, 0);
    button.button.smoothed = false;
    button.button.anchor.setTo(0.5, 0.5);
    button.button.scale.setTo(this.scaleFactor, this.scaleFactor);
    button.group.add(button.button);
    
    // Create text:
    button.text = game.add.text(x - 1, y + 1, text, LARGE_BLACK_FONT);
    button.text.anchor.setTo(0.5, 0.5);
    //button.text.smoothed = false;
    button.group.add(button.text);
    
    if (group) {
        group.add(button.group);
    }
    
    return button;
};

// RAND_ELEM:
// ************************************************************************************************
gameState.randElem = function (list) {
    return list[game.rnd.integerInRange(0, list.length - 1)];
};

// RAND_ELEM:
// ************************************************************************************************
gameState.inArray =  function (element, array) {
    var i;
    for (i = 0; i < array.length; i += 1) {
        if (array[i] === element) {
            return true;
        }
    }

    return false;
};

// REMOVE_FROM_ARRAY:
// ************************************************************************************************
gameState.removeFromArray = function (element, array) {
    var i;
    for (i = 0; i < array.length; i += 1) {
        if (array[i] === element) {
            array.splice(i, 1);
            return;
        }
    }
    console.log('removeFromArray(): FAILED');
    
};

// WRAP_TEXT:
// ************************************************************************************************
gameState.wrapText = function (text, maxWidth) {
    var i, j, lineStart = 0, lineEnd = 0, breaklines = [], lines = [];

    if (typeof (String.prototype.trim) === "undefined") {
        String.prototype.trim = function () {
            return String(this).replace(/^\s+|\s+$/g, '');
        };
    }

    breaklines = text.split('\n');

    for (j = 0; j < breaklines.length; j += 1) {
        lineStart = 0;
        lineEnd = 0;
        for (i = 0; i < breaklines[j].length; i += 1) {
            if (breaklines[j][i] === ' ') {
                lineEnd = i;
            }

            if (i - lineStart === maxWidth) {
                lines.push(breaklines[j].substring(lineStart, lineEnd));
                lineStart = lineEnd;
            }
        }

        // add remaining text:
        lines.push(breaklines[j].substring(lineStart, breaklines[j].length));
    }


    for (i = 0; i < lines.length; i += 1) {
        lines[i] = lines[i].trim();
    }

    return lines;
};

// ANGLE_TO_FACE:
// ************************************************************************************************
gameState.angleToFace = function (fromPos, toPos) {
    return game.math.angleBetween(fromPos.x, fromPos.y, toPos.x, toPos.y) + Math.PI / 2;
};

// GET_DISTANCE
// ************************************************************************************************
gameState.getDistance = function (fromPos, toPos) {
	return game.math.distance(fromPos.x, fromPos.y, toPos.x, toPos.y);
};

// GET_NORMAL
// ************************************************************************************************
gameState.getNormal = function (fromPos, toPos) {
	var distance = game.math.distance(fromPos.x, fromPos.y, toPos.x, toPos.y);
	
	if (distance === 0) {
		console.log('getNormal failed');
	}
	
	return {x: (toPos.x - fromPos.x) / distance, y: (toPos.y - fromPos.y) / distance};
};

// VECTOR_EQUAL:
// ************************************************************************************************
gameState.vectorEqual = function (v1, v2) {
	return v1.x === v2.x && v1.y === v2.y;
};

// CHOOSE_RANDOM:
// ************************************************************************************************
gameState.chooseRandom = function (table) {
    var percentSum = 0,
        rand = game.rnd.integerInRange(0, 99),
        i;
    
    for (i = 0; i < table.length; i += 1) {
        percentSum += table[i].percent;
        if (rand < percentSum) {
            return table[i].name;
        }
    }
    
    console.log('chooseRandom() failed');
};

// RANDOM_SUBSET:
// ************************************************************************************************
gameState.randomSubset = function (list, num) {
	var newList = [], element;
	
	while (newList.length !== num && newList.length !== list.length) {
		element = this.randElem(list);
		
		if (!this.inArray(element, newList)) {
			newList.push(element);
		}
	}
	
	return newList;
};

// MOUSE_IN_BOX:
// ************************************************************************************************
gameState.mouseInBox = function (startX, startY, endX, endY) {
	return game.input.activePointer.x > startX && game.input.activePointer.y > startY && game.input.activePointer.x < endX && game.input.activePointer.y < endY;
};

// COUNT_CHILDREN:
// ************************************************************************************************
gameState.countChildren = function (group) {
	var i, sum = 0;
	// Base Case:
	if (!group.children || group.children.length === 0) {
		return 1;
	}
	
	// Recursive Case:
	for (i = 0; i < group.children.length; i += 1) {
		sum += gameState.countChildren(group.children[i]);
	}
	return sum;
};

game.state.add('game', gameState);
game.state.add('lose', loseState);
game.state.add('menu', menuState);
game.state.add('win', winState);
game.state.add('main-menu', mainMenuState);
game.state.start('main-menu');