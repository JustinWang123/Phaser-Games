/*global game, console, gameState, PIRATE_DESPAWN_TICKS, DISTANCE_PER_FUEL, SECOND, TILE_SIZE, STANDARD_SELL_FACTOR, kongregate, menuState*/
'use strict';

var SPEED_SCALE_FACTOR = 10;
var SHIP_AGRO_RANGE = TILE_SIZE * 4;
var SHIP_UNAGRO_RANGE = TILE_SIZE * 12;
var SHIELD_REGEN_TIME = 8 * SECOND;
var REPAIR_TIME = 15 * SECOND;
var HARVEST_TIME = SECOND;
var CREATE_SMOKE_TIME = 10;
var BLACK_HOLE_DISTANCE = 3 * TILE_SIZE;
var BASE_FUEL_TANK_SIZE = 400;
var DROP_INVENTORY_PERCENT = 0.50;
var HELP_RANGE = 3 * TILE_SIZE;
var SHIP_STICK_RANGE = 4 * TILE_SIZE;

// CREATE_PLAYER_CHARACTER:
// ************************************************************************************************
gameState.createShipTypes = function () {
	var delta, i;
	
	// EXP Per Level:
	delta = 2000;
	this.expPerLevel = [0, 0];
	for (i = 0; i < 20; i += 1) {
		this.expPerLevel.push(this.expPerLevel[this.expPerLevel.length - 1] + delta);
		delta += 600;
		//console.log((this.expPerLevel.length - 1) + ': ' + this.expPerLevel[this.expPerLevel.length - 1]);
	}
	
	
	// Ship Types:
	this.shipTypes = {PlayerShip:		{name: 'PlayerShip',
										 niceName: 'PlayerShip',
										 frame: 128,
										 maxHp: 20,
										 maxShieldHp: 5,
										 defaultWeaponTypeNames: [],
										 defaultInventory: [],
										 cargoCap: 20,
										 speed: 16,
										 hasEngine: true,
										 stickRange: SHIP_STICK_RANGE},
					  Scavenger:		{name: 'Scavenger',
										 niceName: 'Scavenger',
										 frame: 134,
										 maxHp: 4,
										 maxShieldHp: 4,
										 defaultWeaponTypeNames: ['DroneLaser'],
										 defaultInventory: [{itemTypeName: 'Fuel', amount: 3}],
										 cargoCap: 10,
										 speed: 16,
										 exp: 100,
										 hasEngine: true,
										 stickRange: SHIP_STICK_RANGE},
					  
					  Mine:				{name: 'Mine',
										 niceName: 'Mine',
										 frame: 138,
										 maxHp: 8,
										 maxShieldHp: 0,
										 defaultWeaponTypeNames: [],
										 defaultInventory: [],
										 cargoCap: 10,
										 speed: 22,
										 exp: 100,
										 hasEngine: false,
										 stickRange: 0},
					  
                      LaserShip:		{name: 'LaserShip',
										 niceName: 'Laser Ship',
										 frame: 129,
										 maxHp: 16,
										 maxShieldHp: 4,
										 defaultWeaponTypeNames: ['LaserBeam', 'PlasmaCannon'],
										 defaultInventory: [{itemTypeName: 'Fuel', amount: 5}],
										 cargoCap: 20,
										 speed: 16,
										 exp: 400,
										 hasEngine: true,
										 stickRange: SHIP_STICK_RANGE},
					  
					  MissileShip:		{name: 'MissileShip',
										 niceName: 'Missile Ship',
										 frame: 130,
										 maxHp: 24,
										 maxShieldHp: 6,
										 defaultWeaponTypeNames: ['LaserBeam', 'LaserCannon', 'MissileLauncher'],
										 defaultInventory: [{itemTypeName: 'Fuel', amount: 5}],
										 cargoCap: 20,
										 speed: 16,
										 exp: 400,
										 hasEngine: true,
										 stickRange: SHIP_STICK_RANGE},
					  
					  GunShip:			{name: 'GunShip',
										 niceName: 'Gun Ship',
										 frame: 131,
										 maxHp: 32,
										 maxShieldHp: 8,
										 defaultWeaponTypeNames: ['MassDriver', 'MassDriver'],
										 defaultInventory: [{itemTypeName: 'Fuel', amount: 5}],
										 cargoCap: 20,
										 speed: 16,
										 exp: 500,
										 hasEngine: true,
										 stickRange: SHIP_STICK_RANGE},
					  
 
					  Freighter:	{name: 'Freighter',
									 niceName: 'Freighter',
									 frame: 132,
									 maxHp: 32,
									 maxShieldHp: 8,
									 defaultWeaponTypeNames: ['LaserBeam', 'PlasmaCannon', 'MassDriver'],
									 defaultInventory: [{itemTypeName: 'Fuel', amount: 10}],
									 cargoCap: 20,
									 speed: 10,
									 exp: 500,
									 hasEngine: true,
									 stickRange: SHIP_STICK_RANGE},
					  
					  Turret:		{name: 'Turret',
									 niceName: 'Turret',
									 frame: 137,
									 maxHp: 16,
									 maxShieldHp: 4,
									 defaultWeaponTypeNames: ['LaserCannon', 'MissileLauncher'],
									 defaultInventory: [],
									 cargoCap: 20,
									 speed: 0,
									 exp: 400,
									 hasEngine: false,
									 stickRange: SHIP_STICK_RANGE},
					  
					  TurretII:		{name: 'TurretII',
									 niceName: 'TurretII',
									 frame: 137,
									 maxHp: 24,
									 maxShieldHp: 6,
									 defaultWeaponTypeNames: ['LaserBeam', 'LaserCannon', 'MissileLauncher'],
									 defaultInventory: [],
									 cargoCap: 20,
									 speed: 0,
									 exp: 400,
									 hasEngine: false,
									 stickRange: SHIP_STICK_RANGE},
					  
					  TurretIII:		{name: 'TurretIII',
									 niceName: 'TurretIII',
									 frame: 137,
									 maxHp: 32,
									 maxShieldHp: 8,
									 defaultWeaponTypeNames: ['LaserBeam', 'LaserCannon', 'MissileLauncher'],
									 defaultInventory: [],
									 cargoCap: 20,
									 speed: 0,
									 exp: 400,
									 hasEngine: false,
									 stickRange: SHIP_STICK_RANGE},
					  
					  // Creatures:
					  IceFish:		{name: 'IceFish',
									 niceName: 'Ice Fish',
									 frame: 136,
									 maxHp: 8,
									 maxShieldHp: 0,
									 defaultWeaponTypeNames: ['IceCannon'],
									 defaultInventory: [{itemTypeName: 'Ice', amount: 5}],
									 cargoCap: 20,
									 speed: 16,
									 exp: 100,
									 hasEngine: false,
									 stickRange: SHIP_STICK_RANGE},
					  
					  Eel:			{name: 'Eel',
									 niceName: 'Eel',
									 frame: 133,
									 maxHp: 16,
									 maxShieldHp: 0,
									 defaultWeaponTypeNames: ['EelCannon'],
									 defaultInventory: [{itemTypeName: 'Meat', amount: 3}],
									 cargoCap: 10,
									 speed: 16,
									 exp: 200,
									 hasEngine: false,
									 stickRange: SHIP_STICK_RANGE},
					  
					  Crystal:		{name: 'Crystal',
									 niceName: 'Crystal',
									 frame: 135,
									 maxHp: 24,
									 maxShieldHp: 0,
									 defaultWeaponTypeNames: ['CrystalCannon'],
									 defaultInventory: [{itemTypeName: 'Crystal', amount: 2}],
									 cargoCap: 20,
									 speed: 16,
									 exp: 300,
									 hasEngine: false,
									 stickRange: SHIP_STICK_RANGE}
					 };
};

