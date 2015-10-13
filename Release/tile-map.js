/*global Phaser, game, console, gameState */
'use strict';

var NUM_ENEMY_GROUPS = 10;
var MAX_ENEMY_PER_GROUP = 2;



// CREATE_TILE_TYPES:
// ************************************************************************************************
gameState.createTileTypes = function () {
    this.tileTypes = {Space:			{name: 'Space',				niceName: 'Space',				imageIndex: 14, passable: true, harvestable: false, damages: false, color: 'rgb(34,48,68)'},
                      Wall:				{name: 'Wall',				niceName: 'Asteroid',			imageIndex: 1, passable: false, harvestable: false, damages: false, color: 'rgb(110,110,110)'},
                      Asteroid:			{name: 'Asteroid',			niceName: 'Asteroid',			imageIndex: 24, passable: true, harvestable: false, damages: true, color: 'rgb(60,60,60)'},
					  Debris:			{name: 'Debris',			niceName: 'Debris',				imageIndex: 32, passable: true, harvestable: false, damages: true, color: 'rgb(60,60,60)'},
					  IceAsteroid:		{name: 'IceAsteroid',		niceName: 'Ice Asteroid',		imageIndex: 48, passable: true, harvestable: true, damages: true, color: 'rgb(70,163,255)', loot: 'Ice', amount: 1, spawn: 'IceFish'},
					  SteelAsteroid:	{name: 'SteelAsteroid',		niceName: 'Steel Asteroid',		imageIndex: 49, passable: true, harvestable: true, damages: true, color: 'rgb(229,229,229)', loot: 'Steel', amount: 1, spawn: 'Scavenger'},
					  CopperAsteroid:	{name: 'CopperAsteroid',	niceName: 'Copper Asteroid',	imageIndex: 50, passable: true, harvestable: true, damages: true, color: 'rgb(255,141,15)', loot: 'Copper', amount: 1, spawn: 'Scavenger'},
					  UraniumAsteroid:	{name: 'UraniumAsteroid',	niceName: 'Uranium Asteroid',	imageIndex: 51, passable: true, harvestable: true, damages: true, color: 'rgb(130,236,51)', loot: 'Uranium', amount: 1, spawn: 'Eel'},
					  FuelCloud:		{name: 'FuelCloud',			niceName: 'Fuel Cloud',			imageIndex: 52, passable: true, harvestable: true, damage: false, color: 'rgb(155,68,234)', loot: 'Fuel', amount: 1},
					  GrassAsteroid:	{name: 'GrassAsteroid',		niceName: 'Corn Asteroid',		imageIndex: 53, passable: true, harvestable: true, damages: true, color: 'rgb(88,137,90)', loot: 'Vegetables', amount: 1},
					  FruitAsteroid:	{name: 'FruitAsteroid',		niceName: 'Fruit Asteroid',		imageIndex: 56, passable: true, harvestable: true, damages: true, color: 'rgb(88,137,90)', loot: 'Fruit', amount: 1},
					  CowAsteroid:		{name: 'CowAsteroid',		niceName: 'Cow Asteroid',		imageIndex: 54, passable: true, harvestable: true, damages: true, color: 'rgb(88,137,90)', loot: 'Meat', amount: 1},
					  CrystalAsteroid:	{name: 'CrystalAsteroid',	niceName: 'Crystal Asteroid',	imageIndex: 55, passable: true, harvestable: true,	damages: true, color: 'rgb(255,0,0)', loot: 'Crystal', amount: 1, spawn: 'Crystal'},
					  
					  // LARGE ASTEROIDS:
					  LargeIceAsteroid:		{name: 'LargeIceAsteroid',		niceName: 'Large Ice Asteroid',		imageIndex: 57, passable: true, harvestable: true, damages: true, color: 'rgb(70,163,255)', loot: 'Ice', amount: 3},
					  LargeSteelAsteroid:	{name: 'LargeSteelAsteroid',	niceName: 'Large Steel Asteroid',	imageIndex: 58, passable: true, harvestable: true, damages: true, color: 'rgb(229,229,229)', loot: 'Steel', amount: 3},
					  LargeCopperAsteroid:	{name: 'LargeCopperAsteroid',	niceName: 'Large Copper Asteroid',	imageIndex: 59, passable: true, harvestable: true, damages: true, color: 'rgb(255,141,15)', loot: 'Copper', amount: 3},
					  LargeUraniumAsteroid:	{name: 'LargeUraniumAsteroid',	niceName: 'Large Uranium Asteroid',	imageIndex: 60, passable: true, harvestable: true, damages: true, color: 'rgb(130,236,51)', loot: 'Uranium', amount: 3},
					  LargeGrassAsteroid:	{name: 'LargeGrassAsteroid',	niceName: 'Large Corn Asteroid',	imageIndex: 61, passable: true, harvestable: true, damages: true, color: 'rgb(88,137,90)', loot: 'Vegetables', amount: 3},
					  LargeCowAsteroid:		{name: 'LargeCowAsteroid',		niceName: 'Large Cow Asteroid',		imageIndex: 62, passable: true, harvestable: true, damages: true, color: 'rgb(88,137,90)', loot: 'Meat', amount: 3}
					 
					 };

	this.regionTypes = {Trade: [['Colony', 'Colony', 'Colony'],
							    ['Colony', 'Colony', 'Colony'],
							    ['Colony', 'Colony', 'Colony']],
						
						Wild: [['Colony', 'Repair', 'Colony'],
							   ['Repair', 'Repair', 'Repair'],
							   ['Colony', 'Repair', 'Colony']],
						
						Hostile: [['Colony', 'Enemy', 'Colony'],
								  ['Enemy', 'Enemy', 'Enemy'],
								  ['Colony', 'Enemy', 'Colony']]
					};
	

	this.shipSpawnTable = [[{typeName: 'Scavenger', num: 1}],
						   [{typeName: 'Scavenger', num: 2}],
						   [{typeName: 'Scavenger', num: 2}, {typeName: 'LaserShip', num: 1}],
						   [{typeName: 'Scavenger', num: 3}, {typeName: 'LaserShip', num: 1}, {typeName: 'MissileShip', num: 1}],
						   [{typeName: 'Scavenger', num: 3}, {typeName: 'LaserShip', num: 2}, {typeName: 'MissileShip', num: 2}, {typeName: 'GunShip', num: 1}]];

	this.sectorSpawnTable = {Wild: [this.shipSpawnTable[0],
									this.shipSpawnTable[2],
									this.shipSpawnTable[3]],
							 Trade: [this.shipSpawnTable[1],
									 this.shipSpawnTable[2],
									 this.shipSpawnTable[3]],
							 Hostile: [this.shipSpawnTable[2],
									   this.shipSpawnTable[3],
									   this.shipSpawnTable[4]]};
	
	this.wildSectorExploreReward = [15, 28, 35];
	this.hostileSectorKillReward = [0.5, 0.65, 0.7];
	this.spawnLargePercent = [0.00, 0.05, 0.10];
	this.sectorEncounterNum = {Trade: 2, Wild: 5, Hostile: 3};

	this.sectorFrameOffset = {Trade: 0,
							  Wild: 64,
							  Hostile: 64
							 };
	
	this.numShipsPerSector = {Trade: [6, 8, 10],
							  Wild: [8, 10, 12],
							  Hostile: [12, 14, 16]};
	
	this.regionEncounterTable = {Mineral1: [{name: 'IceAsteroid', percent: 50},
										   {name: 'SteelAsteroid', percent: 30},
										   {name: 'CopperAsteroid', percent: 20}
										  ],
								 
								 Mineral2: [{name: 'IceAsteroid', percent: 30},
										   {name: 'SteelAsteroid', percent: 30},
										   {name: 'CopperAsteroid', percent: 30},
										   {name: 'UraniumAsteroid', percent: 10}
										  ],
								 
								 Mineral3: [{name: 'IceAsteroid', percent: 20},
										   {name: 'SteelAsteroid', percent: 30},
										   {name: 'CopperAsteroid', percent: 30},
										   {name: 'UraniumAsteroid', percent: 10},
										   {name: 'CrystalAsteroid', percent: 10}
										   ],
								 
								 Battle1: [{name: 'Derelicht', percent: 60},
										   {name: 'MineField', percent: 40}
										 ],
								 
								 Battle2: [{name: 'Derelicht', percent: 40},
										   {name: 'MineField', percent: 40},
										   {name: 'Radiated', percent: 20}
										 ],
								  
								 Natural1: [{name: 'GrassAsteroid', percent: 60},
											{name: 'FruitAsteroid', percent: 40}
										  ],
								 
								 Natural2: [{name: 'GrassAsteroid', percent: 40},
											{name: 'FruitAsteroid', percent: 30},
											{name: 'CowAsteroid', percent: 30}
										  ],
								 Natural3: [{name: 'GrassAsteroid', percent: 20},
											{name: 'GrassAsteroid', percent: 40},
											{name: 'CowAsteroid', percent: 40}
										  ],
								 
								 Normal1: [{name: 'FuelCloud', percent: 40},
										   {name: 'GrassAsteroid', percent: 10},
										   {name: 'FruitAsteroid', percent: 10},
										   {name: 'IceAsteroid', percent: 10},
										   {name: 'SteelAsteroid', percent: 10},
										   {name: 'CopperAsteroid', percent: 5},
										   {name: 'OutOfFuel', percent: 5},
										   {name: 'Damaged', percent: 5},
										   {name: 'Convict', percent: 5}
										 ],
								 
								 Normal2: [{name: 'FuelCloud', percent: 30},
										   {name: 'GrassAsteroid', percent: 10},
										   {name: 'FruitAsteroid', percent: 10},
										   {name: 'CowAsteroid', percent: 5},
										   {name: 'IceAsteroid', percent: 10},
										   {name: 'SteelAsteroid', percent: 10},
										   {name: 'CopperAsteroid', percent: 5},
										   {name: 'UraniumAsteroid', percent: 5},
										   {name: 'OutOfFuel', percent: 5},
										   {name: 'Damaged', percent: 5},
										   {name: 'Convict', percent: 5}
										 ],
										 
								 Normal3: [{name: 'FuelCloud', percent: 25},
										   {name: 'GrassAsteroid', percent: 10},
										   {name: 'FruitAsteroid', percent: 10},
										   {name: 'CowAsteroid', percent: 5},
										   {name: 'IceAsteroid', percent: 10},
										   {name: 'SteelAsteroid', percent: 10},
										   {name: 'CopperAsteroid', percent: 5},
										   {name: 'UraniumAsteroid', percent: 5},
										   {name: 'CrystalAsteroid', percent: 5},
										   {name: 'OutOfFuel', percent: 5},
										   {name: 'Damaged', percent: 5},
										   {name: 'Convict', percent: 5}
										 ]
								};
	
	
		
	this.regionTypeTable = {Trade:		[[{name: 'Normal1', percent: 50}, {name: 'Mineral1', percent: 30}, {name: 'Natural1', percent: 20}],
										 [{name: 'Normal1', percent: 50}, {name: 'Mineral1', percent: 30}, {name: 'Natural1', percent: 20}],
										 [{name: 'Normal2', percent: 50}, {name: 'Mineral2', percent: 30}, {name: 'Natural2', percent: 20}]
										 ],
							Wild:		[[{name: 'Normal1', percent: 50}, {name: 'Mineral1', percent: 30}, {name: 'Natural1', percent: 20}],
										 [{name: 'Normal2', percent: 35}, {name: 'Mineral2', percent: 30}, {name: 'Natural2', percent: 20}, {name: 'Battle1', percent: 15}],
										 [{name: 'Normal3', percent: 35}, {name: 'Mineral3', percent: 30}, {name: 'Natural3', percent: 20}, {name: 'Battle2', percent: 15}]
										],
							Hostile:	[[{name: 'Normal1', percent: 50}, {name: 'Mineral1', percent: 30}, {name: 'Natural1', percent: 20}],
										 [{name: 'Normal2', percent: 50}, {name: 'Mineral2', percent: 30}, {name: 'Natural2', percent: 20}],
										 [{name: 'Normal3', percent: 50}, {name: 'Mineral3', percent: 30}, {name: 'Natural3', percent: 20}]
										 ]
						   };
};

