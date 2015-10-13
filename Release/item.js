/*global game, gameState, console, PLAYER_CHARACTER_FOOD_TIME, SECOND, TILE_SIZE*/
'use strict';

// CREATE_ITEM_TYPES:
// ************************************************************************************************
gameState.createItemTypes = function () {
    var meleeEffect,
        projectileEffect,
		beamEffect,
		cargoEffect,
		shieldEffect,
		engineEffect,
		armorEffect,
		fuelCapEffect,
		shieldRechargeEffect;
    

    // PROJECTILE EFFECT:
    // ********************************************************************************************
    projectileEffect = function (targetShip, itemType, actingShip) {
        var normal = gameState.getNormal(actingShip.sprite.position, targetShip.sprite.position);
	
		gameState.createProjectile(actingShip, targetShip.sprite.position, itemType.name);

		if (itemType.name === 'MassDriver') {
			actingShip.velocity.x -= normal.x * 0.75;
			actingShip.velocity.y -= normal.y * 0.75;
		}

		if (actingShip === gameState.playerCharacter) {
			targetShip.gainAgro();
		}
		
		if (itemType.sound) {
			itemType.sound.play();
		}
    };
	
	// BEAM EFFECT:
    // ********************************************************************************************
    beamEffect = function (targetShip, itemType, actingShip) {
		gameState.createBeam(actingShip, targetShip, itemType.name);
		if (itemType.sound) {
			itemType.sound.play();
		}
		
		if (actingShip === gameState.playerCharacter) {
			targetShip.gainAgro();
		}
    };
	
	// SHIELD_RECHARGE_EFFECT:
    // ********************************************************************************************
    shieldRechargeEffect = function (targetShip, itemType, actingShip) {
		gameState.createDamageText(gameState.getPositionFromTileIndex(actingShip.tileIndex).x,
                                   gameState.getPositionFromTileIndex(actingShip.tileIndex).y - 12, 'SHIELD BOOSTED', '#00ff00');
		actingShip.currentShieldHp = actingShip.maxShieldHp;
		gameState.shieldUpSound.play();
    };
	
	// CARGO_EFFECT:
    // ********************************************************************************************
	cargoEffect = function (ship, itemType) {
		ship.cargoCap += itemType.cargoCap;
	};
	
	// SHIELD_EFFECT:
    // ********************************************************************************************
	shieldEffect = function (ship, itemType) {
		ship.maxShieldHp += itemType.shieldHp;
	};
	
	// ARMOR_EFFECT:
    // ********************************************************************************************
	armorEffect = function (ship, itemType) {
		ship.maxHp += itemType.hp;
	};
	
	// ENGINE_EFFECT:
    // ********************************************************************************************
	engineEffect = function (ship, itemType) {
		ship.speedStat += itemType.speed;
	};
	
	// FUEL_CAP_EFFECT:
    // ********************************************************************************************
	fuelCapEffect = function (ship, itemType) {
		ship.fuelTankSize += itemType.fuelCap;
	};

					  // WEAPONS:
    this.itemTypes = {LaserCannon:			{name: 'LaserCannon',			niceName: 'Laser Cannon',		shortName: 'Laser Cannon',		sound: this.laserSound, imageIndex: 0, requiresTarget: true, damage: 4, ignoreShields: 'default', range: 8.0 * TILE_SIZE, effect: projectileEffect, coolDown: 4 * SECOND, equippable: true, weight: 1.0, value: 2500, dropable: true},
					  PlasmaCannon:			{name: 'PlasmaCannon',			niceName: 'Plasma Cannon',		shortName: 'Plasma Cannon',		sound: this.plasmaSound, imageIndex: 1, requiresTarget: true, damage: 8, ignoreShields: 'block', range: 8.0 * TILE_SIZE, effect: projectileEffect, coolDown: 4 * SECOND, equippable: true, weight: 1.0, value: 5000, dropable: true},
					  MassDriver:			{name: 'MassDriver',			niceName: 'Mass Driver',		shortName: 'Mass Driver',		sound: this.massDriverSound, imageIndex: 2, requiresTarget: true, damage: 5, ignoreShields: 'pass', range: 8.0 * TILE_SIZE, effect: projectileEffect, coolDown: 4 * SECOND, equippable: true, weight: 1.0, value: 5000, dropable: true},
					  MissileLauncher:		{name: 'MissileLauncher',		niceName: 'Missile Launcher',	shortName: 'Missile Launcher',	sound: this.massDriverSound, imageIndex: 3, requiresTarget: true, damage: 6, ignoreShields: 'pass', range: 8.0 * TILE_SIZE, effect: projectileEffect, coolDown: 12 * SECOND, equippable: true, weight: 1.0, value: 5000, dropable: true},
					  ShieldRecharger:		{name: 'ShieldRecharger',		niceName: 'Shield Recharger',	shortName: 'Shield Recharger',	sound: null, imageIndex: 4, requiresTarget: false, equippable: true, effect: shieldRechargeEffect, coolDown: 20 * SECOND, weight: 1.0, value: 5000, dropable: true},

					  AdvancedLaserCannon:			{name: 'AdvancedLaserCannon',			niceName: 'Advanced Laser Cannon',		shortName: 'Adv L-Cannon',		sound: this.laserSound, imageIndex: 5, requiresTarget: true, damage: 6, ignoreShields: 'default', range: 8.0 * TILE_SIZE, effect: projectileEffect, coolDown: 4 * SECOND, equippable: true, weight: 1.0, value: 6000, dropable: true},
					  AdvancedPlasmaCannon:			{name: 'AdvancedPlasmaCannon',			niceName: 'Advanced Plasma Cannon',		shortName: 'Adv P-Cannon',		sound: this.plasmaSound, imageIndex: 6, requiresTarget: true, damage: 12, ignoreShields: 'block', range: 8.0 * TILE_SIZE, effect: projectileEffect, coolDown: 4 * SECOND, equippable: true, weight: 1.0, value: 12000, dropable: true},
					  AdvancedMassDriver:			{name: 'AdvancedMassDriver',			niceName: 'Advanced Mass Driver',		shortName: 'Adv Mass Driver',	sound: this.massDriverSound, imageIndex: 7, requiresTarget: true, damage: 8, ignoreShields: 'pass', range: 8.0 * TILE_SIZE, effect: projectileEffect, coolDown: 4 * SECOND, equippable: true, weight: 1.0, value: 12000, dropable: true},
					  AdvancedMissileLauncher:		{name: 'AdvancedMissileLauncher',		niceName: 'Advanced Missile Launcher',	shortName: 'Adv M-Launcher',	sound: this.massDriverSound, imageIndex: 8, requiresTarget: true, damage: 9, ignoreShields: 'pass', range: 8.0 * TILE_SIZE, effect: projectileEffect, coolDown: 12 * SECOND, equippable: true, weight: 1.0, value: 12000, dropable: true},
					  AdvancedShieldRecharger:		{name: 'AdvancedShieldRecharger',		niceName: 'Advanced Shield Recharger',	shortName: 'Adv S-Recharger',	sound: null, imageIndex: 9, requiresTarget: false, equippable: true, effect: shieldRechargeEffect, coolDown: 12 * SECOND, weight: 1.0, value: 12000, dropable: true},

					  // MONSTER WEAPONS:
					  LaserBeam:			{name: 'LaserBeam',				niceName: 'Laser Beam',			shortName: 'Laser Beam', sound: this.beamSound, imageIndex: 0, requiresTarget: true, damage: 1, ignoreShields: 'default', range: 8.0 * TILE_SIZE, effect: beamEffect, coolDown: 4 * SECOND, equippable: true, weight: 1.0, value: 0, dropable: true},
					  CrystalCannon:		{name: 'CrystalCannon',			niceName: 'CrystalCannon',		sound: this.plasmaSound, imageIndex: 0, requiresTarget: true, damage: 4, ignoreShields: 'default', range: 8.0 * TILE_SIZE, effect: projectileEffect, coolDown: 3 * SECOND, equippable: true, weights: 1.0, value: 0, dropable: false},
					  IceCannon:			{name: 'IceCannon',				niceName: 'Ice Cannon',			sound: this.plasmaSound, imageIndex: 0, requiresTarget: true, damage: 3, ignoreShields: 'default', range: 8.0 * TILE_SIZE, effect: projectileEffect, coolDown: 3 * SECOND, equippable: true, weight: 1.0, value: 0, dropable: false},
					  EelCannon:			{name: 'EelCannon',				niceName: 'Eel Cannon',			sound: this.plasmaSound, imageIndex: 0, requiresTarget: true, damage: 4, ignoreShields: 'default', range: 8.0 * TILE_SIZE, effect: projectileEffect, coolDown: 3 * SECOND, equippable: true, weight: 1.0, value: 0, dropable: false},
					  DroneLaser:			{name: 'DroneLaser',			niceName: 'Drone Laser',		sound: this.laserSound, imageIndex: 0, requiresTarget: true, damage: 2, ignoreShields: 'default', range: 8.0 * TILE_SIZE, effect: projectileEffect, coolDown: 3 * SECOND, equippable: true, weight: 1.0, value: 0, dropable: false},

					  // SYSTEMS:
                      FuelTank:				{name: 'FuelTank',				niceName: 'Fuel Tank',			imageIndex: 10, equippable: true, fuelCap: 100,	passiveEffect: fuelCapEffect, weight: 1.0, value: 1000},
					  CargoPod:				{name: 'CargoPod',				niceName: 'Cargo Pod',			imageIndex: 11, equippable: true, cargoCap: 3,	passiveEffect: cargoEffect,		weight: 1.0, value: 4000, dropable: true},
                      ShieldPod:			{name: 'ShieldPod',				niceName: 'Shield Pod',			imageIndex: 12, equippable: true, shieldHp: 1,	passiveEffect: shieldEffect,	weight: 1.0, value: 4000, dropable: true},
                      EnginePod:			{name: 'EnginePod',				niceName: 'Engine Pod',			imageIndex: 13, equippable: true, speed: 1,		passiveEffect: engineEffect,	weight: 1.0, value: 4000, dropable: true},
                      ArmorPod:				{name: 'ArmorPod',				niceName: 'Armor Pod',			imageIndex: 14, equippable: true, hp: 5,		passiveEffect: armorEffect,		weight: 1.0, value: 4000, dropable: true},
					  AdvancedFuelTank:		{name: 'AdvancedFuelTank',		niceName: 'Advanced Fuel Tank', imageIndex: 10, equippable: true, fuelCap: 200,	passiveEffect: fuelCapEffect, weight: 1.0, value: 1000},
					  AdvancedCargoPod:		{name: 'AdvancedCargoPod',		niceName: 'Advanced Cargo Pod',	imageIndex: 15, equippable: true, cargoCap: 6,	passiveEffect: cargoEffect,		weight: 1.0, value: 10000, dropable: true},
					  AdvancedShieldPod:	{name: 'AdvancedShieldPod',		niceName: 'AdvancedShield Pod',	imageIndex: 16, equippable: true, shieldHp: 2,	passiveEffect: shieldEffect,	weight: 1.0, value: 10000, dropable: true},
					  AdvancedEnginePod:	{name: 'AdvancedEnginePod',		niceName: 'Advanced Engine Pod', imageIndex: 17, equippable: true, speed: 2,	passiveEffect: engineEffect,	weight: 1.0, value: 10000, dropable: true},
					  AdvancedArmorPod:		{name: 'AdvancedArmorPod',		niceName: 'Advanced Armor Pod',	imageIndex: 18, equippable: true, hp: 10,		passiveEffect: armorEffect,		weight: 1.0, value: 10000, dropable: true},
					   
					  Fuel:                 {name: 'Fuel',                  niceName: 'Fuel',                   imageIndex: 19, equippable: false, weight: 1.0, value: 40, dropable: true},
                      Package:				{name: 'Package',				niceName: 'Package',				imageIndex: 20, equippable: false, weight: 1.0, value: 0, dropable: true},
	  
					  // MINING RESOURCES:
					  Ice:					{name: 'Ice',					niceName: 'Ice',					imageIndex: 21, equippable: false, weight: 1.0, value: 20, dropable: true},
                      Steel:                {name: 'Steel',                 niceName: 'Steel',                  imageIndex: 22, equippable: false, weight: 1.0, value: 40, dropable: true},
                      Copper:               {name: 'Copper',                niceName: 'Copper',                 imageIndex: 23, equippable: false, weight: 1.0, value: 80, dropable: true},
                      Uranium:              {name: 'Uranium',               niceName: 'Uranium',                imageIndex: 24, equippable: false, weight: 1.0, value: 120, dropable: true},
					  Crystal:				{name: 'Crystal',				niceName: 'Crystal',				imageIndex: 25, equippable: false, weight: 1.0, value: 160, dropable: true},
					  
					  // INDUSTRIAL RESOURCES:
                      ConsumerGoods:		{name: 'ConsumerGoods',			niceName: 'Consumer Goods',			imageIndex: 26, equippable: false, weight: 1.0, value: 20, dropable: true},
					  FarmingEquipment:     {name: 'FarmingEquipment',      niceName: 'Farming Equipment',      imageIndex: 27, equippable: false, weight: 1.0, value: 40, dropable: true},
                      MiningEquipment:      {name: 'MiningEquipment',       niceName: 'Mining Equipment',       imageIndex: 28, equippable: false, weight: 1.0, value: 80, dropable: true},
                      ShipyardEquipment:	{name: 'ShipyardEquipment',		niceName: 'Shipyard Equipment',		imageIndex: 29, equippable: false, weight: 1.0, value: 120, dropable: true},
					  MilitaryEquipment:    {name: 'MilitaryEquipment',     niceName: 'Military Equipment',     imageIndex: 30, equippable: false, weight: 1.0, value: 160, dropable: true},
                      
					  // FARMING RESOURCES:
                      Vegetables:           {name: 'Vegetables',            niceName: 'Vegetables',             imageIndex: 31, equippable: false, weight: 1.0, value: 20, dropable: true},
                      Fruit:				{name: 'Fruit',					niceName: 'Fruit',					imageIndex: 32, equippable: false, weight: 1.0, value: 40, dropable: true},
                      Meat:                 {name: 'Meat',                  niceName: 'Meat',                   imageIndex: 33, equippable: false, weight: 1.0, value: 80, dropable: true},
                      Fish:					{name: 'Fish',					niceName: 'Fish',					imageIndex: 34, equippable: false, weight: 1.0, value: 120, dropable: true},
					  Medicine:             {name: 'Medicine',              niceName: 'Medicine',               imageIndex: 35, equippable: false, weight: 1.0, value: 160, dropable: true}
                     };

    // Weapon Descriptions:
    this.itemTypes.LaserCannon.desc =           'A focused beam of light causing 4-DMG.';
    this.itemTypes.MassDriver.desc =            'Fires a high velocity projectile causing 5-DMG and passing through shields.';
	this.itemTypes.PlasmaCannon.desc =			'A focused beam of plasma which causes 8-DMG to ship hulls but is entirely blocked by shields.';
    this.itemTypes.MissileLauncher.desc =       'Fires a warhead which exlodes on impact causing 6-DMG to all ships in the blast radius.';
	
    this.itemTypes.AdvancedLaserCannon.desc =	'A focused beam of light causing 6-DMG';
    this.itemTypes.AdvancedMassDriver.desc =	'Fires a high velocity projectile causing 8-DMG and passing through shields.';
	this.itemTypes.AdvancedPlasmaCannon.desc =	'A focused beam of plasma which causes 12-DMG to ship hulls but is entirely blocked by shields.';
    this.itemTypes.AdvancedMissileLauncher.desc = 'Fires a warhead which exlodes on impact causing 9-DMG to all ships in the blast radius.';
	
    
	// System Descriptions:
	this.itemTypes.CargoPod.desc =              '+3 CARGO CAPACITY';
    this.itemTypes.ShieldPod.desc =             '+1 SHIELD HIT POINTS';
    this.itemTypes.EnginePod.desc =             '+1 MAX SPEED';
    this.itemTypes.ArmorPod.desc =              '+5 HULL HIT POINTS';
	
	this.itemTypes.AdvancedCargoPod.desc =		'+6 CARGO CAPACITY';
	this.itemTypes.AdvancedShieldPod.desc =		'+2 SHIELD HIT POINTS';
	this.itemTypes.AdvancedEnginePod.desc =		'+2 MAX SPEED';
	this.itemTypes.AdvancedArmorPod.desc =		'+10 HULL HIT POINTS';
	this.itemTypes.FuelTank.desc =				'+25% FUEL EFFICIENCY';
	this.itemTypes.AdvancedFuelTank.desc =		'+50% FUEL EFFICIENCY';
	this.itemTypes.ShieldRecharger.desc =		'FULLY RESTORES SHIELDS WHEN TRIGGERED';
	this.itemTypes.AdvancedShieldRecharger.desc = 'FULLY RESTORES SHIELDS WHEN TRIGGERED, HAS A SHORTER COOL DOWN THAN STANDARD MODEL';
    // Resources Descriptions:
    this.itemTypes.Fuel.desc =                  'Harvested from gas clouds and used to fuel the engines of star ships.';
    this.itemTypes.Ice.desc =                   'Sell to any Station. An abundant resource which is mined from asteroids and converted into water.';
	this.itemTypes.Steel.desc =                 'Sell to shipyards and industrial Stations. The basic material used in manufacturing equipment and star ships.';
    this.itemTypes.Copper.desc =                'Sell to shipyards and industrial Stations. A valuable material used in manufacturing equipment and star ships.';
    this.itemTypes.Uranium.desc =               'Sell to shipyards and military stations. A highly unstable material used in the construction of weapons and reactors.';
	this.itemTypes.Crystal.desc =				'Sell to military stations. A very valuable material used to focus the beams of energy weapons.';
	
	this.itemTypes.ConsumerGoods.desc =			'Sell to any station. A crate of household products, simple electronics and tools.';
    this.itemTypes.FarmingEquipment.desc =      'Sell to farming stations. A crate of basic equipment used by farmers.';
    this.itemTypes.MiningEquipment.desc =       'Sell to mining stations. A crate of drills, explosives and other equipment used by miners';
	this.itemTypes.ShipyardEquipment.desc =		'Sell to shipyards. A crate of prebuilt components used in the construction of star ships.';
    this.itemTypes.MilitaryEquipment.desc =     'Sell to military stations. A crate of prebuilt components used in the construction of weapons.';
    this.itemTypes.Vegetables.desc =            'Sell to any station. A bioengineered strain of corn developed specifically to grow in the harshness of space.';
	this.itemTypes.Fruit.desc =					'Sell to any station. A bioengineered strain of fruit developed specifically to grow in the harshness of space.';
    this.itemTypes.Meat.desc =                  'Sell to any station. Meat from the famous space cow.';
	this.itemTypes.Fish.desc =					'Sell to any station. ';
    this.itemTypes.Medicine.desc =              'Sell to any station. ';
    
};