// CREATE_SHIP:
// ************************************************************************************************
gameState.createShip = function (tileIndex, typeName) {
	var ship = {}, i;
	   
	// Initial Attributes:
	ship.type = this.shipTypes[typeName];
	ship.isAlive = true;
	ship.tileIndex = {x: tileIndex.x, y: tileIndex.y};
	ship.destination = this.getPositionFromTileIndex(tileIndex);
	ship.targetShip = null;
    ship.cargoCap = ship.type.cargoCap;
	ship.speed = ship.type.speed;
	ship.velocity = {x: 0, y: 0};
	ship.hasAgroed = false;
	ship.hostile = true;
	
	if (typeName !== 'Mine') {
		ship.playerOffset = [{x: 48, y: 0}, {x: -48, y: 0}, {x: 0, y: 48}, {x: 0, y: -48}][game.rnd.integerInRange(0, 3)];
	} else {
		ship.playerOffset = {x: 0, y: 0};
	}
	
	if (gameState.tileMap) {
		this.getTile(tileIndex).ship = ship;
	}
	
	// Shield HP:
	ship.currentShieldHp = ship.maxShieldHp = ship.type.maxShieldHp;
	ship.currentHp = ship.maxHp = ship.type.maxHp;

	// Equipment and Inventory:
	ship.inventory = this.createInventory();
	ship.hardPoints = this.createHardPoints();
	
	// Add default hard points:
	for (i = 0; i < ship.type.defaultWeaponTypeNames.length; i += 1) {
		ship.hardPoints.addItem(ship.type.defaultWeaponTypeNames[i]);
	}
	
	// Add default inventory:
	for (i = 0; i < ship.type.defaultInventory.length; i += 1) {
		ship.inventory.addItem(ship.type.defaultInventory[i].itemTypeName, ship.type.defaultInventory[i].amount);
	}

	ship.weaponTypes = [];
	ship.coolDowns = [{current: 0, max: 1}, {current: 0, max: 1}, {current: 0, max: 1}, {current: 0, max: 1}];
	ship.autoFire = [false, false, false, false];
	ship.credits = 0;
	ship.fuel = BASE_FUEL_TANK_SIZE;
	ship.fuelTankSize = BASE_FUEL_TANK_SIZE;
	
	// Skills:
	ship.skills = {barter: 0, gunnery: 0, navigation: 0, logistics: 0, shields: 0, engineering: 0};
	
	// Timers:
	ship.hpRegenTime = 0;
	ship.shieldRegenTime = 0;
	ship.harvestTimer = 0;
	ship.smokeTimer = 0;
	
	// Sprite:
	ship.sprite = this.createSprite(this.getPositionFromTileIndex(tileIndex).x, this.getPositionFromTileIndex(tileIndex).y, 'MapTileset', this.characterSpritesGroup);
    //ship.sprite.smoothed = true;
	ship.sprite.anchor.setTo(0.5, 0.5);
	ship.sprite.frame = ship.type.frame;
	
	// Shield Sprite:
	ship.shieldSprite = this.createSprite(0, 0, 'Shield', this.characterSpriteGroup);
	ship.shieldSprite.anchor.setTo(0.5, 0.5);
	ship.shieldSprite.scale.setTo(1, 1);
	ship.sprite.addChild(ship.shieldSprite);
	
	// Engine Sprite:
	if (ship.type.hasEngine) {
		ship.flameSprite = this.createSprite(0, 10, 'MapTileset', this.characterSpriteGroup);
		ship.flameSprite.anchor.setTo(0.5, 0.5);
		ship.flameSprite.scale.setTo(1, 1);
		ship.sprite.addChild(ship.flameSprite);
		ship.flameSprite.frame = 142;
	}
	
	// Functions:
	ship.fireEngines = this.shipFireEngines;
	ship.chooseAction = this.shipChooseAction;
	ship.update = this.updateShip;
	ship.updateStats = this.updateShipStats;
	ship.enterTile = this.shipEnterTile;
	ship.takeDamage = this.shipTakeDamage;
	ship.repairDamage = this.shipRepairDamage;
	ship.fireAtShip = this.shipFireAtShip;
	ship.death = this.shipDeath;
	ship.updateShieldSprites = this.shipUpdateShieldSprites;
	ship.stopMovement = this.shipStopMovement;
	ship.gainAgro = this.shipGainAgro;
	ship.loseAgro = this.shipLoseAgro;
	ship.moveToTileIndex = this.shipMoveToTileIndex;
	
	ship.updateStats();
	
	if (this.characterList) {
		this.characterList.push(ship);
	}
	return ship;
};