// INITIATE_TILE_MAP:
// ************************************************************************************************
gameState.initiateTileMap = function () {
	var x, y;
	
	// Create colonies map:
	this.coloniesMap = [];
	for (x = 0; x < this.numRegions; x += 1) {
		this.coloniesMap[x] = [];
		for (y = 0; y < this.numRegions; y += 1) {
			this.coloniesMap[x][y] = null;
		}
	}
	
	// Create empty map:
    this.tileMap = [];
    for (x = 0; x < this.numTilesX; x += 1) {
        this.tileMap[x] = [];
        for (y = 0; y < this.numTilesY; y += 1) {
            this.tileMap[x][y] = {type: null,
								  locked: false,
                                  explored: false,
                                  visible: false,
                                  ship: null,
                                  colony: null,
                                  items: [],
								  encounter: null,
                                  frame: null,
                                  tileIndex: {x: x, y: y}};
		}
	}
};

// CREATE_TILE_MAP:
// ************************************************************************************************
gameState.createTileMap = function () {
    var x,
        y,
        i,
        tileTypeMap,
		regionSize = this.numTilesX / this.numRegions,
		regionIndex,
		colonyTypes,
		colonyType,
		numEncounters,
		ship,
		regionTypes,
		tableEntry,
		turretName;
    
    console.log('Creating ' + this.sectorTypeName + ' Sector: ');
    
	if (this.sectorTypeName === 'Trade') {
		colonyTypes = ['Farming', 'Farming', 'Farming', 'Industrial', 'Industrial', 'Mining', 'Mining', 'Military', 'Shipyard'];
	} else if (this.sectorTypeName === 'Wild') {
		colonyTypes = ['MilitaryScoutPost', 'MilitaryScoutPost', 'ShipScoutPost', 'ShipScoutPost'];
	} else if (this.sectorTypeName === 'Hostile') {
		colonyTypes = ['MilitaryScoutPost', 'MilitaryScoutPost', 'ShipScoutPost', 'ShipScoutPost'];
	}
	
    // Create tileTypeMap:
	tileTypeMap = this.createTileTypeMap();

	regionTypes = [];
	for (x = 0; x < this.numRegions; x += 1) {
		regionTypes[x] = [];
		for (y = 0; y < this.numRegions; y += 1) {
			regionTypes[x][y] = this.chooseRandom(this.regionTypeTable[this.sectorTypeName][this.sectorLevel]);
		}
	}
	
    // Create empty map:
    for (x = 0; x < this.numTilesX; x += 1) {
        for (y = 0; y < this.numTilesY; y += 1) {
            this.tileMap[x][y].type = this.tileTypes[tileTypeMap[x][y].typeName];
			this.tileMap[x][y].locked =  tileTypeMap[x][y].locked;
		}
	}
	
	// Place stuff at center of regions:
	for (x = 0; x < this.numTilesX; x += 1) {
        for (y = 0; y < this.numTilesY; y += 1) {
			// Create colonies:
			if (tileTypeMap[x][y].sectorCenter) {
				regionIndex = {x: Math.floor(x / regionSize), y: Math.floor(y / regionSize)};
				
				// CREATE COLONY:
				if (this.regionTypes[this.sectorTypeName][regionIndex.x][regionIndex.y] === 'Colony') {
					colonyType = this.randElem(colonyTypes);
					this.removeFromArray(colonyType, colonyTypes);
					this.createColony({x: x, y: y}, regionIndex, colonyType);
					
					if (this.sectorTypeName === 'Hostile') {
						this.createEncounter({x: x + 3, y: y}, 'RepairDepot');
					}
					
				// CREATE ENEMY:
				} else if (this.regionTypes[this.sectorTypeName][regionIndex.x][regionIndex.y] === 'Enemy') {
					turretName = ['Turret', 'TurretII', 'TurretIII'][this.sectorLevel];
					
					this.createShip({x: x + 3, y: y}, turretName);
					this.createShip({x: x - 3, y: y}, turretName);
					
					if (this.sectorLevel >= 1) {
						this.createShip({x: x, y: y + 3}, turretName);
					}
					
					if (this.sectorLevel >= 2) {
						this.createShip({x: x, y: y - 3}, turretName);
					}
					
				// REPAIR DEBOT:
				} else if (this.regionTypes[this.sectorTypeName][regionIndex.x][regionIndex.y] === 'Repair') {
					this.createEncounter({x: x, y: y}, 'RepairDepot');
				}
			}
        }
    }
    
	
	// Spawn Freighters:
	if (this.sectorTypeName === 'Trade') {
		for (i = 0; i < this.colonyList.length; i += 1) {
			if (game.rnd.frac() < 0.5) {
				ship = this.createFreighterShip(this.colonyList[i]);

				// Choose initial destination:
				ship.chooseDestColony();
			}
		}
	}
	
	// Spawning encounters:
	for (x = 0; x < this.numRegions; x += 1) {
		for (y = 0; y < this.numRegions; y += 1) {
			numEncounters = this.sectorEncounterNum[this.sectorTypeName];
			for (i = 0; i < numEncounters; i += 1) {
				this.createEncounter(this.getRandomAsteroidIndexInBox(x * regionSize,
																	  y * regionSize,
																	  (x + 1) * regionSize,
																	  (y + 1) * regionSize),
									 this.chooseRandom(this.regionEncounterTable[regionTypes[x][y]]));
			}
		}
	}

	// Spawning additional gas clouds:
	if (this.sectorTypeName === 'Wild' || this.sectorTypeName === 'Hostile') {
		for (i = 0; i < 20; i += 1) {
			this.createEncounter(this.getRandomIndex({passable: true, unlocked: false, asteroid: false, noEncounter: true, noShip: false}), 'FuelCloud');
		}
	}
	
	// Spawn Black holes:
	if (this.sectorTypeName === 'Wild') {
		for (i = 0; i < 5; i += 1) {
			this.createBlackHole(this.getRandomPassableIndex());
		}
	}
	
	// Spawn Pulsers:
	if (this.sectorTypeName === 'Wild' && this.sectorLevel >= 1) {
		for (i = 0; i < 5; i += 1) {
			this.createPulser(this.getRandomPassableIndex());
		}
	}
	
	// Spawn Ships:
	for (i = 0; i < this.numShipsPerSector[this.sectorTypeName][this.sectorLevel]; i += 1) {
		tableEntry = this.sectorSpawnTable[this.sectorTypeName][this.sectorLevel][game.rnd.integerInRange(0, this.sectorSpawnTable[this.sectorTypeName][this.sectorLevel].length - 1)];
		this.spawnShips(this.getRandomPassableIndex(), tableEntry.typeName, tableEntry.num);
	}
	
	this.setWallFrames();
	
	this.createJobs();
};

