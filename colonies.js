/*global game, console, gameState, COLONY_NAMES, LARGE_WHITE_FONT, DISTANCE_PER_FUEL*/
'use strict';

// Sell factors:
var RESOURCE_SELL_FACTOR = 1.0; // the price colony pays the player for desired resources
var STANDARD_SELL_FACTOR = 0.6; // the price colony pays player for non desired resources
var RESOURCE_BUY_FACTOR = 0.70; // the price player is charged for a colonys products
var STANDARD_BUY_FACTOR = 1.0; // the price player is charged for colonys non products

var COLONY_INITIAL_RESOURCE_COUNT = 10;
var COLONY_REPAIR_COST_PER_HP = 5;
var COLONY_MAX_RESOURCES = 30;

// CREATE_COLONY_TYPES:
// ************************************************************************************************
gameState.createColonyTypes = function () {
	
	this.colonyNames = ['Ceres', 'Pallas', 'Vesta', 'Hygiea', 'Interamnia', 'Europa', 'Davida', 'Sylvia', 'Cybele', 'Eunomia', 'Juno',
						'Euphrosyne', 'Hektor', 'Thisbe', 'Bamberga', 'Patientia', 'Herculina', 'Doris', 'Ursula', 'Camilla', 'Eugenia',
						'Iris', 'Amphitrite', 'Diotima', 'Fortuna', 'Egeria', 'Themis', 'Aurora', 'Alauda', 'Hermione', 'Palma', 'Nemesis',
						'Hebe', 'Psyche', 'Lachesis', 'Daphne', 'Metis', 'Titan', 'Phobos', 'Io', 'Callisto', 'Elara', 'Himalia', 'Sinope', 'Leda'];

	
                        // FARMING COLONY TYPE:
    this.colonyTypes = {Farming: {name: 'Farming',
								  niceName: 'Farming Station',
								  frame: 2,
                                  sells: [[{itemTypeName: 'Vegetables', amount: 12},
										  {itemTypeName: 'Fruit', amount: 10},
										  {itemTypeName: 'Meat', amount: 8},
										  {itemTypeName: 'Fuel', amount: 10}],
										 [{itemTypeName: 'Vegetables', amount: 12},
										  {itemTypeName: 'Fruit', amount: 10},
										  {itemTypeName: 'Meat', amount: 8},
										  {itemTypeName: 'Fish', amount: 4},
										  {itemTypeName: 'Fuel', amount: 10}],
										 [{itemTypeName: 'Vegetables', amount: 12},
										  {itemTypeName: 'Fruit', amount: 10},
										  {itemTypeName: 'Meat', amount: 8},
										  {itemTypeName: 'Fish', amount: 4},
										  {itemTypeName: 'Medicine', amount: 2},
										  {itemTypeName: 'Fuel', amount: 10}]],
                                  buys: ['FarmingEquipment', 'Ice', 'ConsumerGoods'],
                                  sellsItems: [[], [], []]
                                 },
                        
                        // INDUSTRIAL COLONY TYPE:
                        Industrial: {name: 'Industrial',
									 niceName: 'Industrial Station',
									 frame: 3,
                                     sells: [[{itemTypeName: 'ConsumerGoods', amount: 12},
											 {itemTypeName: 'FarmingEquipment', amount: 10},
											 {itemTypeName: 'MiningEquipment', amount: 8},
											 {itemTypeName: 'Fuel', amount: 10}],
											[{itemTypeName: 'ConsumerGoods', amount: 12},
											 {itemTypeName: 'FarmingEquipment', amount: 10},
											 {itemTypeName: 'MiningEquipment', amount: 8},
											 {itemTypeName: 'ShipyardEquipment', amount: 4},
											 {itemTypeName: 'Fuel', amount: 5}],
											[{itemTypeName: 'ConsumerGoods', amount: 12},
											 {itemTypeName: 'FarmingEquipment', amount: 10},
											 {itemTypeName: 'MiningEquipment', amount: 8},
											 {itemTypeName: 'ShipyardEquipment', amount: 4},
											 {itemTypeName: 'MilitaryEquipment', amount: 2},
											 {itemTypeName: 'Fuel', amount: 10}]],
                                     buys: ['Ice', 'Copper', 'Steel', 'Vegetables', 'Fruit', 'Meat', 'Fish', 'Medicine'],
                                     sellsItems: [[], [], []]
                                    },
                        
                        // MINING COLONY TYPE:
                        Mining: {name: 'Mining',
								 niceName: 'Mining Station',
								 frame: 4,
                                 sells: [[{itemTypeName: 'Ice', amount: 12},
										 {itemTypeName: 'Steel', amount: 10},
										 {itemTypeName: 'Copper', amount: 8},
										 {itemTypeName: 'Fuel', amount: 10}],
										[{itemTypeName: 'Ice', amount: 12},
										 {itemTypeName: 'Steel', amount: 10},
										 {itemTypeName: 'Copper', amount: 8},
										 {itemTypeName: 'Uranium', amount: 4},
										 {itemTypeName: 'Fuel', amount: 10}],
										[{itemTypeName: 'Ice', amount: 12},
										 {itemTypeName: 'Steel', amount: 10},
										 {itemTypeName: 'Copper', amount: 8},
										 {itemTypeName: 'Uranium', amount: 4},
										 {itemTypeName: 'Crystal', amount: 2},
										 {itemTypeName: 'Fuel', amount: 10}]],
                                 buys: ['MiningEquipment', 'Vegetables', 'Fruit', 'Meat', 'Fish', 'Medicine', 'ConsumerGoods', 'Ice'],
                                 sellsItems: [[], [], []]
                                },
                        
                        // MILITARY COLONY TYPE:
                        Military: {name: 'Military',
								   niceName: 'Military Station',
								   frame: 0,
                                   sells: [[{itemTypeName: 'Fuel', amount: 10}],
										  [{itemTypeName: 'Fuel', amount: 10}],
										  [{itemTypeName: 'Fuel', amount: 10}]],
                                   buys: ['Ice', 'MilitaryEquipment', 'Vegetables', 'Fruit', 'Meat', 'Fish', 'Medicine', 'Uranium', 'Crystal', 'ConsumerGoods'],
                                   sellsItems: [[{name: 'LaserCannon', amount: 3},
												 {name: 'PlasmaCannon', amount: 3},
												 {name: 'MassDriver', amount: 3},
												 {name: 'MissileLauncher', amount: 3}],
												
												// LEVEL 1:
												[{name: 'LaserCannon', amount: 3},
												 {name: 'PlasmaCannon', amount: 3},
												 {name: 'MassDriver', amount: 3},
												 {name: 'MissileLauncher', amount: 3},
												 {name: 'ShieldRecharger', amount: 3}],
												
												// LEVEL 2:
												[{name: 'AdvancedLaserCannon', amount: 3},
												 {name: 'AdvancedPlasmaCannon', amount: 3},
												 {name: 'AdvancedMassDriver', amount: 3},
												 {name: 'AdvancedMissileLauncher', amount: 3},
												 {name: 'ShieldRecharger', amount: 3}
												 ]
											   ]
                                  },
						
						Shipyard: {name: 'Shipyard',
								   niceName: 'Shipyard',
								   frame: 1,
								   sells: [[{itemTypeName: 'Fuel', amount: 10}],
										  [{itemTypeName: 'Fuel', amount: 10}],
										  [{itemTypeName: 'Fuel', amount: 10}]],
								   buys: ['Ice', 'ShipyardEquipment', 'Vegetables', 'Fruit', 'Meat', 'Fish', 'Medicine', 'Uranium', 'Steel', 'Copper', 'ConsumerGoods'],
								   sellsItems: [[{name: 'FuelTank', amount: 3},
												 {name: 'CargoPod', amount: 3},
												 {name: 'EnginePod', amount: 3},
												 {name: 'ArmorPod', amount: 3},
												 {name: 'ShieldPod', amount: 3}
												 ],
												
												// LEVEL 1:
												[{name: 'FuelTank', amount: 3},
												 {name: 'CargoPod', amount: 3},
												 {name: 'EnginePod', amount: 3},
												 {name: 'ArmorPod', amount: 3},
												 {name: 'ShieldPod', amount: 3}
												 ],
												
												// LEVEL 2:
												[{name: 'AdvancedFuelTank', amount: 3},
												 {name: 'AdvancedCargoPod', amount: 3},
												 {name: 'AdvancedEnginePod', amount: 3},
												 {name: 'AdvancedArmorPod', amount: 3},
												 {name: 'AdvancedShieldPod', amount: 3}
												 ]
											   ]
								  },
						
						ShipScoutPost: {name: 'ShipScoutPost',
										niceName: 'Scout Post',
										frame: 5,
										sells: [[{itemTypeName: 'Fuel', amount: 10}],
												[{itemTypeName: 'Fuel', amount: 10}],
												[{itemTypeName: 'Fuel', amount: 10}]],
										buys: [],
										sellsItems: [[{name: 'FuelTank', amount: 3},
													  {name: 'CargoPod', amount: 3},
													  {name: 'EnginePod', amount: 3},
													  {name: 'ArmorPod', amount: 3},
													  {name: 'ShieldPod', amount: 3}],
												
													 // LEVEL 1:
													 [{name: 'FuelTank', amount: 3},
													  {name: 'CargoPod', amount: 3},
													  {name: 'EnginePod', amount: 3},
													  {name: 'ArmorPod', amount: 3},
													  {name: 'ShieldPod', amount: 3}],
									
													 // LEVEL 2:
													 [{name: 'AdvancedFuelTank', amount: 3},
													  {name: 'AdvancedCargoPod', amount: 3},
													  {name: 'AdvancedEnginePod', amount: 3},
													  {name: 'AdvancedArmorPod', amount: 3},
													  {name: 'AdvancedShieldPod', amount: 3}]
													  
												]
								   },
						MilitaryScoutPost: {name: 'MilitaryScoutPost',
											niceName: 'Scout Post',
											frame: 5,
											sells: [[{itemTypeName: 'Fuel', amount: 10}],
													[{itemTypeName: 'Fuel', amount: 10}],
													[{itemTypeName: 'Fuel', amount: 10}]],
											buys: [],
											sellsItems: [[{name: 'LaserCannon', amount: 3},
														  {name: 'PlasmaCannon', amount: 3},
														  {name: 'MassDriver', amount: 3},
														  {name: 'MissileLauncher', amount: 3}],
												
														// LEVEL 1:
														[{name: 'LaserCannon', amount: 3},
														 {name: 'PlasmaCannon', amount: 3},
														 {name: 'MassDriver', amount: 3},
														 {name: 'MissileLauncher', amount: 3},
														 {name: 'ShieldRecharger', amount: 3}],

														// LEVEL 2:
														[{name: 'AdvancedLaserCannon', amount: 3},
														 {name: 'AdvancedPlasmaCannon', amount: 3},
														 {name: 'AdvancedMassDriver', amount: 3},
														 {name: 'AdvancedMissileLauncher', amount: 3},
														 {name: 'ShieldRecharger', amount: 3}
														 ]
														]
										   }
                       };
	
	// Text:
	this.colonyTypes.Farming.text = 'Buys: Farming Equipment, Consumer Goods and Ice.\n\nThis station specializes in food production, growing a wide variety of products in its environmentally controlled biospheres.';
	this.colonyTypes.Industrial.text = 'Buys: Ice, Steel, Copper, Food and Medicine.\n\nThis station specializes in industrial manufacturing, taking raw resources and converting them into usable products and equipment.';
	this.colonyTypes.Mining.text = 'Buys: Mining Equipment, Consumer Goods, Food and Medicine.\n\nThis station specializes in the mining and refining of raw mineral resources.';
	this.colonyTypes.Military.text = 'Buys: Military Equipment, Consumer Goods, Uranium, Food and Medicine.\n\nThis station provides the sector with security and offers a selection of weaponry to independent contracters.';
	this.colonyTypes.Shipyard.text = 'Buys: Shipyard Equipment, Consumer Goods, Steel, Copper, Uranium, Food and Medicine.\n\nThis station specializes in the construction and repair of star ships. It also offers a selection of equipment to contracters.';
	this.colonyTypes.MilitaryScoutPost.text = 'This station offer repairs and equipment to ships contracted to scout this sector.\n\nYou can also sell any resources you harvest here.';
	this.colonyTypes.ShipScoutPost.text = 'This station offer repairs and equipment to ships contracted to scout this sector.\n\nYou can also sell any resources you harvest here.';
};



