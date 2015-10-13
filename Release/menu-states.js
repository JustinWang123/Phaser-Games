/*global game, Phaser, kongregateAPI, menuState, SCREEN_WIDTH, SCREEN_HEIGHT, gameState, LARGE_WHITE_FONT, console, SKILL_DESC*/
'use strict';

var LARGE_BLACK_FONT = {font: '16px silkscreennormal', fill: '#202020' };
var LARGE_GREEN_FONT = {font: '16px silkscreennormal', fill: '#00ff00' };
var LARGE_RED_FONT = {font: '16px silkscreennormal', fill: '#ff0000' };
var SMALL_BLACK_FONT = {font: '14px silkscreennormal', fill: '#202020' };
var SMALL_RED_FONT = {font: '14px silkscreennormal', fill: '#ff0000' };
var LARGE_WHITE_FONT = {font: '16px silkscreennormal', fill: '#ffffff' };
var HUGE_RED_FONT = {font: '20px silkscreennormal', fill: '#ff0000' };
var HUGE_GREEN_FONT = {font: '20px silkscreennormal', fill: '#00ff00' };
var kongregate = null;

// MAIN_MENU_STATE:
// ************************************************************************************************
var mainMenuState = {
	// PRELOAD:
	// ************************************************************************************************
	preload: function () {
		
		
		// GAME ICONS:
        game.load.spritesheet('MapTileset', 'MapTileset.png', 24, 24);
		game.load.spritesheet('ColonyTileset', 'ColonyTileset.png', 70, 34);
		game.load.spritesheet('ProjectileTileset', 'ProjectileTileset.png', 16, 16);
		game.load.spritesheet('ItemIcons',	'ItemIcons.png', 24, 24);
		
        // HUD:
        game.load.image('HUD', 'HUD.png');
        game.load.image('ItemSlotSelect', 'ItemSlotSelect.png');
        game.load.spritesheet('BarFill', 'BarFill.png', 2, 10);
        game.load.spritesheet('Button', 'Button.png', 90, 17);
        game.load.image('Menu', 'Menu.png');
        game.load.image('LargeTitle', 'LargeTitle.png');
		game.load.image('MediumTitle', 'MediumTitle.png');
        game.load.image('TextBoxTop', 'TextBoxTop.png');
        game.load.image('TextBoxMid', 'TextBoxMid.png');
        game.load.image('TextBoxBottom', 'TextBoxBottom.png');
        game.load.spritesheet('LargeArrow', 'LargeArrow.png', 12, 22);
        game.load.spritesheet('SkillSlot', 'SkillSlot.png', 64, 24);
		game.load.spritesheet('SmallBarFill', 'SmallBarFill.png', 1, 2);
		game.load.image('Shield', 'Shield.png');
        game.load.image('WayPoint', 'WayPoint.png');
		game.load.spritesheet('MuteButton', 'MuteButton.png', 14, 14);
		
		// OFFICE MENU:
		game.load.image('Office', 'Office.png');
		game.load.image('CatalogueHighLight', 'CatalogueHighLight.png');
		game.load.image('MapHighLight', 'MapHighLight.png');
		game.load.image('CharacterHighLight', 'CharacterHighLight.png');
		game.load.image('DoorHighLight', 'DoorHighLight.png');
		game.load.image('ShipHighLight', 'ShipHighLight.png');
		game.load.image('ContractSlot', 'ContractSlot.png');
		game.load.image('ContractSlotSelect', 'ContractSlotSelect.png');
        game.load.image('ContractBoard', 'ContractBoard.png');
		
		// MAIN MENU:
		game.load.image('Title', 'Title.png');
		game.load.image('SaveSlot', 'SaveSlot.png');
		
		// SOUNDS:
		game.load.audio('Laser', 'Laser.mp3');
		game.load.audio('Plasma', 'Plasma.mp3');
		game.load.audio('MassDriver', 'MassDriver.mp3');
		game.load.audio('ShieldHit', 'ShieldHit.mp3');
		game.load.audio('HullHit', 'HullHit.mp3');
		game.load.audio('Explosion', 'Explosion.mp3');
		game.load.audio('Pickup', 'Pickup.mp3');
		game.load.audio('Beam', 'Beam.mp3');
		game.load.audio('ShieldUp', 'ShieldUp.mp3');
		
		gameState.laserSound = game.add.audio('Laser');
		gameState.plasmaSound = game.add.audio('Plasma');
		gameState.massDriverSound = game.add.audio('MassDriver');
		gameState.shieldHitSound = game.add.audio('ShieldHit');
		gameState.hullHitSound = game.add.audio('HullHit');
		gameState.explosionSound = game.add.audio('Explosion');
		gameState.pickUpSound = game.add.audio('Pickup');
		gameState.beamSound = game.add.audio('Beam');
		gameState.shieldUpSound = game.add.audio('ShieldUp');
		game.time.advancedTiming = true;
		
    },
	
	// CREATE:
	// ************************************************************************************************
	create: function () {
		var sprite, button, text, x, y, i, data, onComplete;
		
		// Callback function
		if (!kongregate) {
			onComplete = function () {
				// Set the global kongregate API object
				console.log('Kong API Loaded');
				kongregate = kongregateAPI.getAPI();
			};
			kongregateAPI.loadAPI(onComplete);
		}
		
		// Office Sprite:
		sprite = game.add.sprite(0, 0, 'Office');
		sprite.scale.setTo(2, 2);
		sprite.smoothed = false;
		
		// Title:
		sprite = game.add.sprite(SCREEN_WIDTH / 2 - 230, -10, 'Title');

		// Create Save Slot buttons:
		data = JSON.parse(localStorage.getItem('Player1'));
		x = 300;
		y = 440;
		button = gameState.createButton(x, y, 'SaveSlot', this.saveSlotClicked, this);
		button.slot = 1;

		if (data) {
			gameState.createText(x + 10, y + 10,
								 'Load Game:' +
								 '\nLevel: ' + data.level +
								 '\nNet Worth: ' + data.netWorth +
								 '\nCredits: ' + data.credits,
								 LARGE_WHITE_FONT);
		} else {
			gameState.createText(x + 48, y + 10, 'NEW GAME', LARGE_WHITE_FONT);
		}
		
		// Create new game button:
		if (data) {
			this.newGameButton = gameState.createButton(310, 556, 'Button', this.newGameClicked, this);
			this.newGameText = gameState.createText(350, 562, 'New Game', LARGE_WHITE_FONT);
			
			this.deleteButton = gameState.createButton(210, 556, 'Button', this.deleteClicked, this);
			this.deleteText = gameState.createText(240, 562, 'Delete Save?', LARGE_WHITE_FONT);
			this.cancelButton = gameState.createButton(410, 556, 'Button', this.cancelClicked, this);
			this.cancelText = gameState.createText(460, 562, 'Cancel', LARGE_WHITE_FONT);
			
			this.deleteButton.visible = false;
			this.deleteText.visible = false;
			this.cancelButton.visible = false;
			this.cancelText.visible = false;
		}
		
	},
	
	// UPDATE:
	// ************************************************************************************************
	update: function () {
		
	},
	
	saveSlotClicked: function (button) {
		var data;
		data = JSON.parse(localStorage.getItem('Player' + button.slot));
		menuState.saveSlot = button.slot;
		game.state.start('menu');
	},
	
	newGameClicked: function () {
		this.newGameButton.visible = false;
		this.newGameText.visible = false;
		this.deleteButton.visible = true;
		this.deleteText.visible = true;
		this.cancelButton.visible = true;
		this.cancelText.visible = true;
		
	},
	
	deleteClicked: function () {
		localStorage.clear();
		game.state.start('main-menu');
	},
	
	cancelClicked: function () {
		this.newGameButton.visible = true;
		this.newGameText.visible = true;
		this.deleteButton.visible = false;
		this.deleteText.visible = false;
		this.cancelButton.visible = false;
		this.cancelText.visible = false;
	}
};