// SET_WALL_FRAMES:
// ************************************************************************************************
gameState.setWallFrames = function () {
	var frameOffset, x, y;
	frameOffset = this.sectorFrameOffset[this.sectorTypeName];
	
    // Set frames (Wall Tiles):
    for (x = 0; x < this.numTilesX; x += 1) {
        for (y = 0; y < this.numTilesY; y += 1) {
            if (this.tileMap[x][y].type.name === 'Wall') {
                this.tileMap[x][y].frame = frameOffset + this.getWallFrame({x: x, y: y});
            } else if (this.tileMap[x][y].type.name === 'Asteroid') {
				this.tileMap[x][y].frame = frameOffset + game.rnd.integerInRange(32, 39);
			} else if (this.tileMap[x][y].type.name === 'Debris') {
				this.tileMap[x][y].frame = frameOffset + game.rnd.integerInRange(40, 47);
			} else {
				this.tileMap[x][y].frame = frameOffset + this.tileMap[x][y].type.imageIndex;
			}
        }
    }
};

// GET_WALL_FRAME:
// ************************************************************************************************
gameState.getWallFrame = function (tileIndex) {
    var x = tileIndex.x,
		y = tileIndex.y,
		matchPattern;
    
	matchPattern = function (pattern) {
		var x, y;
		for (x = 0; x < 3; x += 1) {
			for (y = 0; y < 3; y += 1) {
				if (pattern[y][x] === 1 && gameState.isTileIndexPassable({x: tileIndex.x - 1 + x, y: tileIndex.y - 1 + y})) {
					return false;
				}
				if (pattern[y][x] === 0 && !gameState.isTileIndexPassable({x: tileIndex.x - 1 + x, y: tileIndex.y - 1 + y})) {
					return false;
				}
			}
		}
		
		return true;
	};
	
	if (matchPattern([[2, 0, 1],
					  [1, 1, 1],
					  [1, 1, 0]])) {
		return 22;
	}
	
	if (matchPattern([[0, 1, 1],
					 [1, 1, 1],
					 [1, 0, 2]])) {
		return 23;
	}
	
	if (matchPattern([[1, 1, 2],
					  [1, 1, 0],
					  [0, 1, 1]])) {
		return 24;
	}
	
	if (matchPattern([[1, 1, 0],
					  [0, 1, 1],
					  [2, 1, 1]])) {
		return 25;
	}
	
	if (matchPattern([[1, 1, 0],
					  [1, 1, 1],
					  [2, 0, 1]])) {
		return 26;
	}
	
	
	if (matchPattern([[1, 0, 2],
					 [1, 1, 1],
					 [0, 1, 1]])) {
		return 27;
	}
	
	if (matchPattern([[0, 1, 1],
					  [1, 1, 0],
					  [1, 1, 2]])) {
		return 28;
	}
	
	if (matchPattern([[2, 1, 1],
					  [0, 1, 1],
					  [1, 1, 0]])) {
		return 29;
	}
	
	if (matchPattern([[0, 1, 1],
					  [1, 1, 1],
					  [1, 1, 0]])) {
		return 30;
	}
	
	if (matchPattern([[1, 1, 0],
					  [1, 1, 1],
					  [0, 1, 1]])) {
		return 31;
	}

    // Inside Corners:
    if (!gameState.isTileIndexPassable({x: x + 1, y: y})
            && !gameState.isTileIndexPassable({x: x - 1, y: y})
            && !gameState.isTileIndexPassable({x: x, y: y + 1})
            && !gameState.isTileIndexPassable({x: x, y: y - 1})
            && gameState.isTileIndexPassable({x: x + 1, y: y + 1})) {
        return 4;
    } else if (!gameState.isTileIndexPassable({x: x - 1, y: y})
            && !gameState.isTileIndexPassable({x: x + 1, y: y})
            && !gameState.isTileIndexPassable({x: x, y: y + 1})
            && !gameState.isTileIndexPassable({x: x, y: y - 1})
            && gameState.isTileIndexPassable({x: x - 1, y: y + 1})) {
        return 5;
    } else if (!gameState.isTileIndexPassable({x: x + 1, y: y})
            && !gameState.isTileIndexPassable({x: x - 1, y: y})
            && !gameState.isTileIndexPassable({x: x, y: y - 1})
            && !gameState.isTileIndexPassable({x: x, y: y + 1})
            && gameState.isTileIndexPassable({x: x + 1, y: y - 1})) {
        return 12;
    } else if (!gameState.isTileIndexPassable({x: x - 1, y: y})
            && !gameState.isTileIndexPassable({x: x + 1, y: y})
            && !gameState.isTileIndexPassable({x: x, y: y - 1})
            && !gameState.isTileIndexPassable({x: x, y: y + 1})
            && gameState.isTileIndexPassable({x: x - 1, y: y - 1})) {
        return 13;
        
    // Edges:
    } else if (gameState.isTileIndexPassable({x: x - 1, y: y})
            && !gameState.isTileIndexPassable({x: x + 1, y: y})
            && !gameState.isTileIndexPassable({x: x, y: y - 1})
            && !gameState.isTileIndexPassable({x: x, y: y + 1})) {
        return 9;
    } else if (!gameState.isTileIndexPassable({x: x - 1, y: y})
            && gameState.isTileIndexPassable({x: x + 1, y: y})
            && !gameState.isTileIndexPassable({x: x, y: y - 1})
            && !gameState.isTileIndexPassable({x: x, y: y + 1})) {
        return 1;
    } else if (!gameState.isTileIndexPassable({x: x - 1, y: y})
            && !gameState.isTileIndexPassable({x: x + 1, y: y})
            && gameState.isTileIndexPassable({x: x, y: y - 1})
            && !gameState.isTileIndexPassable({x: x, y: y + 1})) {
        return 8;
    } else if (!gameState.isTileIndexPassable({x: x - 1, y: y})
            && !gameState.isTileIndexPassable({x: x + 1, y: y})
            && !gameState.isTileIndexPassable({x: x, y: y - 1})
            && gameState.isTileIndexPassable({x: x, y: y + 1})) {
        return 0;
        
    // Solid:
    } else if (!gameState.isTileIndexPassable({x: x - 1, y: y})
            && !gameState.isTileIndexPassable({x: x + 1, y: y})
            && !gameState.isTileIndexPassable({x: x, y: y - 1})
            && !gameState.isTileIndexPassable({x: x, y: y + 1})) {
        return gameState.randElem([17, 18, 19, 20, 21, 21, 21, 21, 21]);
    
    // Outside Corners:
    } else if (!gameState.isTileIndexPassable({x: x - 1, y: y})
            && !gameState.isTileIndexPassable({x: x, y: y + 1})) {
        return 3;
    } else if (!gameState.isTileIndexPassable({x: x - 1, y: y})
            && !gameState.isTileIndexPassable({x: x, y: y - 1})) {
        return 11;
    } else if (!gameState.isTileIndexPassable({x: x + 1, y: y})
            && !gameState.isTileIndexPassable({x: x, y: y - 1})) {
        return 10;
    } else if (!gameState.isTileIndexPassable({x: x + 1, y: y})
            && !gameState.isTileIndexPassable({x: x, y: y + 1})) {
        return 2;
    } else {
		return 6;
	}
};