// CREATE_ITEM:
// ************************************************************************************************
gameState.createItem = function (tileIndex, typeName, amount) {
	var i, item;
	
	for (i = 0; i < this.getTile(tileIndex).items.length; i += 1) {
		if (this.getTile(tileIndex).items[i].type.name === typeName) {
			this.getTile(tileIndex).items[i].amount += amount;
			return;
		}
	}
	
	
    item = {isAlive: true,
			tileIndex: {x: tileIndex.x, y: tileIndex.y},
			type: this.itemTypes[typeName],
			amount: amount};
    
    // Place on tileMap:
    this.getTile(tileIndex).items.push(item);
    
    // Create sprite:
    item.sprite = this.itemSpritesGroup.create(this.getPositionFromTileIndex(tileIndex).x,
                                               this.getPositionFromTileIndex(tileIndex).y,
                                               'ItemIcons');
    item.sprite.smoothed = false;
    item.sprite.scale.setTo(this.scaleFactor, this.scaleFactor);
    item.sprite.frame = item.type.imageIndex + 38;
    item.sprite.anchor.setTo(0.5, 0.5);
    
    // Push to list:
    this.itemList.push(item);
    return item;
};

// DESTROY_ITEM:
// ************************************************************************************************
gameState.destroyItem = function (item) {
    item.isAlive = false;
    item.sprite.destroy();
    this.removeFromArray(item, this.getTile(item.tileIndex).items);
};

// DESTROY_ALL_ITEMS:
// ************************************************************************************************
gameState.destroyAllItems = function () {
    var i;
    
    for (i = 0; i < this.itemList.length; i += 1) {
        this.destroyItem(this.itemList[i]);
    }
    
    this.itemList = [];
};