// CREATE_COLONY:
// ************************************************************************************************
gameState.createColony = function (tileIndex, coloniesMapIndex, colonyTypeName, name) {
    var colony = {}, i, position = this.getPositionFromTileIndex(tileIndex);
    
    // Initial Attributes:
    colony.tileIndex = {x: tileIndex.x, y: tileIndex.y};
    colony.inventory = gameState.createInventory();
    colony.type = this.colonyTypes[colonyTypeName];
    colony.event = null;
	colony.job = null;
    colony.coloniesMapIndex = {x: coloniesMapIndex.x, y: coloniesMapIndex.y};
	
	if (gameState.coloniesMap) {
		gameState.coloniesMap[coloniesMapIndex.x][coloniesMapIndex.y] = colony;
	}
	
	// Name:
	if (!name) {
		colony.name = this.randElem(this.colonyNames);
		this.removeFromArray(colony.name, this.colonyNames);
	} else {
		colony.name = name;
	}
	
    // Place colony on tileMap:
	if (gameState.tileMap) {
		this.tileMap[tileIndex.x][tileIndex.y].colony = colony;
	}
	
	// Get sell list based on sector level:
	colony.sellsItems = colony.type.sellsItems[gameState.sectorLevel];
	
	// Add starting resoures:
    for (i = 0; i < colony.type.sells[this.sectorLevel].length; i += 1) {
		colony.inventory.addItem(colony.type.sells[this.sectorLevel][i].itemTypeName, colony.type.sells[this.sectorLevel][i].amount);
    }
	
	// Add initial items:
	for (i = 0; i < colony.sellsItems.length; i += 1) {
		colony.inventory.addItem(colony.sellsItems[i].name, colony.sellsItems[i].amount);
    }

    // Sprite:
    colony.sprite = gameState.createSprite(position.x, position.y, 'ColonyTileset', this.colonySpriteGroup);
    colony.sprite.anchor.setTo(0.5, 0.5);
    colony.sprite.frame = colony.type.frame;
    
	// Name sprite:
	colony.nameText = gameState.createText(position.x, position.y - 42, colony.name, LARGE_WHITE_FONT, this.colonySpriteGroup);
	colony.nameText.anchor.setTo(0.5, 0.5);
	
	
    // Functions:
    colony.getItemBuyPrice = this.getItemBuyPrice;
    colony.getItemSellPrice = this.getItemSellPrice;
    colony.restock = this.restockColony;
	
	if (gameState.colonyList) {
		this.colonyList.push(colony);
	}
    return colony;
};