// CREATE_PLAYER_SHIP:
// ************************************************************************************************
gameState.createPlayerShip = function (tileIndex) {
	var pc = this.createShip(tileIndex, 'PlayerShip'), i;
	this.playerCharacter = pc;
	
	this.loadPlayerShip();
	
	pc.jobs = [];
	pc.engineHold = 0;
	
	// Sprite:
	pc.harvestBarSprite = this.createSprite(0, 0, 'SmallBarFill');
	pc.harvestBarSprite.frame = 1;
	
	// Functions:
	pc.chooseAction = this.playerShipChooseAction;
	pc.enterTile = this.playerShipEnterTile;
	pc.gainExp = this.playerCharacterGainExp;
	pc.gainCredits = this.playerCharacterGainCredits;
	pc.death = this.playerShipDeath;
	pc.addJob = this.playerCharacterAddJob;
	pc.hasPackageTo = this.playerCharacterHasPackageTo;
	pc.gainAgro = function () {};
	pc.stopMovement = this.playerShipStopMovement;
	
	pc.updateStats();
	pc.currentHp = pc.maxHp;
	pc.currentShieldHp = pc.maxShieldHp;
	
	
};

// CREATE_FREIGHTER_SHIP:
// ************************************************************************************************
gameState.createFreighterShip = function (colony) {
	var ship = gameState.createShip(colony.tileIndex, 'Freighter');
	
	// Initial Attributes:
	ship.destColony = colony;
	ship.hostile = false;
	
	// Functions:
	ship.chooseDestColony = this.freighterChooseDestColony;
	
	return ship;
};

// UPDATE_SHIP_STATS:
// ***********************************************************************************************
gameState.updateShipStats = function () {
	var i;
	
	// Base stats:
	this.maxHp = this.type.maxHp + this.skills.engineering * 5;
	this.maxShieldHp = this.type.maxShieldHp + this.skills.shields;
	this.speedStat = this.type.speed + this.skills.navigation;
	this.cargoCap = this.type.cargoCap + this.skills.logistics * 2;
	this.fuelTankSize = BASE_FUEL_TANK_SIZE + this.skills.navigation * 25;
	
	// Apply passive effect from hard points:
	for (i = 0; i < this.hardPoints.length; i += 1) {
		if (gameState.itemTypes[this.hardPoints[i].itemTypeName].passiveEffect) {
			gameState.itemTypes[this.hardPoints[i].itemTypeName].passiveEffect(this, gameState.itemTypes[this.hardPoints[i].itemTypeName]);
		}
	}
	
	// Weapon Types:
	this.weaponTypes = [];
	for (i = 0; i < this.hardPoints.length; i += 1) {
		if (gameState.itemTypes[this.hardPoints[i].itemTypeName].effect) {
			this.weaponTypes.push(gameState.itemTypes[this.hardPoints[i].itemTypeName]);
			
			if (this.weaponTypes.length === 4) {
				break;
			}
		}
	}
	
	// Out of fuel:
	if (this.type.hasEngine && this.fuel <= 0) {
		this.speedStat = this.speedStat / 2;
	}
	
	// Over Weight:
	if (this.inventory.getWeight() > this.cargoCap) {
		this.speedStat = 0;
	}
	
	// Cap Health:
	this.currentHp = this.currentHp > this.maxHp ? this.maxHp : this.currentHp;
	this.currentShieldHp = this.currentShieldHp > this.maxShieldHp ? this.maxShieldHp : this.currentShieldHp;
	
	// Set speed:
	this.speed = this.speedStat / 16;
};