// GET_RANDOM_PASSABLE_INDEX_IN_BOX:
// ************************************************************************************************
gameState.getRandomPassableIndexInBox = function (startX, endX, startY, endY) {
    var index = {x: game.rnd.integerInRange(startX, endX),
                 y: game.rnd.integerInRange(startY, endY)},
        maxLoop = 0;
    
    while (!this.isTileIndexPassable(index)) {
        index = {x: game.rnd.integerInRange(startX, endX),
                 y: game.rnd.integerInRange(startY, endY)};
        
        maxLoop += 1;
        if (maxLoop > 1000) {
            console.log('getRandomPassableIndexInBox(): failed...');
            return null;
        }
    }

    return index;
};
    
// SAVE_TILE_MAP:
// ************************************************************************************************
gameState.saveTileMap = function () {
    var x,
        y,
        i,
		j,
        data;
    
    data = {};
    
    // Save npcs
    data.ships = [];
    for (i = 0; i < this.characterList.length; i += 1) {
        if (this.characterList[i].isAlive) {
			
			// Saving a freighter:
			if (this.characterList[i].type.name === 'Freighter') {
				data.ships.push({typeName: this.characterList[i].type.name,
								tileIndex: this.characterList[i].tileIndex,
								currentHp: this.characterList[i].currentHp,
								destColonyName: this.characterList[i].destColony.name});
				
			// Saving a normal ship:
			} else if (this.characterList[i].type.name !== 'PlayerShip') {
				data.ships.push({typeName: this.characterList[i].type.name,
								tileIndex: this.characterList[i].tileIndex,
								currentHp: this.characterList[i].currentHp});
			}
        }
    }
    
    // Save items:
    data.items = [];
    for (i = 0; i < this.itemList.length; i += 1) {
        if (this.itemList[i].isAlive) {
            data.items.push({typeName: this.itemList[i].type.name,
                             amount: this.itemList[i].amount,
                             tileIndex: this.itemList[i].tileIndex});
        }
    }
    

    
    // Save colonies:
    data.colonies = [];
    for (i = 0; i < this.colonyList.length; i += 1) {
        data.colonies.push({tileIndex: this.colonyList[i].tileIndex,
							coloniesMapIndex: this.colonyList[i].coloniesMapIndex,
                            typeName: this.colonyList[i].type.name,
						    name: this.colonyList[i].name,
						    inventory: []});
		
		for (j = 0; j < this.colonyList[i].inventory.length; j += 1) {
			data.colonies[data.colonies.length - 1].inventory.push({itemTypeName: this.colonyList[i].inventory[j].itemTypeName,
																	amount: this.colonyList[i].inventory[j].amount});
		}
		
		if (this.colonyList[i].job) {
			data.colonies[data.colonies.length - 1].job = {typeName: 'Delivery',
														   colonyName: this.colonyList[i].job.colonyName,
														   reward: this.colonyList[i].job.reward};
		} else {
			data.colonies[data.colonies.length - 1].job = null;
		}
    }
    
    // Save Tilemap:
    data.tileMap = [];
    for (x = 0; x < this.numTilesX; x += 1) {
        data.tileMap[x] = [];
        for (y = 0; y < this.numTilesY; y += 1) {
            data.tileMap[x][y] = {typeName: this.tileMap[x][y].type.name,
                                  explored: this.tileMap[x][y].explored};
        }
    }
    
    console.log('Saving Sector: ' + this.currentSector.x + ',' + this.currentSector.y);
    localStorage.setItem('Sector' + this.currentSector.x + ',' + this.currentSector.y, JSON.stringify(data));
};

