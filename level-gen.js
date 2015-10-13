/*global game, console, gameState*/
'use strict';

// CREATE_TILE_TYPE_MAP:
// *****************************************************************************
gameState.createTileTypeMap = function () {
    var tileTypeMap,
		finalMap,
		sectorCenterIndex,
		x,
		y,
		maxLoop = 0,
		count = 0,
		sectorSize = this.numTilesX / this.numRegions,
		index,
		fillRadius,
		createPath,
		createFence,
		sectorMargin = Math.floor(sectorSize / 4),
		asteroidMap;
    
    // Create tile type map:
    tileTypeMap = [];
	finalMap = [];
	asteroidMap = [];
    for (x = 0; x < this.numTilesX; x += 1) {
        tileTypeMap[x] = [];
		finalMap[x] = [];
		asteroidMap[x] = [];
        for (y = 0; y < this.numTilesY; y += 1) {
            tileTypeMap[x][y] = {typeName: 'Space', sectorCenter: false, locked: false};
			finalMap[x][y] = {typeName: 'Space', sectorCenter: false, locked: false};
			asteroidMap[x][y] = {typeName: 'Space'};
        }
    }
	
	// Fill caves in odd sectors:
	for (x = 0; x < this.numRegions; x += 1) {
		for (y = 0; y < this.numRegions; y += 1) {
			if (game.rnd.frac() < 0.5) {
				this.fillCaveFunc(tileTypeMap,
								  {startX: x * sectorSize, startY: y * sectorSize, endX: (x + 1) * sectorSize, endY: (y + 1) * sectorSize},
								  'Wall', 0.4);
			}
		}
	}
	
	// Fill Asteroids:
	this.fillCaveFunc(asteroidMap, {startX: 0, startY: 0, endX: this.numTilesX, endY: this.numTilesY}, 'Asteroid', 0.5);
	
	// Copy asteroids into map:
	for (x = 0; x < this.numTilesX - 1; x += 1) {
		for (y = 0; y < this.numTilesY - 1; y += 1) {
			if (asteroidMap[x][y].typeName === 'Asteroid' && tileTypeMap[x][y].typeName === 'Space') {
				tileTypeMap[x][y].typeName = 'Asteroid';
			}
		}
	}
	
	// FILL_RADIUS:
	// ****************************************************************************
	fillRadius = function (centerTileIndex, tileRadius, tileTypeName) {
		var x, y;
		for (x = centerTileIndex.x - tileRadius; x <= centerTileIndex.x + tileRadius; x += 1) {
			for (y = centerTileIndex.y - tileRadius; y <= centerTileIndex.y + tileRadius; y += 1) {
				if (gameState.isTileIndexInBounds({x: x, y: y}) && game.math.distance(centerTileIndex.x, centerTileIndex.y, x, y) <= tileRadius) {
					tileTypeMap[x][y].typeName = tileTypeName;
					tileTypeMap[x][y].locked = true;
				}
			}
		}

	};
	
	// Place colonies:
	sectorCenterIndex = [];
	for (x = 0; x < this.numRegions; x += 1) {
		sectorCenterIndex[x] = [];
		for (y = 0; y < this.numRegions; y += 1) {
			index = {x: game.rnd.integerInRange(x * sectorSize + sectorMargin, (x + 1) * sectorSize - sectorMargin - 1),
					 y: game.rnd.integerInRange(y * sectorSize + sectorMargin, (y + 1) * sectorSize - sectorMargin - 1)};
			fillRadius(index, 6, 'Space');
			sectorCenterIndex[x][y] = index;
			tileTypeMap[index.x][index.y].sectorCenter = true;
		}
	}
	
	// CREATE_PATH:
	// ************************************************************************************************
	createPath = function (startIndex, endIndex) {
		var startPos = {x: startIndex.x * gameState.tileSize + gameState.tileSize / 2,
						y: startIndex.y * gameState.tileSize + gameState.tileSize / 2},
			endPos = {x: endIndex.x * gameState.tileSize + gameState.tileSize / 2,
					  y: endIndex.y * gameState.tileSize + gameState.tileSize / 2},
			x = startPos.x,
			y = startPos.y,
			stepSize = 8,
			distance = 0,
			finalDistance = game.math.distance(startPos.x, startPos.y, endPos.x, endPos.y),
			normal = gameState.getNormal(startPos, endPos),
			clearPercent = 0.8,
			setTile;
		
		setTile = function (x, y) {
			if (tileTypeMap[x][y].typeName === 'Wall') {
				tileTypeMap[x][y].typeName = 'Space';
			} else if (game.rnd.frac() > clearPercent) {
				tileTypeMap[x][y].typeName = 'Space';
			}
			
			tileTypeMap[x][y].locked = true;
		};

		while (distance < finalDistance) {
			x += normal.x * stepSize;
			y += normal.y * stepSize;
			distance += stepSize;

			setTile(Math.floor(x / gameState.tileSize), Math.floor(y / gameState.tileSize));
			setTile(Math.floor(x / gameState.tileSize) + 1, Math.floor(y / gameState.tileSize));
			setTile(Math.floor(x / gameState.tileSize), Math.floor(y / gameState.tileSize) + 1);
			setTile(Math.floor(x / gameState.tileSize) + 2, Math.floor(y / gameState.tileSize));
			setTile(Math.floor(x / gameState.tileSize), Math.floor(y / gameState.tileSize) + 2);
			setTile(Math.floor(x / gameState.tileSize) - 1, Math.floor(y / gameState.tileSize));
			setTile(Math.floor(x / gameState.tileSize), Math.floor(y / gameState.tileSize) - 1);
		}
	};
	
	// Carve paths:
	for (x = 0; x < this.numRegions; x += 1) {
		for (y = 0; y < this.numRegions; y += 1) {
			if (x + 1 < this.numRegions) {
				createPath(sectorCenterIndex[x][y], sectorCenterIndex[x + 1][y]);
			}
			if (y + 1 < this.numRegions) {
				createPath(sectorCenterIndex[x][y], sectorCenterIndex[x][y + 1]);
			}
		}
	}
	
	// CREATE_FENCE:
	// ************************************************************************************************
	createFence = function (startIndex, endIndex) {
		var x = startIndex.x,
			y = startIndex.y,
			stepSize = 3,
			distance = 0,
			finalDistance = game.math.distance(startIndex.x, startIndex.y, endIndex.x, endIndex.y),
			normal = gameState.getNormal(startIndex, endIndex);

		while (distance < finalDistance) {
			x += normal.x * stepSize;
			y += normal.y * stepSize;
			distance += stepSize;

			if (gameState.isTileIndexInBounds({x: x, y: y})) {
				tileTypeMap[x][y].typeName = 'Fence';
			}
		}
	};
	
	// Create fence:
	//createFence({x: 40, y: 40}, {x: 120, y: 40});
	//createFence({x: 40, y: 40}, {x: 40, y: 120});
	
	// Copy into final map using off by 1:
	for (x = 0; x < this.numTilesX - 1; x += 1) {
		for (y = 0; y < this.numTilesY - 1; y += 1) {
			if (tileTypeMap[x][y].typeName === 'Wall') {
				finalMap[x][y].typeName = 'Wall';
				finalMap[x + 1][y].typeName = 'Wall';
				finalMap[x][y + 1].typeName = 'Wall';
				finalMap[x + 1][y + 1].typeName = 'Wall';
			} else if (finalMap[x][y].typeName !== 'Wall') {
				finalMap[x][y].typeName = tileTypeMap[x][y].typeName;
			}
			
			if (tileTypeMap[x][y].sectorCenter) {
				finalMap[x + 1][y + 1].sectorCenter = true;
			}
			
			if (tileTypeMap[x][y].locked) {
				finalMap[x][y].locked = true;
				finalMap[x + 1][y].locked = true;
				finalMap[x][y + 1].locked = true;
				finalMap[x + 1][y + 1].locked = true;
			}
		}
	}
	
	// TESTING MAP GEN:
	/*
	var temp = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 1, 1, 0, 1, 1, 1, 0, 0],
				[0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
				[0, 0, 1, 1, 1, 0, 1, 1, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
	
	for (x = 0; x < 10; x += 1) {
		for (y = 0; y < 10; y += 1) {
			if (temp[y][x] === 0) {
				finalMap[x][y].typeName = 'Space';
			} else {
				finalMap[x][y].typeName = 'Wall';
			}
		}
	}
	*/
	
    return finalMap;
};