// UPDATE_SHIP:
// ************************************************************************************************
gameState.updateShip = function () {
	var normalToDest,
		newPosition,
		currentTileIndex,
		velocityNormal,
		i,
		acceleration,
		distance,
		speed,
		currentTile;
	
	// Friction
	if (gameState.getDistance({x: 0, y: 0}, this.velocity) < this.speed / 2) {
		this.velocity.x *= 0.99;
		this.velocity.y *= 0.99;
	}
	
	// Black Hole:
	for (i = 0; i < gameState.blackHoleList.length; i += 1) {
		distance = gameState.getDistance(this.sprite.position, gameState.blackHoleList[i].sprite.position);
		if (distance < BLACK_HOLE_DISTANCE) {
			normalToDest = gameState.getNormal(this.sprite.position, gameState.blackHoleList[i].sprite.position);
			this.velocity.x += normalToDest.x * 0.03 * (BLACK_HOLE_DISTANCE / (BLACK_HOLE_DISTANCE + distance));
			this.velocity.y += normalToDest.y * 0.03 * (BLACK_HOLE_DISTANCE / (BLACK_HOLE_DISTANCE + distance));
		}
		if (distance < 32 && game.rnd.frac() < 0.05) {
			this.takeDamage(1, 'hull', 'pass');
		}
	}
	
	// Cap velocity:
	velocityNormal = gameState.getNormal({x: 0, y: 0}, this.velocity);
	if (gameState.getDistance({x: 0, y: 0}, this.velocity) > this.speed) {
		this.velocity.x = velocityNormal.x * this.speed;
		this.velocity.y = velocityNormal.y * this.speed;
	}
	
	// Apply velocity:
	if (gameState.isTileIndexPassable(gameState.getTileIndexFromPosition({x: this.sprite.x + this.velocity.x + velocityNormal.x * 10,
																		  y: this.sprite.y + this.velocity.y + velocityNormal.y * 10}))
			|| gameState.isTileIndexPassable(gameState.getTileIndexFromPosition({x: this.sprite.x + this.velocity.x + velocityNormal.x * 40,
																				 y: this.sprite.y + this.velocity.y + velocityNormal.y * 40}))) {
		this.sprite.x += this.velocity.x;
		this.sprite.y += this.velocity.y;
		
	// Crash into wall:
	} else {
		speed = gameState.getDistance({x: 0, y: 0}, this.velocity);
		if (Math.floor(speed) > 0) {
			this.takeDamage(Math.floor(speed), 'default');
		}
		this.velocity.x = -this.velocity.x / 2;
		this.velocity.y = -this.velocity.y / 2;
	}
	
	// Tile Index Update:
	currentTileIndex = gameState.getTileIndexFromPosition(this.sprite.position);
	if (!gameState.vectorEqual(currentTileIndex, this.tileIndex)) {
		this.enterTile(currentTileIndex);
	}
	currentTile = gameState.getTile(currentTileIndex);
	
	// Harvesting:
	if (this === gameState.playerCharacter && currentTile.type.harvestable) {
		this.harvestTimer += 1;
		
		// Harvest Timer Complete:
		if (this.harvestTimer === HARVEST_TIME) {
			this.harvestTimer = 0;
			
			// Room in cargo:
			if (this.inventory.getWeight() < this.cargoCap) {
				this.harvestCount += 1;
				
				// Spawning Ice Fish:
				if (currentTile.type.spawn && game.rnd.frac() < 0.10) {
					gameState.createShip(currentTileIndex, currentTile.type.spawn);
					gameState.createDamageText(this.sprite.x, this.sprite.y - 12, 'AMBUSHED!', '#ff0000');
				} else {
					gameState.createDamageText(this.sprite.x, this.sprite.y - 12, 'Harvested ' + currentTile.type.amount + ' x ' + currentTile.type.loot, '#ffffff');
				}
				this.inventory.addItem(currentTile.type.loot, currentTile.type.amount);
				gameState.pickUpSound.play();
				gameState.setTileType(currentTileIndex, gameState.tileTypes.Space);
			
			// Cargo Full:
			} else {
				gameState.createDamageText(this.sprite.x, this.sprite.y - 12, 'Cargo Full', '#ffffff');
			}
		}
		
		// Show Harvest Bar:
		if (this.harvestBarSprite) {
			this.harvestBarSprite.visible = true;
			this.harvestBarSprite.x = this.sprite.x - 30;
			this.harvestBarSprite.y = this.sprite.y - 30;
			this.harvestBarSprite.scale.setTo(60 * (this.harvestTimer / HARVEST_TIME), 2);
		}
		
	} else {
		this.harvestTimer = 0;
		
		if (this.harvestBarSprite) {
			this.harvestBarSprite.visible = false;
		}
	}
	
	// Cooldown:
	for (i = 0; i < 4; i += 1) {
		if (this.coolDowns[i].current > 0) {
			this.coolDowns[i].current -= 1;
		}
	}
	
	// Regen Shields:
	if (this.shieldRegenTime > 0) {
		this.shieldRegenTime -= 1;
		if (this.shieldRegenTime <= 0) {
			this.currentShieldHp = this.maxShieldHp;
			
			if (this === gameState.playerCharacter) {
				gameState.shieldUpSound.play();
			}
		}
	}
	
	// Show shield sprite:
	if (this.currentShieldHp > 0) {
		this.shieldSprite.visible = true;
	} else {
		this.shieldSprite.visible = false;
	}
	
	// Lose Target:
	if (this.targetShip && gameState.getDistance(this.tileIndex, this.targetShip.tileIndex) >= 9) {
		this.targetShip = null;
	}
	
	// Update Stats:
	this.updateStats();
};

// FREIGHTER_CHOOSE_DEST_COLONY
// ***********************************************************************************************
gameState.freighterChooseDestColony = function () {
	var list = [],
		index = this.destColony.coloniesMapIndex;
	
	if (index.x > 0 && gameState.coloniesMap[index.x - 1][index.y]) {
		list.push(gameState.coloniesMap[index.x - 1][index.y]);
	}
	if (index.y > 0 && gameState.coloniesMap[index.x][index.y - 1]) {
		list.push(gameState.coloniesMap[index.x][index.y - 1]);
	}
	if (index.x < gameState.numRegions - 1 && gameState.coloniesMap[index.x + 1][index.y]) {
		list.push(gameState.coloniesMap[index.x + 1][index.y]);
	}
	if (index.y < gameState.numRegions - 1 && gameState.coloniesMap[index.x][index.y + 1]) {
		list.push(gameState.coloniesMap[index.x][index.y + 1]);
	}
	
	//console.log(list);
	this.destColony = gameState.randElem(list);
	this.destination = gameState.getPositionFromTileIndex(this.destColony.tileIndex);
};

// PLAYER_SHIP_CHOOSE_ACTION:
// ***********************************************************************************************
gameState.playerShipChooseAction = function () {
	var normalToDest,
		acceleration = 0.035,
		canFire,
		text,
		i;
	
	// Acceleration:
	if (this.flameSprite) {
		this.flameSprite.visible = false;
	}
	if (game.input.activePointer.isDown && gameState.isPointerInWorld()) {
		normalToDest = gameState.getNormal(this.sprite.position, gameState.getPointerWorldPosition());
		this.fireEngines(normalToDest);
		this.engineHold += 1;
	} else {
		this.engineHold = 0;
	}
	
	if (this.engineHold > 5 * SECOND && this.fuelHelp) {
		this.fuelHelp = false;
		gameState.textMenu.setTitle('Conserving Fuel');
		gameState.textMenu.setText('To conserve fuel try to use short quick bursts of thrust rather than holding down the mouse button.\n\nBy allowing your ship to drift and firing your engines only when you need to change directions you can vastly increase your fuel efficiency');
		gameState.textMenu.setButtons([{text: 'CLOSE', func: function () { gameState.menuStack.pop(); }}]);
		gameState.menuStack.push(gameState.textMenu);
	}
	
	// CAN_FIRE:
	canFire = function (weaponSlot) {
		var pc = gameState.playerCharacter,
			weaponType = pc.weaponTypes[weaponSlot];
		if (weaponSlot >= pc.weaponTypes.length) {
			return false;
		} else if (weaponType.requiresTarget) {
			return pc.targetShip
				&& pc.weaponTypes.length >= (weaponSlot + 1)
				&& pc.coolDowns[weaponSlot].current === 0
				&& gameState.getDistance(pc.sprite.position, pc.targetShip.sprite.position) < weaponType.range;
			
		} else {
			return pc.weaponTypes.length >= (weaponSlot + 1)
				&& pc.coolDowns[weaponSlot].current === 0;
		}
	};

	// Firing:
	if (gameState.keys.one.isDown && canFire(0)) {
		this.fireAtShip(this.targetShip, 0);
	}
	if (gameState.keys.two.isDown && canFire(1)) {
		this.fireAtShip(this.targetShip, 1);
	}
	if (gameState.keys.three.isDown && canFire(2)) {
		this.fireAtShip(this.targetShip, 2);
	}
	if (gameState.keys.four.isDown && canFire(3)) {
		this.fireAtShip(this.targetShip, 3);
	}
	
	if (this.targetShip && this.targetShip.hasAgroed) {
		for (i = 0; i < this.weaponTypes.length; i += 1) {
			if (this.autoFire[i] && canFire(i)) {
				this.fireAtShip(this.targetShip, i);
			}
		}
	}
	
	// Get target:
	if (!this.targetShip && gameState.agroedShipsList.length > 0) {
		this.targetShip = gameState.agroedShipsList[0];
		
		if (this.combatHelp) {
			this.combatHelp = false;
			gameState.textMenu.setTitle('COMBAT');
			text = 'You have been spotted by a hostile ship!\n\n';
			text += 'Your ship has automatically targeted your enemy. You can change your target at any time by clicking on another ship.\n\n';
			text += 'Click the 1,2,3,4 keys on your keyboard to fire your weapons.\n\n';
			text += 'Try to dodge the enemies projectiles and keep an eye on your hit points and shields';
			gameState.textMenu.setText(text);
			gameState.textMenu.setButtons([{text: 'CLOSE', func: function () { gameState.menuStack.pop(); }}]);
			gameState.menuStack.push(gameState.textMenu);
		}
	}
};