// LOAD_TILE_MAP:
// ************************************************************************************************
gameState.loadTileMap = function () {
    var x,
        y,
        i,
		j,
        data,
        ship,
		colony;
    
    console.log('Loading Sector: ' + this.currentSector.x + ',' + this.currentSector.y);
    data = JSON.parse(localStorage.getItem('Sector' + this.currentSector.x + ',' + this.currentSector.y));
    
    // Load the tileMap:
    for (x = 0; x < this.numTilesX; x += 1) {
        for (y = 0; y < this.numTilesY; y += 1) {
            this.tileMap[x][y].type = this.tileTypes[data.tileMap[x][y].typeName];
            this.tileMap[x][y].character = null;
            this.tileMap[x][y].items = [];
            this.tileMap[x][y].colony = null;
            this.tileMap[x][y].explored = data.tileMap[x][y].explored;
            this.tileMap[x][y].frame = null;
        }
    }
	
    // Load items:
    for (i = 0; i < data.items.length; i += 1) {
        this.createItem(data.items[i].tileIndex, data.items[i].typeName, data.items[i].amount);
    }
    
    // Load colonies:
    for (i = 0; i < data.colonies.length; i += 1) {
        colony = this.createColony(data.colonies[i].tileIndex, data.colonies[i].coloniesMapIndex, data.colonies[i].typeName, data.colonies[i].name);
		
		// Load inventory:
		colony.inventory.removeAllItems();
		for (j = 0; j < data.colonies[i].inventory.length; j += 1) {
			colony.inventory.addItem(data.colonies[i].inventory[j].itemTypeName, data.colonies[i].inventory[j].amount);
		}
		
		// Load job:
		if (data.colonies[i].job) {
			colony.job = {typeName: data.colonies[i].job.typeName,
						  colony: data.colonies[i].job.colonyName,
						  reward: data.colonies[i].job.reward};
		} else {
			colony.job = null;
		}
	}
	
	// load ships:
    for (i = 0; i < data.ships.length; i += 1) {
		if (data.ships[i].typeName === 'Freighter') {
			ship = this.createFreighterShip(this.colonyList[0]);
			ship.moveToTileIndex(data.ships[i].tileIndex);
			ship.destColony = this.getColonyWithName(data.ships[i].destColonyName);
			ship.destination = gameState.getPositionFromTileIndex(ship.destColony.tileIndex);
		} else {
			ship = this.createShip(data.ships[i].tileIndex, data.ships[i].typeName);
		}
        ship.currentHp = data.ships[i].currentHp;
    }
	
	this.setWallFrames();
};