// RESTOCK_COLONY:
// ************************************************************************************************
gameState.restockColony = function () {
	var i;
	
	// Add sell resources to inventory:
    for (i = 0; i < this.type.sells[gameState.sectorLevel].length; i += 1) {
		this.inventory.addItem(this.type.sells[gameState.sectorLevel][i].itemTypeName, this.type.sells[gameState.sectorLevel][i].amount);
    }
    
    // Add sell items to inventory:
    for (i = 0; i < this.sellsItems.length; i += 1) {
		if (this.inventory.countItem(this.sellsItems[i].name) < this.sellsItems[i].amount) {
			this.inventory.addItem(this.sellsItems[i].name, this.sellsItems[i].amount - this.inventory.countItem(this.sellsItems[i]));
		}
    }
};

// DOES_COLONY_SELL:
// ************************************************************************************************
gameState.doesColonySell = function (colony, itemTypeName) {
	var i;
	for (i = 0; i < colony.type.sells[gameState.sectorLevel].length; i += 1) {
		if (colony.type.sells[gameState.sectorLevel][i].itemTypeName === itemTypeName) {
			return true;
		}
	}
	
	return false;
};

// DESTROY_ALL_COLONIES:
// ************************************************************************************************
gameState.destroyAllColonies = function () {
    var i;
    for (i = 0; i < this.colonyList.length; i += 1) {
        this.colonyList[i].sprite.destroy();
		this.colonyList[i].nameText.destroy();
    }
    this.colonyList = [];
};