// SHIP_CHOOSE_ACTION:
// ***********************************************************************************************
gameState.shipChooseAction = function () {
	var i,
		hostileShip = gameState.playerCharacter,
		weaponType,
		normalToDest;
	
	if (this.hardPoints.length > 0) {
		weaponType = gameState.itemTypes[this.hardPoints[0].itemTypeName];
	} else {
		weaponType = null;
	}
	
	// Gaining agro:
	if (this.hostile && !this.hasAgroed && gameState.getDistance(this.sprite.position, hostileShip.sprite.position) < SHIP_AGRO_RANGE) {
		this.gainAgro();
	}
	
	// Acting with agro:
	if (this.hasAgroed) {
		
		// Losing agro:
		if (gameState.getDistance(this.sprite.position, hostileShip.sprite.position) > SHIP_UNAGRO_RANGE) {
			this.loseAgro();
		}
		
		// Moving towards the player:
		if (gameState.getDistance(this.sprite.position, hostileShip.sprite.position) > this.type.stickRange) {
			normalToDest = gameState.getNormal(this.sprite.position,
											   {x: hostileShip.sprite.x + this.playerOffset.x,
												y: hostileShip.sprite.y + this.playerOffset.y});
		}

		// Mines exploding:
		if (this.type.name === 'Mine' && gameState.getDistance(this.sprite.position, hostileShip.sprite.position) < 28) {
			hostileShip.takeDamage(4, 'default');
			this.death();
		}
		
		// Attacking with weapons if in range:
		for (i = 0; i < this.weaponTypes.length; i += 1) {
			weaponType = this.weaponTypes[i];
			if (gameState.getDistance(hostileShip.sprite.position, this.sprite.position) < weaponType.range
					&& this.coolDowns[i].current === 0
					&& gameState.isRayClear(this.sprite.position, hostileShip.sprite.position)) {
				this.targetShip = hostileShip;
				this.fireAtShip(this.targetShip, i);
			}
		}
		
	// Acting without agro:
	} else {
		// Moving towards destination:
		if (gameState.getDistance(this.sprite.position, this.destination) > 10) {
			normalToDest = gameState.getNormal(this.sprite.position, this.destination);
		} else if (this.type.name === 'Freighter' && gameState.getDistance({x: 0, y: 0}, this.velocity) < 0.1) {
			this.hp = this.maxHp;
			this.inventory.removeAllItems();
			this.inventory.addItem('Fuel', 10);
			this.inventory.addItem(gameState.randElem(this.destColony.type.sells[gameState.sectorLevel]).itemTypeName, 5);
			this.chooseDestColony();
		}
	}
		
	// Moving away from black holes:
	for (i = 0; i < gameState.blackHoleList.length; i += 1) {
		if (gameState.getDistance(this.sprite.position, gameState.blackHoleList[i].sprite.position) < BLACK_HOLE_DISTANCE + TILE_SIZE / 2) {
			normalToDest = gameState.getNormal(gameState.blackHoleList[i].sprite.position, this.sprite.position);
		}
	}
	
	// Firing engines:
	if (this.flameSprite) {
		this.flameSprite.visible = false;
	}
	
	if (normalToDest) {
		this.fireEngines(normalToDest);
	} else if (!this.hasAgroed) {
		this.stopMovement();
	}
	
	
};

// SHIP_FIRE_ENGINES:
// ***********************************************************************************************
gameState.shipFireEngines = function (normal) {
	var acceleration = 0.035;
	
	this.velocity.x += normal.x * acceleration;
	this.velocity.y += normal.y * acceleration;
	this.sprite.rotation = gameState.angleToFace({x: 0, y: 0}, normal);
	
	if (this.flameSprite) {
		this.flameSprite.visible = true;
	}
	
	
	// Create smoke:
	if (this.type.hasEngine && this.smokeTimer === CREATE_SMOKE_TIME) {
		gameState.createSmoke({x: this.sprite.x - normal.x * 34, y: this.sprite.y - normal.y * 34},
							  {x: -normal.x, y: -normal.y},
							  this.sprite.rotation,
							  'Smoke');
		this.smokeTimer = 0;
	} else {
		this.smokeTimer += 1;
	}
	
	if (this.type.hasEngine && this.fuel <= 1 && this.inventory.countItem('Fuel') > 0) {
		this.fuel = this.fuelTankSize;
		this.inventory.removeItem('Fuel', 1);
	} else if (this.fuel > 0) {
		this.fuel -= 1;
	}
	
	if (this.inventory.getWeight() > this.cargoCap) {
		if (this === gameState.playerCharacter && this.cargoHelp) {
			this.cargoHelp = false;
			gameState.textMenu.setTitle('Over Weight');
			gameState.textMenu.setText('You have exceeded your ships cargo capacity and are now unable to move.\n\nDrop some items from your inventory to reduce your weight.');
			gameState.textMenu.setButtons([{text: 'CLOSE', func: function () { gameState.menuStack.pop(); }}]);
			gameState.menuStack.push(gameState.textMenu);
		}
	}
};