// CREATE_TILE_MAP_SPRITES:
// ************************************************************************************************
gameState.createTileMapSprites = function () {
    var x, y;
    
    this.tileMapSprites = [];
    for (x = 0; x < this.numScreenTilesX; x += 1) {
        this.tileMapSprites[x] = [];
        for (y = 0; y < this.numScreenTilesY; y += 1) {
            this.tileMapSprites[x][y] = this.tileMapSpritesGroup.create(x * this.tileSize, y * this.tileSize, 'MapTileset');
            this.tileMapSprites[x][y].smoothed = false;
            this.tileMapSprites[x][y].scale.setTo(this.scaleFactor, this.scaleFactor);
            this.tileMapSprites[x][y].frame = this.tileMap[x][y].type.imageIndex;
        }
    }
};

// UPDATE_TILE_MAP_SPRITES:
// ************************************************************************************************
gameState.updateTileMapSprites = function () {
    var x, y,
        cameraTileX = Math.floor(game.camera.x / this.tileSize),
        cameraTileY = Math.floor(game.camera.y / this.tileSize),
		i;

    for (x = 0; x < this.numScreenTilesX; x += 1) {
        for (y = 0; y < this.numScreenTilesY; y += 1) {
            this.tileMapSprites[x][y].x = ((cameraTileX + x) * this.tileSize);
            this.tileMapSprites[x][y].y = ((cameraTileY + y) * this.tileSize);

            // If in bounds:
            if (this.isTileIndexInBounds({x: cameraTileX + x, y: cameraTileY + y})) {
                this.tileMapSprites[x][y].visible = true;
                
                // Wall tiles have their frame saved:
                if (this.tileMap[cameraTileX + x][cameraTileY + y].type.name !== 'Space' && this.tileMap[cameraTileX + x][cameraTileY + y].frame !== null) {
                    this.tileMapSprites[x][y].frame = this.tileMap[cameraTileX + x][cameraTileY + y].frame;
                    
                // Other tiles just use the tileType imageIndex:
                } else {
                    this.tileMapSprites[x][y].frame = this.tileMap[cameraTileX + x][cameraTileY + y].type.imageIndex;
                }
                
                
                // If explored:
                if (this.tileMap[cameraTileX + x][cameraTileY + y].explored) {
					this.tileMapSprites[x][y].alpha = 1.0;

					// Make item visible:
					if (this.tileMap[cameraTileX + x][cameraTileY + y].items.length > 0) {
						for (i = 0; i < this.tileMap[cameraTileX + x][cameraTileY + y].items.length; i += 1) {
							this.tileMap[cameraTileX + x][cameraTileY + y].items[i].sprite.visible = true;
						}
					}

					// Make colony visible: 
					if (this.tileMap[cameraTileX + x][cameraTileY + y].colony) {
						this.tileMap[cameraTileX + x][cameraTileY + y].colony.sprite.visible = true;
						this.tileMap[cameraTileX + x][cameraTileY + y].colony.nameText.visible = true;
					}

					// Make encounters visible:
					if (this.tileMap[cameraTileX + x][cameraTileY + y].encounter) {
						this.tileMap[cameraTileX + x][cameraTileY + y].encounter.sprite.visible = true;
					}
					
					// Make ships visible:
					if (this.tileMap[cameraTileX + x][cameraTileY + y].ship) {
						this.tileMap[cameraTileX + x][cameraTileY + y].ship.sprite.visible = true;
					}
            
                // If not explored:
                } else {
                    this.tileMapSprites[x][y].visible = false;
                    
                    // Hide item:
                    if (this.tileMap[cameraTileX + x][cameraTileY + y].items.length > 0) {
                        for (i = 0; i < this.tileMap[cameraTileX + x][cameraTileY + y].items.length; i += 1) {
							this.tileMap[cameraTileX + x][cameraTileY + y].items[i].sprite.visible = false;
						}
                    }
                    // Hide colony: 
                    if (this.tileMap[cameraTileX + x][cameraTileY + y].colony) {
                        this.tileMap[cameraTileX + x][cameraTileY + y].colony.sprite.visible = false;
						this.tileMap[cameraTileX + x][cameraTileY + y].colony.nameText.visible = false;
                    }
					// Hide encounters:
					if (this.tileMap[cameraTileX + x][cameraTileY + y].encounter) {
						this.tileMap[cameraTileX + x][cameraTileY + y].encounter.sprite.visible = false;
					}
					
					// Hide Ships:
					if (this.tileMap[cameraTileX + x][cameraTileY + y].ship) {
						this.tileMap[cameraTileX + x][cameraTileY + y].ship.sprite.visible = false;
					}
                }
            // If not in bounds:
            } else {
                this.tileMapSprites[x][y].visible = false;
            }
        }
    }
};

// UPDATE_FOV
// ************************************************************************************************
gameState.updateFoV = function () {
	var x,
		y,
		tileDistance = 5,
		distance = tileDistance * this.tileSize,
		tileIndex = this.playerCharacter.tileIndex,
		tileIndexIt;
	
	for (x = tileIndex.x - tileDistance * 2; x < tileIndex.x + tileDistance * 2; x += 1) {
		for (y = tileIndex.y - tileDistance * 2; y < tileIndex.y + tileDistance * 2; y += 1) {
			tileIndexIt = {x: x, y: y};
			
			if (this.isTileIndexInBounds(tileIndexIt)) {
				if (this.getDistance(this.getPositionFromTileIndex(tileIndexIt), this.getPositionFromTileIndex(tileIndex)) < distance) {
					this.getTile(tileIndexIt).visible = true;
					
					if (!this.getTile(tileIndexIt).explored) {
						this.getTile(tileIndexIt).explored = true;
						this.playerCharacter.gainExp(1);
						if (this.sectorTypeName === 'Wild') {
							this.exploredTiles += 1;
							this.playerCharacter.exploredCount += 1;
							
							if (this.exploredTiles === 75) {
								this.exploredTiles = 0;
								this.playerCharacterGainCredits(this.wildSectorExploreReward[this.sectorLevel]);
							}
						}
					}
				} else {
					this.getTile(tileIndexIt).visible = false;
				}
			}
		}
	}
};

// IS_RAY_CLEAR:
// ************************************************************************************************
gameState.isRayClear = function (startPosition, endPosition) {
    var length = game.math.distance(startPosition.x, startPosition.y, endPosition.x, endPosition.y),
        normal = this.getNormal(startPosition, endPosition),
        currentPosition = startPosition,
        currentTileIndex,
        step = 8,
        currentDistance = 0;
    
    for (currentDistance = 0; currentDistance < length; currentDistance += step) {
        currentPosition = {x: startPosition.x + normal.x * currentDistance,
                           y: startPosition.y + normal.y * currentDistance};
        currentTileIndex = this.getTileIndexFromPosition(currentPosition);
        if (!this.isTileIndexInBounds(currentTileIndex) || !this.getTile(currentTileIndex).type.passable) {
            return false;
        }
    }
    
    return true;
};