// MENU_STATE:
// ************************************************************************************************
var menuState = {
	preload: function () {
		
	},
    
	// CREATE:
	// ************************************************************************************************
    create: function () {
		var data, sprite, text;
		
		// Create office sprites:
		gameState.createSprite(0, 0, 'Office');
		
		// Icons:
		this.catalogueHighLight = gameState.createSprite(94, 382, 'CatalogueHighLight');
		this.shipCatalogueHighLight = gameState.createSprite(114, 372, 'CatalogueHighLight');
		this.mapHighLight = gameState.createSprite(192, 240, 'MapHighLight');
		this.characterHighLight = gameState.createSprite(220, 360, 'CharacterHighLight');
		this.doorHighLight = gameState.createSprite(216, 70, 'DoorHighLight');
		this.shipHighLight = gameState.createSprite(370, 162, 'ShipHighLight');
		
		// Text:
		this.text = gameState.createText(10, SCREEN_HEIGHT - 20, 'TEXT', LARGE_WHITE_FONT);
		
		// Net Worth:
		this.netWorthText = gameState.createText(12, 10, 'NET WORTH: 100,000', LARGE_WHITE_FONT);
		
		// Credits:
		this.creditsText = gameState.createText(12, 40, 'CREDITS: 200', LARGE_WHITE_FONT);
		
		// Selected Contract:
		this.contractText = gameState.createText(580, 10, 'NONE', LARGE_WHITE_FONT);
		
		// Initiate vars:
		this.selectedIcon = 'none';
		this.gameState = 'GAME_STATE';
		this.iconText = {catalogue: 'Browse weapons catalogue.',
						 shipCatalogue: 'Browse equipment catalogue.',
						 character: 'View and train character skills.',
						 map: 'View the contract board and select next contract.',
						 ship: 'View ship cargo and hard points.',
						 door: 'Start contract.',
						 none: ''
						};
		
		
		this.iconFuncs = {catalogue: this.catalogueClicked,
						  shipCatalogue: this.shipCatalogueClicked,
						  character: this.characterClicked,
						  map: this.mapClicked,
						  ship: this.shipClicked,
						  door: this.doorClicked,
						  none: function () {}
						 };
		
		this.sectors = [{type: 'Wild',		level: 0, danger: 'low',		goal: 1500, netWorth: 0},
						{type: 'Trade',		level: 0, danger: 'low',		goal: 2000, netWorth: 3000},
						{type: 'Hostile',	level: 0, danger: 'mid',		goal: 2000, netWorth: 3000},
						{type: 'Wild',		level: 1, danger: 'mid',		goal: 5000, netWorth: 10000},
						{type: 'Trade',		level: 1, danger: 'mid',		goal: 5000, netWorth: 10000},
						{type: 'Hostile',	level: 1, danger: 'high',		goal: 5000, netWorth: 10000},
						{type: 'Wild',		level: 2, danger: 'high',		goal: 8000, netWorth: 35000},
						{type: 'Trade',		level: 2, danger: 'high',		goal: 8000, netWorth: 35000},
						{type: 'Hostile',	level: 2, danger: 'deadly',		goal: 8000, netWorth: 35000}
					   ];
		
		
			
		this.sectorColor = {Trade: 'rgb(0,255,0)',
							Wild: 'rgb(0,0,255)',
							Hostile: 'rgb(255,0,0)'
						   };
		
		// Create types:
		gameState.createItemTypes();
		gameState.createShipTypes();
		gameState.createColonyTypes();
		
		// Load or init player data:
		gameState.createPlayerShip({x: 0, y: 0});
		gameState.playerCharacter.sprite.visible = false;
		gameState.playerCharacter.shieldSprite.visible = false;
		this.selectedSectorIndex = -1;
		gameState.savePlayerShip();
		
		// Setup the catalogue colony:
		if (gameState.getPlayerNetWorth() < 10000) {
			gameState.sectorLevel = 0;
		} else if (gameState.getPlayerNetWorth() < 35000) {
			gameState.sectorLevel = 1;
		} else {
			gameState.sectorLevel = 2;
		}
		this.militaryColony = gameState.createColony({x: 0, y: 0}, {x: 0, y: 0}, 'Military', 'Store');
		this.shipYardColony = gameState.createColony({x: 0, y: 0}, {x: 0, y: 0}, 'Shipyard', 'Store');
		this.militaryColony.sprite.visible = false;
		this.shipYardColony.sprite.visible = false;
		
		// Create menus:
		gameState.createMenuStack();
		gameState.createTextMenu(180, 40);
		// Open text menu first time office is entered:
		if (gameState.getPlayerNetWorth() === 2940) {
			gameState.createText(12, 70, '1) Get a contract', LARGE_WHITE_FONT);
			gameState.createText(12, 100, '2) Launch Ship', LARGE_WHITE_FONT);
			gameState.createText(220, 240, '(1)', LARGE_WHITE_FONT);
			gameState.createText(340, 180, '(2)', LARGE_WHITE_FONT);
			
			gameState.textMenu.setTitle('Intro');
			gameState.textMenu.setText('Tired of the stability, security and relative prosperity of employment on earth, you have have founded STAR-CO, an independent space contracting company.\n\nYour goal is to complete various contracts and amass a fortune of 75000 credits.\n\nFrom the STAR-CO head office you can manage your character, setup your ship, and purchase equipment from the catalog.\n\nSelect a contract from the contract board and click the hanger door to launch.');
			gameState.textMenu.setButtons([{text: 'CLOSE', func: function () {gameState.menuStack.pop(); }}]);
			gameState.menuStack.push(gameState.textMenu);
		}
		menuState.createContractMenu();
		gameState.createInventoryMenu(false, 180, 40);
		gameState.createCharacterMenu(180, 40);
		
		gameState.createMerchantMenu(180, 40);
		
		
		
		
		
		if (gameState.getPlayerNetWorth() > 75000) {
			gameState.textMenu.setTitle('Victory!');
			text = 'Congratulations! you have successfully increased the net worth of SPACE-CO to 75,000 credits! ';
			text += 'During your way to victory you achieved the following:\n\n';
			text += '- You killed ' + gameState.playerCharacter.killCount + ' hostile ships.\n';
			text += '- You killed ' + gameState.playerCharacter.freighterKillCount + ' friendly freighters.\n';
			text += '- You explored ' + gameState.playerCharacter.exploredCount + ' map tiles.\n';
			text += '- You harvested ' + gameState.playerCharacter.harvestCount + ' asteroids.\n';
			text += '- You completed ' + gameState.playerCharacter.contractCount + ' contracts.\n';
			
			text += '\nYou can now retire and live out the rest of your life in luxury.';
			gameState.textMenu.setText(text);
			gameState.textMenu.setButtons([{text: 'CLOSE', func: function () {game.state.start('main-menu'); }}]);
			gameState.menuStack.push(gameState.textMenu);
		}
		this.shipPoly = new Phaser.Polygon(new Phaser.Point(360, 250), new Phaser.Point(506, 165), new Phaser.Point(750, 300), new Phaser.Point(520, 400));
		
	},
    
	// UPDATE:
	// ************************************************************************************************
    update: function () {
		if (this.gameState === 'GAME_STATE' && gameState.menuStack.head() === null) {
			// Selecting icon:
			
			// Mouse over catalogue:
			if (gameState.mouseInBox(94, 382, 94 + 36, 382 + 20)) {
				this.selectedIcon = 'catalogue';
			} else if (gameState.mouseInBox(114, 372, 114 + 36, 372 + 20)) {
				this.selectedIcon = 'shipCatalogue';
			
			// Mouse over character:
			} else if (gameState.mouseInBox(220, 360, 220 + 26, 360 + 92)) {
				this.selectedIcon = 'character';
				
			// Mouse over map:
			} else if (gameState.mouseInBox(192, 240, 192 + 72, 240 + 90)) {
				this.selectedIcon = 'map';
				
			// Mouse over ship:
			} else if (this.shipPoly.contains(game.input.activePointer.x, game.input.activePointer.y)) {
				this.selectedIcon = 'ship';
				
			// Mouse over door:
			} else if (gameState.mouseInBox(216, 70, 216 + 254, 70 + 188)) {
				this.selectedIcon = 'door';
			} else {
				this.selectedIcon = 'none';
			}
		} else {
			this.selectedIcon = 'none';
		}
		
		// Visibility of high lights:
		this.catalogueHighLight.visible = this.selectedIcon === 'catalogue' && gameState.menuStack.head() === null;
		this.shipCatalogueHighLight.visible = this.selectedIcon === 'shipCatalogue' && gameState.menuStack.head() === null;
		this.characterHighLight.visible = this.selectedIcon === 'character' && gameState.menuStack.head() === null;
		this.mapHighLight.visible = this.selectedIcon === 'map' && gameState.menuStack.head() === null;
		this.shipHighLight.visible = this.selectedIcon === 'ship' && gameState.menuStack.head() === null;
		this.doorHighLight.visible = this.selectedIcon === 'door' && gameState.menuStack.head() === null;
		
		// Clicking icons:
		if (game.input.activePointer.isDown && this.gameState === 'GAME_STATE' && gameState.menuStack.head() === null) {
			this.iconFuncs[this.selectedIcon]();
		}
		
		// Setting text:
		this.text.setText(this.iconText[this.selectedIcon]);
		//this.text.setText(game.input.activePointer.x + ', ' + game.input.activePointer.y);
		
		// Update credits text:
		this.creditsText.setText('CREDITS: ' + gameState.playerCharacter.credits);
		
		// Update net worth text:
		this.netWorthText.setText('NET WORTH: ' + gameState.getPlayerNetWorth() + '/75,000');
		
		// Update contract text:
		if (this.selectedSectorIndex >= 0) {
			this.contractText.setText('CONTRACT: ' + this.sectors[this.selectedSectorIndex].type + ' ' + (1 + this.sectors[this.selectedSectorIndex].level));
		} else {
			this.contractText.setText('CONTRACT: NONE');
		}
    },
	
	// CATALOGUE_CLICKED:
	// ************************************************************************************************
	catalogueClicked: function () {
		gameState.currentColony = menuState.militaryColony;
		gameState.menuStack.push(gameState.merchantMenu);
	},
	
	// SHIP_CATALOGUE_CLICKED:
	// ************************************************************************************************
	shipCatalogueClicked: function () {
		gameState.currentColony = menuState.shipYardColony;
		gameState.menuStack.push(gameState.merchantMenu);
	},
	
	// SHIP_CLICKED:
	// ************************************************************************************************
	shipClicked: function () {
		gameState.menuStack.push(gameState.inventoryMenu);
	},
	
	// CHARACTER_CLICKED:
	// ************************************************************************************************
	characterClicked: function () {
		gameState.menuStack.push(gameState.characterMenu);
	},
	
	// MAP_CLICKED:
	// ************************************************************************************************
	mapClicked: function () {
		menuState.contractMenu.open();
	},
	
	// DOOR_CLICKED:
	// ************************************************************************************************
	doorClicked: function () {
		var i, data;
		
		if (menuState.selectedSectorIndex >= 0) {
			gameState.sectorTypeName = menuState.sectors[menuState.selectedSectorIndex].type;
			gameState.sectorLevel = menuState.sectors[menuState.selectedSectorIndex].level;
			gameState.goalCredits = menuState.sectors[menuState.selectedSectorIndex].goal;
			gameState.savePlayerShip();

			game.state.start('game');
		}
	},
    
    // RENDER FUNCTION:
	// ************************************************************************************************
    render: function () {
        //game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
    },
	
	// CREATE_CONTRACT_MENU:
	// ************************************************************************************************
	createContractMenu: function () {
		var startX = 140,
			startY = 40,
			width = 520,
			height = 480,
			tileX,
			tileY,
			x,
			y,
			button;
		
		this.contractMenu = {};
		this.contractMenu.group = game.add.group();
		
		// Menu:
		gameState.createSprite(startX, startY, 'ContractBoard', this.contractMenu.group);
		
		// CONTRACT CLICKED:
		this.contractMenu.contractClicked = function (button) {
			menuState.selectedSectorIndex = button.slot;
			this.refresh();
		};
		
		// Create contract slots:
		for (x = 0; x < 3; x += 1) {
			for (y = 0; y < 3; y += 1) {
				if (gameState.getPlayerNetWorth() >= this.sectors[x + y * 3].netWorth) {
					tileX = startX + 20 + x * 170;
					tileY = startY + 8 + y * 146;
					button = gameState.createButton(tileX, tileY, 'ContractSlot', this.contractMenu.contractClicked, this.contractMenu, this.contractMenu.group);
					button.slot = x + y * 3;
					gameState.createText(tileX + 24, tileY + 10, 'CONTRACT', LARGE_BLACK_FONT, this.contractMenu.group);
					gameState.createText(tileX + 4, tileY + 40, 'TYPE: ' + this.sectors[x + y * 3].type, SMALL_BLACK_FONT, this.contractMenu.group);
					gameState.createText(tileX + 4, tileY + 70, 'DANGER: ' + this.sectors[x + y * 3].danger, SMALL_BLACK_FONT, this.contractMenu.group);
					gameState.createText(tileX + 4, tileY + 100, 'GOAL: ' + this.sectors[x + y * 3].goal, SMALL_BLACK_FONT, this.contractMenu.group);
				} else {
					tileX = startX + 20 + x * 170;
					tileY = startY + 8 + y * 146;
					gameState.createSprite(tileX, tileY, 'ContractSlot', this.contractMenu.group);
					gameState.createText(tileX + 36, tileY + 10, 'LOCKED', LARGE_RED_FONT, this.contractMenu.group);
					gameState.createText(tileX + 2, tileY + 40, this.sectors[x + y * 3].netWorth + ' networth', SMALL_RED_FONT, this.contractMenu.group);
				}
			}
		}
		
		// Create contract slot select:
		this.contractMenu.slotSelect = gameState.createSprite(0, 0, 'ContractSlotSelect', this.contractMenu.group);
		
		// OPEN:
		this.contractMenu.open = function () {
			this.refresh();
			menuState.gameState = 'MAP_STATE';
			this.group.visible = true;
		};
		
		// CLOSE:
		this.contractMenu.close = function () {
			menuState.gameState = 'GAME_STATE';
			this.group.visible = false;
		};
		
		// REFRESH:
		this.contractMenu.refresh = function () {
			var x = menuState.selectedSectorIndex % 3,
				y = Math.floor(menuState.selectedSectorIndex / 3),
				tileX = startX + 20 + x * 170,
				tileY = startY + 8 + y * 146;
			
			if (menuState.selectedSectorIndex >= 0) {
				this.slotSelect.visible = true;
				this.slotSelect.x = tileX - 2;
				this.slotSelect.y = tileY - 2;
			} else {
				this.slotSelect.visible = false;
			}
			
			
		};

		// BUTTONS:
		gameState.createTextButton(startX + width / 2, startY + 460, 'CLOSE', this.contractMenu.close, this.contractMenu, this.contractMenu.group);
	
		this.contractMenu.group.visible = false;
	}
};

var loseState = {
    preload: function () {
    },
    
    create: function () {
        var text, image, button;

        gameState.createTextButton(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 'menu', this.startClick, this);
        
        
        text = game.add.text(320, 140, gameState.deathText, LARGE_WHITE_FONT);
        text.anchor.set(0.5, 0.5);
    },
    
    update: function () {
        
    },
    
    startClick: function () {
        game.state.start('menu');
    }
};

var winState = {
    preload: function () {
    },
    
    create: function () {
        var text, image, button;

        gameState.createTextButton(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 'menu', this.startClick, this);
        
        
        text = game.add.text(320, 140, 'YOU RETRIEVED THE GOBLET OF YENDOR ', LARGE_WHITE_FONT);
        text.anchor.set(0.5, 0.5);
    },
    
    update: function () {
        
    },
    
    startClick: function () {
        game.state.start('menu');
    }
};