// SHIP_ENTER_TILE:
// ************************************************************************************************
gameState.shipEnterTile = function (tileIndex) {
	var speed;
	
	// Remove from previous tileIndex:
	gameState.getTile(this.tileIndex).ship = null;
	
	// Update tileIndex:
	this.tileIndex = tileIndex;
	
	// Add to new tileIndex:
	gameState.getTile(tileIndex).ship = this;
};

// PLAYER_SHIP_ENTER_TILE:
// ************************************************************************************************
gameState.playerShipEnterTile = function (tileIndex) {
	var items, i, colony, speed, space;
	
	// Remove from previous tileIndex:
	gameState.getTile(this.tileIndex).ship = null;
	
	// Update tileIndex:
	this.tileIndex = tileIndex;
	
	// Add to new tileIndex:
	gameState.getTile(tileIndex).ship = this;
	
	// Update FoV:
	gameState.updateFoV();
	
	// Enter colony:
	colony = gameState.getTile(tileIndex).colony;
	if (colony && colony.type.name !== 'Gate') {
		// Enter colony:
		gameState.currentColony = colony;
		gameState.menuStack.push(gameState.colonyMenu);
		this.stopMovement();
		gameState.completeJobs(colony);
	}
	
	// Encounters:
	if (gameState.getTile(tileIndex).encounter && gameState.getTile(tileIndex).encounter.type.name !== 'BlackHole' && gameState.getTile(tileIndex).encounter.type.name !== 'Pulser') {
		gameState.currentEncounter = gameState.getTile(tileIndex).encounter;
		gameState.menuStack.push(gameState.encounterMenu);
		this.stopMovement();
	}
	
	// Pick up items:
	items = gameState.getTile(tileIndex).items;
    if (items.length > 0) {
		
        // Counting backwards because items are being removed from list:
        for (i = items.length - 1; i >= 0; i -= 1) {
			space = this.cargoCap - this.inventory.getWeight();
			if (space >= items[i].amount) {
				this.inventory.addItem(items[i].type.name, items[i].amount);
				gameState.createDamageText(this.sprite.x, this.sprite.y - 12, items[i].amount + ' x ' + items[i].type.niceName, '#ffffff');
				gameState.destroyItem(items[i]);
			} else if (space > 0) {
				gameState.createDamageText(this.sprite.x, this.sprite.y - 12, space + ' x ' + items[i].type.niceName, '#ffffff');
				this.inventory.addItem(items[i].type.name, space);
				items[i].amount -= space;
			}
        }
		gameState.pickUpSound.play();
    }
	
	// Damage from asteroids:
	speed = gameState.getDistance({x: 0, y: 0}, this.velocity);
	if (gameState.getTile(tileIndex).type.damages) {
		if (game.rnd.integerInRange(0, 100) < (speed * 40) - (this.skills.navigation * 10)) {
			this.takeDamage(1, 'default');
		}
	}
};

gameState.completeJobs = function (colony) {
	var pc = gameState.playerCharacter, i, jobCompleted = false, text = '';
	
	// Check if job can be completed:
	for (i = pc.jobs.length - 1; i > -1; i -= 1) {
		if (pc.jobs[i].typeName === 'Delivery' && pc.jobs[i].colonyName === colony.name) {
			text += 'You delivered the package for ' + pc.jobs[i].reward + ' credits.\n\n';
			gameState.playerCharacterGainCredits(pc.jobs[i].reward);
			pc.jobs.splice(i, 1);
			pc.inventory.removeItem('Package', 1);
			jobCompleted = true;
		}
	}
	
	if (jobCompleted) {
		gameState.textMenu.setTitle('Package Delivered');
		gameState.textMenu.setText(text);
		gameState.textMenu.setButtons([{text: 'CLOSE', func: function () { gameState.menuStack.pop(); }}]);
		gameState.menuStack.push(gameState.textMenu);
	}
};

// SHIP_FIRE_AT_POSITION:
// ************************************************************************************************
gameState.shipFireAtShip = function (targetShip, weaponSlot) {
	var i, weaponType = this.weaponTypes[weaponSlot];

	if (this.coolDowns[weaponSlot].current <= 0) {
		weaponType.effect(targetShip, weaponType, this);
		this.coolDowns[weaponSlot].current = weaponType.coolDown - this.skills.gunnery * 10;
		this.coolDowns[weaponSlot].max = weaponType.coolDown - this.skills.gunnery * 10;
		
		for (i = 0; i < this.weaponTypes.length; i += 1) {
			if (this.coolDowns[i].current < SECOND) {
				this.coolDowns[i].current = SECOND - this.skills.gunnery * 10;
				this.coolDowns[i].max = SECOND - this.skills.gunnery * 10;
			}
		}
	}
};

// SHIP_REPAIR_DAMAGE:
// ************************************************************************************************
gameState.shipRepairDamage = function (amount) {
	this.currentHp += amount;
	
	if (this.currentHp > this.maxHp) {
		this.currentHp = this.maxHp;
	}
	
};

// SHIP_TAKE_DAMAGE:
// ************************************************************************************************
gameState.shipTakeDamage = function (amount, ignoreShields) {
	
	if (!this.isAlive) {
		return;
	}
	
	if (this.currentShieldHp > 0 && ignoreShields === 'block') {
		gameState.createDamageText(this.sprite.x, this.sprite.y - 16, 'BLOCKED', '#0f0');
		return;
	}
	
	// Shields absorb damage:
	if (this.currentShieldHp > 0 && ignoreShields === 'default') {
		gameState.shieldHitSound.play();
		
		// Complete absorb:
		if (this.currentShieldHp > amount) {
			this.currentShieldHp -= amount;
			gameState.createDamageText(this.sprite.x, this.sprite.y - 24, '-' + amount, '#0f0');
			amount = 0;
			this.shieldRegenTime = SHIELD_REGEN_TIME - this.skills.shields * 20;
		// Shield destroyed:
		} else {
			
			amount -= this.currentShieldHp;
			gameState.createDamageText(this.sprite.x, this.sprite.y - 24, '-' + this.currentShieldHp, '#0f0');
			this.shieldRegenTime = SHIELD_REGEN_TIME - this.skills.shields * 20;
			this.currentShieldHp = 0;
			
		}
	}


	// System takes remaining damage:
    if (amount > 0) {
        this.currentHp -= amount;
		gameState.hullHitSound.play();
		
		gameState.createFire(this.sprite.position);
		
        // Create damage text:
        gameState.createDamageText(this.sprite.x, this.sprite.y - 24, '-' + amount, '#ff0000');

		// Death:
        if (this.currentHp <= 0) {
			this.death();
        }
    }
};