// GET_ITEM_BUY_PRICE:
// ************************************************************************************************
gameState.getItemBuyPrice = function (itemTypeName) {
    var price;


    // If the item is on the colonies sell list:
    if (gameState.doesColonySell(this, itemTypeName)) {
        price =  Math.floor(gameState.itemTypes[itemTypeName].value * RESOURCE_BUY_FACTOR - gameState.playerCharacter.skills.barter);

    // Otherwise standard modifier:
    } else {
        price =  Math.floor(gameState.itemTypes[itemTypeName].value * STANDARD_BUY_FACTOR - gameState.playerCharacter.skills.barter);
    }

    if (price < 0) {
        price = 0;
    }

    if (price < this.getItemSellPrice(itemTypeName)) {
        price = this.getItemSellPrice(itemTypeName);
    }

    return price;
};

// GET_ITEM_SELL_PRICE:
// ************************************************************************************************
gameState.getItemSellPrice = function (itemTypeName) {
    var price;


    // If the item is on the colonies buy list:
    if (gameState.inArray(itemTypeName, this.type.buys)) {
        price =  Math.floor(gameState.itemTypes[itemTypeName].value * RESOURCE_SELL_FACTOR + gameState.playerCharacter.skills.barter);

	// Equipment:
    } else if (gameState.itemTypes[itemTypeName].equippable) {
		price =  gameState.itemTypes[itemTypeName].value;
		
	// Otherwise standard modifier:
	} else {
        price =  Math.floor(gameState.itemTypes[itemTypeName].value * STANDARD_SELL_FACTOR + gameState.playerCharacter.skills.barter);
    }

    if (price < 0) {
        price = 0;
    }

    return price;
};

