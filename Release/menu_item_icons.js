/*global console, game, gameState, LARGE_WHITE_FONT, INVENTORY_SIZE, INVENTORY_SIZE, HARD_POINTS_SIZE*/

'use strict';

// CREATE_ITEM_ICONS_MENU:
// --------------------------------------------------------------------------------
gameState.createItemIconsMenu = function (position, itemList, slotClickedFunc, numSlots, stackable) {
    var itemIconsMenu,
        i,
        width = 248,
        height = 48,
        sprite,
        button;
    
    // Item Icons Menu:
    itemIconsMenu = {};
    
    // List Index:
    itemIconsMenu.listIndex = 0;
    
    // Item List:
    itemIconsMenu.itemList = itemList;
    itemIconsMenu.selectedListIndex = 0;
    itemIconsMenu.listLength = itemList ? itemList.length : 0;
    itemIconsMenu.selectedItemType = null;
    
    // Menu Group:
    itemIconsMenu.group = game.add.group();

    // Selected slot (refers to button index);
    itemIconsMenu.selectedSlot = null;
    
    // LEFT_CLICKED:
    // ----------------------------
    itemIconsMenu.leftClicked = function () {
        if (this.listIndex > 0) {
            this.listIndex -= 1;
            this.selectedSlot = null;
            this.selectedItemType = null;
            this.refresh();
        }
    };
    
    // RIGHT_CLICKED:
    // ----------------------------
    itemIconsMenu.rightClicked = function () {
        if (this.listIndex + numSlots < this.itemList.length) {
            this.listIndex += 1;
            this.selectedSlot = null;
            this.selectedItemType = null;
            this.refresh();
        }
    };
    
    // Scroll Left Arrow:
    itemIconsMenu.leftArrow = gameState.createButton(position.x - 4, position.y + 6, 'LargeArrow', itemIconsMenu.leftClicked, itemIconsMenu, itemIconsMenu.group);

    // Scroll Right Arrow:
    itemIconsMenu.rightArrow = gameState.createButton(position.x + 378, position.y + 6, 'LargeArrow', itemIconsMenu.rightClicked, itemIconsMenu, itemIconsMenu.group);
    itemIconsMenu.rightArrow.frame = 1;
    
    // ITEM_SLOT_CLICKED:
    // ----------------------------
    itemIconsMenu.itemSlotClicked = function (button) {
        if (this.listIndex + button.slot < this.itemList.length) {
            this.selectedSlot = button.slot;
            this.selectedListIndex = this.selectedSlot + this.listIndex;
            this.selectedItemType = this.itemList[this.selectedListIndex].type;
            slotClickedFunc();
            this.refresh();
        } else {
            this.selectedSlot = null;
            this.selectedListIndex = null;
            this.selectedItemType = null;
        }
    };
    
    // Item Slots:
	itemIconsMenu.itemSlots = [];
    for (i = 0; i < numSlots; i += 1) {
        itemIconsMenu.itemSlots[i] = gameState.createButton(position.x + 18 + i * 52, position.y + 4, 'ItemIcons', itemIconsMenu.itemSlotClicked, itemIconsMenu, itemIconsMenu.group);
        itemIconsMenu.itemSlots[i].slot = i;
    }

   
	// Item Count Text:
	if (stackable) {
		itemIconsMenu.itemCountText = [];
		for (i = 0; i < numSlots; i += 1) {
			itemIconsMenu.itemCountText[i] = game.add.text(position.x + 40 + i * 52, position.y + 32, '10', LARGE_WHITE_FONT);
			itemIconsMenu.group.add(itemIconsMenu.itemCountText[i]);
		}
	}
	
    // Selection Box:
    itemIconsMenu.slotSelectBox = gameState.createSprite(0, 0, 'ItemSlotSelect', itemIconsMenu.group);

	
    // ITEM_ICONS_MENU_REFRESH:
    // ------------------------------------------------------------------
    itemIconsMenu.refresh = function () {
        // Set item icons to match itemList:
        for (i = 0; i < numSlots; i += 1) {
            if (i + this.listIndex < this.itemList.length && i + this.listIndex >= 0) {
                this.itemSlots[i].frame = gameState.itemTypes[this.itemList[this.listIndex + i].itemTypeName].imageIndex;
                // Set item count text visible:
				if (stackable) {
					if (this.itemList[this.listIndex + i].amount > 1) {
						this.itemCountText[i].setText(this.itemList[this.listIndex + i].amount);
						this.itemCountText[i].visible = true;
					} else {
						this.itemCountText[i].visible = false;
					}
				}
            } else {
				this.itemSlots[i].frame = 36;
				if (stackable) {
					this.itemCountText[i].visible = false;
				}
            }
        }
        
        // invalidate selected slot:
        if (this.selectedSlot !== null && this.selectedListIndex >= this.itemList.length) {
            this.selectedSlot = null;
        }
        
        // invalidate selected slot if list length changes:
        if (this.itemList.length !== this.listLength) {
            this.selectedSlot = null;
        }
        this.listLength = this.itemList.length;
            
        
        // Position slot select:
        if (this.selectedSlot !== null) {
            this.slotSelectBox.x = this.itemSlots[this.selectedSlot].x;
            this.slotSelectBox.y = this.itemSlots[this.selectedSlot].y;
            this.slotSelectBox.visible = true;
            
        } else {
            this.slotSelectBox.visible = false;
        }
        
        // Hide or display left arrow:
        if (this.listIndex === 0) {
            this.leftArrow.visible = false;
        } else {
            this.leftArrow.visible = true;
        }
        
        if (this.listIndex + numSlots >= this.itemList.length) {
            this.rightArrow.visible = false;
        } else {
            this.rightArrow.visible = true;
        }
    };
    
    return itemIconsMenu;
};


// CREATE_CARGO_MENU:
// ***********************************************************************
gameState.createCargoMenu = function (x, y, inventory) {
    var slotClickedFunc;
    
    slotClickedFunc = function (button) {
		gameState.inventoryMenu.hardPointsMenu.selectedSlot = null;
        gameState.inventoryMenu.refresh();
        
    };
    
    return this.createItemIconsMenu({x: x, y: y}, inventory, slotClickedFunc, INVENTORY_SIZE, true);
};

// CREATE_HARD_POINTS_MENU:
// ***********************************************************************
gameState.createHardPointsMenu = function (x, y, hardPoints) {
    var slotClickedFunc;
    
    slotClickedFunc = function (button) {
		gameState.inventoryMenu.cargoMenu.selectedSlot = null;
        gameState.inventoryMenu.refresh();
        
    };
    
    return this.createItemIconsMenu({x: x, y: y}, hardPoints, slotClickedFunc, HARD_POINTS_SIZE, false);
};

// CREATE_BUY_MENU:
// ***********************************************************************
gameState.createBuyMenu = function (position) {
    var slotClickedFunc;
    
    slotClickedFunc = function () {
        gameState.merchantMenu.sellMenu.selectedSlot = null;
        gameState.merchantMenu.refresh();
    };
    
    return this.createItemIconsMenu(position, null, slotClickedFunc, INVENTORY_SIZE, true);
};

// CREATE_SELL_MENU:
// ***********************************************************************
gameState.createSellMenu = function (position) {
    var slotClickedFunc;
    
    slotClickedFunc = function () {
        gameState.merchantMenu.buyMenu.selectedSlot = null;
        gameState.merchantMenu.refresh();
    };
    
    return this.createItemIconsMenu(position, this.playerCharacter.inventory, slotClickedFunc, INVENTORY_SIZE, true);
};