// PLAYER_SHIP_DEATH:
// ************************************************************************************************
gameState.playerShipDeath = function () {
	// Create fire:
	gameState.createFire(this.sprite.position);
	gameState.explosionSound.play();
	
	this.isAlive = false;
	this.sprite.destroy();
    this.shieldSprite.destroy();
	gameState.HUD.screenHpText.visible = false;
	gameState.HUD.shieldHpText.visible = false;
	gameState.deathTimer = 2 * SECOND;
};


// SHIP_DEATH:
// ************************************************************************************************
gameState.shipDeath = function () {
	var loot, pc = gameState.playerCharacter, i;
	
	// Create fire:
	gameState.createFire(this.sprite.position);
	gameState.explosionSound.play();
	
	// Updating stats:
	pc.killCount += 1;
	
	if (this.type.name === 'Freighter') {
		pc.freighterKillCount += 1;
	}
	
	this.isAlive = false;
    this.sprite.destroy();
    this.shieldSprite.destroy();
	this.loseAgro();
	gameState.getTile(this.tileIndex).ship = null;
	
	if (gameState.getDistance(this.sprite.position, pc.sprite.position) < 600) {
		// Player Gain exp:
		pc.gainExp(this.type.exp);

		if (gameState.sectorTypeName === 'Hostile') {
			gameState.playerCharacterGainCredits(Math.floor(this.type.exp * gameState.hostileSectorKillReward[gameState.sectorLevel]));
			gameState.testObjective();
		}
		
		
		
		if (pc.targetShip === this) {
			pc.targetShip = null;
		}

		// Drop inventory:
		if (gameState.isTileIndexPassable(this.tileIndex)) {
			for (i = 0; i < this.inventory.length; i += 1) {
				if ((gameState.itemTypes[this.inventory[i].itemTypeName].dropable && game.rnd.frac() < DROP_INVENTORY_PERCENT)) {
					gameState.createItem(this.tileIndex, this.inventory[i].itemTypeName, game.rnd.integerInRange(1, this.inventory[i].amount));
				}
			}
		}
	}
};

// PLAYER_CHARACTER_GAIN_EXP:
// ************************************************************************************************
gameState.playerCharacterGainExp = function (amount) {
    var pc = gameState.playerCharacter;
    
    pc.exp += amount;
    
    if (pc.exp >= gameState.expPerLevel[pc.level + 1]) {
        pc.level += 1;
        gameState.createDamageText(gameState.getPositionFromTileIndex(pc.tileIndex).x,
                                   gameState.getPositionFromTileIndex(pc.tileIndex).y - 12, 'LEVEL UP', '#ffff00');
        pc.skillPoints += 1;
		
		if (pc.level === 2) {
			gameState.textMenu.setTitle('Level Up');
			gameState.textMenu.setText('You have gained your first experience level and have been awarded a skill point.\n\nTo select a skill to train, open the character menu (bottom right).');
			gameState.textMenu.setButtons([{text: 'CLOSE', func: function () { gameState.menuStack.pop(); }}]);
			gameState.menuStack.push(gameState.textMenu);
		}
    }
};

// PLAYER_CHARACTER_GAIN_EXP:
// ************************************************************************************************
gameState.playerCharacterGainCredits = function (amount) {
	var pc = gameState.playerCharacter;
    
	pc.credits += amount;
	
	gameState.testObjective();
};

// PLAYER_CHARACTER_ADD_JOB:
// ************************************************************************************************
gameState.playerCharacterAddJob = function (job) {
	this.jobs.push(job);
};

// PLAYER_CHARACTER_HAS_PACKAGE_TO:
// ************************************************************************************************
gameState.playerCharacterHasPackageTo = function (colony) {
	var i;
	
	for (i = 0; i < this.jobs.length; i += 1) {
		if (this.jobs[i].typeName === 'Delivery' && this.jobs[i].colonyName === colony.name) {
			return true;
		}
	}
	
	return false;
};

// GET_SHIP_AT_POSITION:
// ************************************************************************************************
gameState.getShipAtPosition = function (position) {
	var i;
	for (i = 0; i < this.characterList.length; i += 1) {
		if (this.characterList[i].isAlive && this.getDistance(position, this.characterList[i].sprite.position) < 36) {
			return this.characterList[i];
		}
	}
	return null;
};

// SHIP_STOP_MOVEMENT:
// ************************************************************************************************
gameState.shipStopMovement = function () {
	var speed, normal;
	
	speed = gameState.getDistance({x: 0, y: 0}, this.velocity);
	
	if (speed > 0.05) {
		normal = gameState.getNormal({x: 0, y: 0}, this.velocity);
		this.fireEngines({x: -normal.x, y: -normal.y});
	}
};

// SHIP_GAIN_AGRO:
// ************************************************************************************************
gameState.shipGainAgro = function () {
	var i;
	if (!this.hasAgroed) {
		this.hasAgroed = true;

		// Call for help:
		for (i = 0; i < gameState.characterList.length; i += 1) {
			if (gameState.characterList[i].isAlive
					&& !gameState.characterList[i].hasAgroed
					&& gameState.characterList[i].hostile === this.hostile
					&& gameState.getDistance(this.sprite.position, gameState.characterList[i].sprite.position) < HELP_RANGE) {
				gameState.characterList[i].gainAgro();
			}
		}

		gameState.agroedShipsList.push(this);
	}
};

// SHIP_LOSE_AGRO:
// ************************************************************************************************
gameState.shipLoseAgro = function () {
	this.hasAgroed = false;
	gameState.removeFromArray(this, gameState.agroedShipsList);
};