// FILL CAVE FUNC:
// *****************************************************************************
gameState.fillCaveFunc = function (map, area, wallName, initialWeight) {
    var areaMap,
        areaWidth = area.endX - area.startX,
        areaHeight = area.endY - area.startY,
        i,
        x,
        y,
        inBounds,
        countWalls,
        iterateFunc1,
        iterateFunc2,
        floodFunc,
        floodResult,
        success = false;
    
    // IN BOUNDS:
    // *************************************************************************
    inBounds = function (x, y) {
        return x >= 0 &&  y >= 0 && x < areaWidth && y < areaHeight;
    };
    
    // COUNT WALLS:
    // *************************************************************************
    countWalls = function (mapIn, xIn, yIn, dist) {
        var x, y, count = 0;
        for (x = xIn - dist; x <= xIn + dist; x += 1) {
            for (y = yIn - dist; y <= yIn + dist; y += 1) {
                count += !inBounds(x, y) || mapIn[x][y] === wallName ? 1 : 0;
            }
        }
        return count;
    };
    
    // ITERATE FUNC 1:
    // *************************************************************************
    iterateFunc1 = function (oldMap) {
        var newMap = [];
        for (x = 0;  x < areaWidth; x += 1) {
            newMap[x] = [];
            for (y = 0; y < areaHeight; y += 1) {
                newMap[x][y] = countWalls(oldMap, x, y, 1) >= 5 || countWalls(oldMap, x, y, 2) <= 2 ? wallName : 'Space';
            }
        }
        return newMap;
    };
    
    // ITERATE FUNC 2:
    // *************************************************************************
    iterateFunc2 = function (oldMap) {
        var newMap = [];
        for (x = 0;  x < areaWidth; x += 1) {
            newMap[x] = [];
            for (y = 0; y < areaHeight; y += 1) {
                newMap[x][y] = countWalls(oldMap, x, y, 1) >= 5 ? wallName : 'Space';
            }
        }
        return newMap;
    };
    
    // FLOOD FUNC:
    // *************************************************************************
    floodFunc = function (map, startX, startY) {
        var x, y, floodMap, count = 0, iterFunc;
        
        // Trivial case:
        if (map[startX][startY] === wallName) {
            return 0;
        }
        
        floodMap = [];
        for (x = 0; x < areaWidth; x += 1) {
            floodMap[x] = [];
            for (y = 0; y < areaHeight; y += 1) {
                floodMap[x][y] = map[x][y] === wallName ? 1 : 0;
            }
        }
        
        iterFunc = function (x, y) {
            count += 1;
            floodMap[x][y] = 2;
            if (inBounds(x + 1, y) && floodMap[x + 1][y] === 0) {
                iterFunc(x + 1, y);
            }
            if (inBounds(x - 1, y) && floodMap[x - 1][y] === 0) {
                iterFunc(x - 1, y);
            }
            if (inBounds(x, y + 1) && floodMap[x][y + 1] === 0) {
                iterFunc(x, y + 1);
            }
            if (inBounds(x, y - 1) && floodMap[x][y - 1] === 0) {
                iterFunc(x, y - 1);
            }
        };
        
        iterFunc(startX, startY);
        //console.log(count);
        return {count: count, map: floodMap};
    };
    
    // FILL CAVE:
    // *************************************************************************
    // Initial Noise:
    areaMap = [];
    for (x = 0; x < areaWidth; x += 1) {
        areaMap[x] = [];
        for (y = 0; y < areaHeight; y += 1) {
            if (game.rnd.frac() <= initialWeight) {
                areaMap[x][y] = wallName;
            } else {
                areaMap[x][y] = 'Space';
            }
        }
    }
    
    // First Iteration:
    for (i = 0; i < 4; i += 1) {
        areaMap = iterateFunc1(areaMap);
    }
    
    // Second Iteration:
    for (i = 0; i < 3; i += 1) {
        areaMap = iterateFunc2(areaMap);
    }
    
    for (i = 0; i < 50; i += 1) {
        x = game.rnd.integerInRange(0, areaWidth - 1);
        y = game.rnd.integerInRange(0, areaHeight - 1);
        floodResult = floodFunc(areaMap, x, y);
        
        // If we have found a large enough area then copy it into the area map (all other areas become solid):
        if (floodResult.count > areaWidth * areaHeight * 0.60) {
            for (x = 0; x < areaWidth; x += 1) {
                for (y = 0; y < areaHeight; y += 1) {
                    areaMap[x][y] = floodResult.map[x][y] === 2 ? 'Space' : wallName;
                }
            }
            success = true;
            break;
        }
    }
    
    // Clean map:
    for (x = 0; x < areaWidth; x += 1) {
        for (y = 0; y < areaHeight; y += 1) {
            if (countWalls(areaMap, x, y, 1) <= 3) {
                areaMap[x][y] = 'Space';
            }
        }
    }
    
    // Copy area map back to map:
    for (x = 0; x < areaWidth; x += 1) {
        for (y = 0; y < areaHeight; y += 1) {
			if (areaMap[x][y] === wallName) {
				map[area.startX + x][area.startY + y].typeName = wallName;
			}
        }
    }
	
    return success;
};