/*global game, gameState, ITEM_TYPES, STANDARD_SELL_FACTOR*/
'use strict';

// CREATE_INVENTORY:
// ************************************************************************************
gameState.createInventory = function () {
    var inventory = [];
    
    // Functions:
    inventory.addItem = this.inventoryAddItem;
    inventory.removeItem = this.inventoryRemoveItem;
    inventory.removeAllItems = this.inventoryRemoveAllItems;
    inventory.getWeight = this.inventoryGetWeight;
    inventory.countItem = this.inventoryCountItem;
    inventory.numItems = this.inventoryNumItems;
    inventory.calculateValue = this.calculateValue;
	
    return inventory;
};

// CREATE_HARD_POINTS:
// ************************************************************************************
gameState.createHardPoints = function () {
	var hardPoints = this.createInventory();
	
	// Functions:
	hardPoints.addItem = this.hardPointsAddItem;
	
	return hardPoints;
};

// INVENTORY_ADD_ITEM:
// ************************************************************************************
gameState.inventoryAddItem = function (itemTypeName, amount) {
    var i;
    // Try to add to an existing stack:
    for (i = 0; i < this.length; i += 1) {
        if (this[i].itemTypeName === itemTypeName) {
            this[i].amount += amount;
			
			// Test win condition:
			if (gameState.playerCharacter && this === gameState.playerCharacter.inventory) {
				gameState.testObjective();
			}
			
            return;
        }
    }

    // Add new item stack:
    this.push({itemTypeName: itemTypeName, type: gameState.itemTypes[itemTypeName], amount: amount});
	
	// Test win condition:
	if (gameState.playerCharacter && this === gameState.playerCharacter.inventory) {
		gameState.testObjective();
	}
};

// HARD_POINTS_ADD_ITEM:
// ************************************************************************************
gameState.hardPointsAddItem = function (itemTypeName) {
    // Add new item stack:
    this.push({itemTypeName: itemTypeName, type: gameState.itemTypes[itemTypeName], amount: 1});
};

// INVENTORY_REMOVE_ITEM:
// ************************************************************************************
gameState.inventoryRemoveItem = function (itemTypeName, amount) {
    var i;
    for (i = 0; i < this.length; i += 1) {
        if (this[i].itemTypeName === itemTypeName) {
            // Remove items from stack:
            this[i].amount -= amount;

            // Destroy empty stacks:
            if (this[i].amount <= 0) {
                this.splice(i, 1);
            }
            return;
        }
    }
};

// INVENTORY_REMOVE_ALL_ITEMS:
// ************************************************************************************
gameState.inventoryRemoveAllItems = function () {
    this.length = 0;
};

// INVENTORY_GET_WEIGHT:
// ************************************************************************************
gameState.inventoryGetWeight = function () {
    var weight = 0,
        i;

	
    for (i = 0; i < this.length; i += 1) {
        weight += gameState.itemTypes[this[i].itemTypeName].weight * this[i].amount;
    }

    return weight;
};

// INVENTORY_COUNT_ITEM:
// ************************************************************************************
gameState.inventoryCountItem = function (itemTypeName) {
    var i;

    for (i = 0; i < this.length; i += 1) {
        if (this[i].itemTypeName === itemTypeName) {
            return this[i].amount;
        }
    }

    return 0;
};

// INVENTORY_NUM_ITEMS:
// ************************************************************************************
gameState.inventoryNumItems = function () {
    return this.length;
};
	
// CALCULATE_VALUE:
// ************************************************************************************
gameState.calculateValue = function () {
	var value = 0, i;

	// Value of cargo:
	for (i = 0; i < this.length; i += 1) {
		// Equipment has buy/sell same:
		if (gameState.itemTypes[this[i].itemTypeName].equippable) {
			value += gameState.itemTypes[this[i].itemTypeName].value * this[i].amount;
		} else {
			value += gameState.itemTypes[this[i].itemTypeName].value * STANDARD_SELL_FACTOR * this[i].amount;
		}
		
	}
	
	return value;
};