// ENTER_GATE:
// ************************************************************************************************
gameState.enterGate = function (gate) {
	this.playerCharacter.gainCredits(this.bonusCash);
	this.savePlayerShip();
	game.state.start('menu');
};

// ENTER_ASTEROID:
// ************************************************************************************************
gameState.enterAsteroid = function (ship) {
    if (game.rnd.integerInRange(0, 100) < 60 - (ship.skills.navigation * 10)) {
        ship.takeDamage(1, gameState.getPositionFromTileIndex(ship.tileIndex), 'You were killed by an asteroid');
    }
};

// CALCULATE_PATH:
// ************************************************************************************************
gameState.calculatePath = function (fromIndex, toIndex, speed) {
    var currentTile,
        path = [],
        openTiles = [],
        closedTiles = [],
        isInOpenTiles,
        isInClosedTiles,
        addToOpenList,
        loopCount = 0;
    
    if (!speed) {
        speed = 'fast';
    }

    // IS IN OPEN TILES:
    isInOpenTiles = function (index) {
        var i;
        for (i = 0; i < openTiles.length; i += 1) {
            if (openTiles[i].index.x === index.x && openTiles[i].index.y === index.y) {
                return true;
            }
        }
        return false;
    };

    // IS IN CLOSED TILES:
    isInClosedTiles = function (index) {
        var i;
        for (i = 0; i < closedTiles.length; i += 1) {
            if (closedTiles[i].index.x === index.x && closedTiles[i].index.y === index.y) {
                return true;
            }
        }
        return false;
    };

    // ADD TO OPEN LIST:
    addToOpenList = function (index, parent) {
        if (!isInOpenTiles(index) && !isInClosedTiles(index) && gameState.isTileIndexPassable(index)) {
            openTiles.push({index: index, parent: parent});
        // Always add the goal
        } else if (index.x === toIndex.x && index.y === toIndex.y) {
            openTiles.push({index: index, parent: parent});
        }
    };

    // Push the start index and set its parent to null
    openTiles.push({index: fromIndex, parent: null});

    while (openTiles.length > 0) {
        // Pop the first element:
        currentTile = openTiles.shift();
        closedTiles.push(currentTile);

        // Add adjacent tiles that are not on open or closed list:
        addToOpenList({x: currentTile.index.x + 1, y: currentTile.index.y}, currentTile);
        addToOpenList({x: currentTile.index.x - 1, y: currentTile.index.y}, currentTile);
        addToOpenList({x: currentTile.index.x, y: currentTile.index.y + 1}, currentTile);
        addToOpenList({x: currentTile.index.x, y: currentTile.index.y - 1}, currentTile);
        
        if (gameState.getTile(currentTile.index).type.name !== 'Water'
                && gameState.getTile(currentTile.index).type.name !== 'VineFloor'
                && speed === 'fast') {
            addToOpenList({x: currentTile.index.x + 1, y: currentTile.index.y - 1}, currentTile);
            addToOpenList({x: currentTile.index.x - 1, y: currentTile.index.y - 1}, currentTile);
            addToOpenList({x: currentTile.index.x + 1, y: currentTile.index.y + 1}, currentTile);
            addToOpenList({x: currentTile.index.x - 1, y: currentTile.index.y + 1}, currentTile);
        }
        
        // Check if done:
        if (currentTile.index.x === toIndex.x && currentTile.index.y === toIndex.y) {
            // Create path
            while (currentTile.parent) {
                path.push(currentTile.index);
                currentTile = currentTile.parent;
            }
            break;
        }

        loopCount += 1;
        if (loopCount > 200) {
            console.log('loopCount exceeded');
            return null;
        }

    }
    return path;
};

// GET_PASSABLE_ADJACENT_INDEX:
// ************************************************************************************************
gameState.getPassableAdjacentIndex = function (tileIndex) {
	var possibleIndex = [{x: tileIndex.x + 1, y: tileIndex.y},
						 {x: tileIndex.x - 1, y: tileIndex.y},
						 {x: tileIndex.x, y: tileIndex.y + 1},
						 {x: tileIndex.x, y: tileIndex.y - 1},
						 {x: tileIndex.x + 1, y: tileIndex.y + 1},
						 {x: tileIndex.x - 1, y: tileIndex.y + 1},
						 {x: tileIndex.x + 1, y: tileIndex.y - 1},
						 {x: tileIndex.x - 1, y: tileIndex.y - 1}],
		i;
	
	for (i = 0; i < possibleIndex.length; i += 1) {
		if (this.isTileIndexInBounds(possibleIndex[i])
				&& this.isTileIndexPassable(possibleIndex[i])
				&& !this.getTile(possibleIndex[i]).ship) {
			return possibleIndex[i];
		}
	}
	
	console.log('getPassableAdjacentIndex(): Failed');
	return null;
};

// GET_RANDOM_INDEX:
// ************************************************************************************************
// Flags: passable, unlocked, asteroid, noEncounter, noShip
gameState.getRandomIndex = function (flags) {
	var index = {x: game.rnd.integerInRange(0, this.numTilesX - 1),
                 y: game.rnd.integerInRange(0, this.numTilesY - 1)},
		maxLoop = 0,
		isValidIndex;
    
	isValidIndex = function (index) {
		if (flags.passable && !gameState.isTileIndexPassable(index)) {
			return false;
		}
		if (flags.unlocked && gameState.getTile(index).locked) {
			return false;
		}
		if (flags.asteroid && gameState.getTile(index).type.name !== 'Asteroid') {
			return false;
		}
		if (flags.noEncounter && gameState.getTile(index).encounter) {
			return false;
		}
		if (flags.noShip && gameState.getTile(index).ship) {
			return false;
		}
		return true;
			
	};
	
	
    while (!isValidIndex(index)) {
        index = {x: game.rnd.integerInRange(0, this.numTilesX - 1),
                 y: game.rnd.integerInRange(0, this.numTilesY - 1)};
		
		maxLoop += 1;
        if (maxLoop > 1000) {
            console.log('getRandomIndex(): failed...');
            return null;
        }
    }
	
	return index;
};
// GET_RANDOM_PASSABLE_INDEX:
// ************************************************************************************************
gameState.getRandomPassableIndex = function () {
    var index = {x: game.rnd.integerInRange(0, this.numTilesX - 1),
                 y: game.rnd.integerInRange(0, this.numTilesY - 1)},
		maxLoop = 0;
    
    while (!this.isTileIndexPassable(index) || this.getTile(index).locked || this.getTile(index).ship) {
        index = {x: game.rnd.integerInRange(0, this.numTilesX - 1),
                 y: game.rnd.integerInRange(0, this.numTilesY - 1)};
		
		maxLoop += 1;
        if (maxLoop > 1000) {
            console.log('getRandomPassableIndex(): failed...');
            return null;
        }
    }
    
    return index;
};