// DESTROY_ALL_SHIPS:
// ************************************************************************************************
gameState.destroyAllShips = function () {
	var i, pc = gameState.playerCharacter;
	
	for (i = 0; i < this.characterList.length; i += 1) {
		if (this.characterList[i] !== pc) {
			this.characterList[i].sprite.destroy();
			this.characterList[i].shieldSprite.destroy();
		}
	}
	
	this.characterList = [pc];
	
};

// SHIP_MOVE_TO_TILE_INDEX:
// ************************************************************************************************
gameState.shipMoveToTileIndex = function (tileIndex) {
	// Remove from previous tile:
	gameState.getTile(tileIndex).ship = null;
	
	this.tileIndex = {x: tileIndex.x, y: tileIndex.y};
	this.sprite.x = gameState.getPositionFromTileIndex(tileIndex).x;
	this.sprite.y = gameState.getPositionFromTileIndex(tileIndex).y;
	
	gameState.getTile(tileIndex).ship = this;
};

// PLAYER_SHIP_STOP_MOVEMENT:
// ************************************************************************************************
gameState.playerShipStopMovement = function () {
	this.velocity.x = 0;
	this.velocity.y = 0;
};

// GET_PLAYER_NET_WORTH:
// ************************************************************************************************
gameState.getPlayerNetWorth = function () {
	var pc = gameState.playerCharacter;
	return pc.credits + pc.inventory.calculateValue() + pc.hardPoints.calculateValue();
};

// GET_PLAYER_EXPLORED_PERCENT:
// ************************************************************************************************
gameState.getPlayerExploredPercent = function () {
	var pc = gameState.playerCharacter;
	
	return Math.floor(pc.exploredTiles / (this.numTilesX * this.numTilesY * 4) * 100);
};

// SPAWN_SHIPS:
// ************************************************************************************************
gameState.spawnShips = function (tileIndex, typeName, num) {
	var i;
	
	this.createShip(tileIndex, typeName);
	for (i = 0; i < num - 1; i += 1) {
		if (this.getPassableAdjacentIndex(tileIndex)) {
			this.createShip(this.getPassableAdjacentIndex(tileIndex), typeName);
		}
	}
};

// SAVE_PLAYER_SHIP:
// ************************************************************************************************
gameState.savePlayerShip = function () {
	var data = {}, i, pc = gameState.playerCharacter;
	
	// Save inventory:
	data.inventory = [];
	for (i = 0; i < pc.inventory.length; i += 1) {
		if (pc.inventory[i].itemTypeName !== 'Package') {
			data.inventory.push({itemTypeName: pc.inventory[i].itemTypeName, amount: pc.inventory[i].amount});
		}
	}
	
	// Save hard points:
	data.hardPoints = [];
	for (i = 0; i < pc.hardPoints.length; i += 1) {
		data.hardPoints.push(pc.hardPoints[i].itemTypeName);
	}
	
	// Save Attributes:
	data.credits = pc.credits;
	data.exp = pc.exp;
	data.level = pc.level;
	data.skillPoints = pc.skillPoints;
	data.skills = pc.skills;
	data.netWorth = this.getPlayerNetWorth();
	data.sectorUnlocked = pc.sectorUnlocked;
	
	// Save stats:
	data.killCount = pc.killCount;
	data.freighterKillCount = pc.freighterKillCount;
	data.harvestCount = pc.harvestCount;
	data.exploredCount = pc.exploredCount;
	data.contractCount = pc.contractCount;
	
	// Help Stats:
	data.cargoHelp = pc.cargoHelp;
	data.equipmentHelp = pc.equipmentHelp;
	data.combatHelp = pc.combatHelp;
	data.fuelHelp = pc.fuelHelp;
	
	// Kong API:
	if (kongregate) {
		kongregate.stats.submit('netWorth', this.getPlayerNetWorth());
		kongregate.stats.submit('characterLevel', pc.level);
		kongregate.stats.submit('harvestCount', pc.harvestCount);
		kongregate.stats.submit('killCount', pc.killCount);
		kongregate.stats.submit('contractCount', pc.contractCount);
	}
	
	console.log('Saving Player...');
    localStorage.setItem('Player' + menuState.saveSlot, JSON.stringify(data));
};


// LOAD_PLAYER_SHIP:
// ************************************************************************************************
gameState.loadPlayerShip = function () {
	var data, i, pc = gameState.playerCharacter, position;
	
	console.log('Loading Player...');
    data = JSON.parse(localStorage.getItem('Player' + menuState.saveSlot));
	
	// Loading existing player:
	if (data) {
		// Initial Attributes:
		pc.exp = data.exp;
		pc.level = data.level;
		pc.skillPoints = data.skillPoints;
		pc.credits = data.credits;
		pc.skills = data.skills;

		// Stats:
		pc.killCount = data.killCount;
		pc.freighterKillCount = data.freighterKillCount;
		pc.harvestCount = data.harvestCount;
		pc.exploredCount = data.exploredCount;
		pc.contractCount = data.contractCount;
		
		// Help stats:
		pc.cargoHelp = data.cargoHelp;
		pc.equipmentHelp = data.equipmentHelp;
		pc.combatHelp = data.combatHelp;
		pc.fuelHelp = data.fuelHelp;
		
		// Load inventory:
		for (i = 0; i < data.inventory.length; i += 1) {
			pc.inventory.addItem(data.inventory[i].itemTypeName, data.inventory[i].amount);
		}
		
		// Load hard points:
		for (i = 0; i < data.hardPoints.length; i += 1) {
			pc.hardPoints.addItem(data.hardPoints[i]);
		}
		
	// Creating a new player:
	} else {
		pc.exp = 0;
		pc.level = 1;
		pc.skillPoints = 0;
		pc.credits = 200;
		pc.skills = {barter: 0, gunnery: 0, navigation: 0, logistics: 0, shields: 0, engineering: 0};
		
		// Stats:
		pc.killCount = 0;
		pc.freighterKillCount = 0;
		pc.harvestCount = 0;
		pc.exploredCount = 0;
		pc.contractCount = 0;
		
		// Initial Inventory:
		pc.inventory.addItem('Fuel', 10);
		pc.hardPoints.addItem('LaserCannon');
		
		// Help Stats:
		pc.cargoHelp = true;
		pc.equipmentHelp = true;
		pc.combatHelp = true;
		pc.fuelHelp = true;
	}
	
	
};

    