// CREATE_JOB_TYPES:
// ************************************************************************************************
gameState.createJobTypes = function () {
	this.jobTypes = {Delivery: {text: 'Deliver this package to [DEST] in exchange for [REWARD] credits.\n\nIf you accept this job, the location of [DEST] will be added to your map.\n\nTo open your map menu, click the map button in the bottom right corner of the screen. '}};
};

// CREATE_JOBS:
// ************************************************************************************************
gameState.createJobs = function () {
	var i, destColony, reward, distance;
	
	for (i = 0; i < this.colonyList.length; i += 1) {
		// Choose a random destination:
		destColony = this.randElem(this.colonyList);
		while (destColony === this.colonyList[i]) {
			destColony = this.randElem(this.colonyList);
		}
		

		distance = gameState.getDistance(this.colonyList[i].sprite.position, destColony.sprite.position);
		reward = Math.floor(distance / 26);

		this.colonyList[i].job = {typeName: 'Delivery', colonyName: destColony.name, reward: reward};
	}
};

// GET_COLONY_WITH_NAME:
// ************************************************************************************************
gameState.getColonyWithName = function (name) {
	var i;
	
	for (i = 0; i < this.colonyList.length; i += 1) {
		if (this.colonyList[i].name === name) {
			return this.colonyList[i];
		}
	}
	
	console.log('getColonyWithName(' + name + ') failed...');
	return null;
};