// GET_RANDOM_ASTEROID_INDEX:
// ************************************************************************************************
gameState.getRandomAsteroidIndex = function () {
    var index = {x: game.rnd.integerInRange(0, this.numTilesX - 1),
                 y: game.rnd.integerInRange(0, this.numTilesY - 1)},
		maxLoop = 0;
    
    while (this.getTile(index).type.name !== 'Asteroid' || this.getTile(index).encounter || this.getTile(index).locked) {
        index = {x: game.rnd.integerInRange(0, this.numTilesX - 1),
                 y: game.rnd.integerInRange(0, this.numTilesY - 1)};
		
		maxLoop += 1;
        if (maxLoop > 1000) {
            console.log('getRandomAsteroidIndex(): failed...');
            return null;
        }
    }
    
    return index;
};

// GET_RANDOM_ASTEROID_INDEX:
// ************************************************************************************************
gameState.getRandomAsteroidIndexInBox = function (startX, startY, endX, endY) {
    var index = {x: game.rnd.integerInRange(startX, endX - 1),
                 y: game.rnd.integerInRange(startY, endY - 1)},
		maxLoop = 0;
    
    while (this.getTile(index).type.name !== 'Asteroid' || this.getTile(index).encounter || this.getTile(index).locked) {
        index = {x: game.rnd.integerInRange(startX, endX - 1),
                 y: game.rnd.integerInRange(startY, endY - 1)};
		
		maxLoop += 1;
        if (maxLoop > 1000) {
            console.log('getRandomAsteroidIndexInBox(): failed...');
            return null;
        }
    }
    
    return index;
};

// GET_NORMAL:
// ************************************************************************************************
gameState.getNormal = function (startPosition, endPosition) {
    var length = game.math.distance(startPosition.x, startPosition.y, endPosition.x, endPosition.y);
    
    return {x: (endPosition.x - startPosition.x) / length,
            y: (endPosition.y - startPosition.y) / length};
};

// GET_TILE:
// ************************************************************************************************
gameState.getTile = function (tileIndex) {
    if (this.isTileIndexInBounds(tileIndex)) {
        return this.tileMap[tileIndex.x][tileIndex.y];
    } else {
        return null;
    }
};

// SET_TILE_TYPE:
// ************************************************************************************************
gameState.setTileType = function (tileIndex, tileType) {
    var frameOffset = this.sectorFrameOffset[this.sectorTypeName];
	
	if (this.isTileIndexInBounds(tileIndex)) {
        this.tileMap[tileIndex.x][tileIndex.y].type = tileType;
		this.tileMap[tileIndex.x][tileIndex.y].frame = tileType.imageIndex + frameOffset;
		
    }
};

// SET_TILE_INDEX_EXPLORED:
// ************************************************************************************************
gameState.setTileIndexExplored = function (tileIndex) {
    if (this.isTileIndexInBounds(tileIndex)) {
        this.tileMap[tileIndex.x][tileIndex.y].explored = true;
    }
};

// SET_TILE_INDEX_VISIBLE:
// ************************************************************************************************
gameState.setTileIndexVisible = function (tileIndex) {
    if (this.isTileIndexInBounds(tileIndex)) {
        this.tileMap[tileIndex.x][tileIndex.y].visible = true;
    }
};

// GET_TILE_INDEX_FROM_POSITION:
// ************************************************************************************************
gameState.getTileIndexFromPosition = function (position) {
    return {x: Math.floor(position.x / this.tileSize), y: Math.floor(position.y / this.tileSize)};
};
    
// GET_POSITION_FROM_TILE_INDEX:
// ************************************************************************************************
gameState.getPositionFromTileIndex = function (tileIndex) {
    return {x: tileIndex.x * this.tileSize + this.tileSize / 2,
            y: tileIndex.y * this.tileSize + this.tileSize / 2};
};
    
// IS_TILE_INDEX_PASSABLE:
// ************************************************************************************************
gameState.isTileIndexPassable = function (tileIndex) {
    return this.isTileIndexInBounds(tileIndex) && this.getTile(tileIndex).type.passable;
};

// IS_TILE_INDEX_TRANSPARENT:
// ************************************************************************************************
gameState.isTileIndexTransparent = function (tileIndex) {
    return this.isTileIndexInBounds(tileIndex) && this.getTile(tileIndex).type.transparent;
};

// IS_TILE_INDEX_IN_BOUNDS:
// ************************************************************************************************
gameState.isTileIndexInBounds = function (tileIndex) {
    return tileIndex.x >= 0 && tileIndex.x < this.numTilesX && tileIndex.y >= 0 && tileIndex.y < this.numTilesY;
};

// IS_ADJACENT:
// ************************************************************************************************
gameState.isAdjacent = function (tileIndex1, tileIndex2) {
    return (Math.abs(tileIndex1.x - tileIndex2.x) + Math.abs(tileIndex1.y - tileIndex2.y)) === 1;
};

// GET_TILE_DISTANCE:
// ************************************************************************************************
gameState.getTileDistance = function (tileIndex1, tileIndex2) {
    return game.math.distance(tileIndex1.x, tileIndex1.y, tileIndex2.x, tileIndex2.y);
};


// GET TILES IN RAY:
// ************************************************************************************************
gameState.getTilesInRay = function (startPos, endPos) {
    var x = startPos.x,
        y = startPos.y,
        stepSize = 4,
        distance = 0,
        finalDistance = game.math.distance(startPos.x, startPos.y, endPos.x, endPos.y),
        normal = gameState.getNormal(startPos, endPos),
        tile,
        tiles = [];

    while (distance < finalDistance) {
        x += normal.x * stepSize;
        y += normal.y * stepSize;
        distance += stepSize;

        tile = this.getTile(this.getTileIndexFromPosition({x: x, y: y}));
        if (tile && !gameState.inArray(tile, tiles)) {
            tiles.push(tile);
        }
    }

    return tiles;
};