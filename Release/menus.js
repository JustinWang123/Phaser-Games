/*global game, console, gameState, LARGE_BLACK_FONT, LARGE_WHITE_FONT, LARGE_RED_FONT, LARGE_GREEN_FONT, SKILL_DESC, SMALL_BLACK_FONT, HARD_POINTS_SIZE, COLONY_REPAIR_COST_PER_HP*/
'use strict';

var NUM_DAMAGE_TEXT_SPRITES = 20;
var NUM_TARGET_CURSORS = 20;
var MINI_MAP_TILE_SIZE = 4;

// CREATE_MENU_STACK:
// *****************************************************************************
gameState.createMenuStack = function () {
	this.menuStack = {};

	this.menuStack.stack = [];

	// MENU_STACK_PUSH_MENU:
	// --------------------------------------------
	this.menuStack.push = function (menu) {
		// Only push if the menu is not already on the stack:
		if (!gameState.inArray(menu, this.stack)) {

			// Close previous top menu:
			if (this.head()) {
				this.head().close();
			}

			// Open new menu:
			menu.group.parent.bringToTop(menu.group);
			menu.open();

			// push menu onto stack:
			this.stack.push(menu);
		}
	};

	// MENU_STACK_POP_MENU:
	// --------------------------------------------
	this.menuStack.pop = function () {
		// Remove previous head:
		if (this.head()) {
			this.head().close();
			this.stack.length = this.stack.length - 1;
		}

		// Open next head:
		if (this.head()) {
			this.head().open();
		}

	};

	// MENU_STACK_HEAD:
	// --------------------------------------------
	this.menuStack.head = function () {
		if (this.stack.length > 0) {
			return this.stack[this.stack.length - 1];
		} else {
			return null;
		}
	};
};

// CREATE_INVENTORY_MENU:
// *****************************************************************************
gameState.createInventoryMenu = function (showDrop, startX, startY) {
    var width = 440,
        height = 440,
        text,
        button,
        sprite,
        i,
		x,
		y;
    
    // InventoryMenu:
    this.inventoryMenu = {};
    
    // Group:
    this.inventoryMenu.group = game.add.group();
    this.inventoryMenu.group.fixedToCamera = true;
    
    // Menu:
    this.createSprite(startX, startY, 'Menu', this.inventoryMenu.group);
  
    // Title:
    sprite = this.createSprite(startX + width / 2, startY + 16, 'LargeTitle', this.inventoryMenu.group);
    sprite.anchor.setTo(0.5, 0.5);
    text = game.add.text(startX + width / 2 - 76, startY + 6, 'Ship Inventory', LARGE_BLACK_FONT);
    this.inventoryMenu.group.add(text);

	// HP:
	x = startX + width / 6;
	y = startY + 40;
	this.createSprite(x - 50, y, 'MediumTitle', this.inventoryMenu.group);
	this.inventoryMenu.hpText = this.createText(x - 46, y + 2, 'HP', LARGE_BLACK_FONT, this.inventoryMenu.group);
	
	// SHIELD:
	x = startX + width / 6;
	y = startY + 80;
	this.createSprite(x - 50, y, 'MediumTitle', this.inventoryMenu.group);
	this.inventoryMenu.shieldText = this.createText(x - 46, y + 2, 'SHD', LARGE_BLACK_FONT, this.inventoryMenu.group);
	
	// SPEED:
	x = startX + 4 * width / 6 + 8;
	y = startY + 40;
	this.createSprite(x - 30, y, 'MediumTitle', this.inventoryMenu.group);
	this.inventoryMenu.speedText = this.createText(x - 26, y + 2, 'SPD', LARGE_BLACK_FONT, this.inventoryMenu.group);
	
	// CARGO:
	x = startX + 4 * width / 6 + 8;
	y = startY + 80;
	this.createSprite(x - 30, y, 'MediumTitle', this.inventoryMenu.group);
	this.inventoryMenu.cargoText = this.createText(x - 26, y + 2, 'CARGO', LARGE_BLACK_FONT, this.inventoryMenu.group);
	
	sprite = this.createSprite(startX + width / 2, 92, 'ItemIcons', this.inventoryMenu.group);
	sprite.frame = 36;
	sprite.anchor.setTo(0.5, 0);
	sprite = this.createSprite(startX + width / 2, 90, 'MapTileset', this.inventoryMenu.group);
	sprite.frame = 128;
	sprite.anchor.setTo(0.5, 0);
	
    // Hard Points Title:
	this.inventoryMenu.hardPointsTitle = game.add.text(startX + width / 2, startY + 130, 'Hard Points:', LARGE_BLACK_FONT);
    this.inventoryMenu.hardPointsTitle.anchor.setTo(0.5, 0);
    this.inventoryMenu.group.add(this.inventoryMenu.hardPointsTitle);
   
	// Hard Points Menu:
	this.inventoryMenu.hardPointsMenu = this.createHardPointsMenu(startX + 20, startY + 146, gameState.playerCharacter.hardPoints);
	this.inventoryMenu.group.add(this.inventoryMenu.hardPointsMenu.group);
	
    // Cargo Title:
    this.inventoryMenu.cargoTitle = game.add.text(startX + width / 2, startY + 206, 'Ship Cargo:', LARGE_BLACK_FONT);
    this.inventoryMenu.cargoTitle.anchor.setTo(0.5, 0);
    this.inventoryMenu.group.add(this.inventoryMenu.cargoTitle);
    
    // Cargo Menu:
    this.inventoryMenu.cargoMenu = this.createCargoMenu(startX + 20, startY + 222, gameState.playerCharacter.inventory);
    this.inventoryMenu.group.add(this.inventoryMenu.cargoMenu.group);
    
    // DROP_CLICKED:
    // *****************************************************************************
    this.inventoryMenu.dropClicked = function () {
		var pc = gameState.playerCharacter;
		
        // Dropping from cargo:
        if (this.cargoMenu.selectedSlot !== null) {
            gameState.createItem(pc.tileIndex, this.cargoMenu.selectedItemType.name, 1);
            pc.inventory.removeItem(this.cargoMenu.selectedItemType.name, 1);
            this.refresh();
        } else if (this.hardPointsMenu.selectedSlot !== null) {
			gameState.createItem(pc.tileIndex, this.hardPointsMenu.selectedItemType.name, 1);
			pc.hardPoints.removeItem(this.hardPointsMenu.selectedItemType.name, 1);
			this.refresh();
		}
    };
    
    // EQUIP_CLICKED:
    // *****************************************************************************
    this.inventoryMenu.equipClicked = function () {
        var pc = gameState.playerCharacter,
            selectedItemType = this.cargoMenu.selectedItemType;
        
		if (selectedItemType) {
			pc.hardPoints.addItem(selectedItemType.name, 1);
			pc.inventory.removeItem(selectedItemType.name, 1);
			pc.updateStats();
			this.refresh();

			if (gameState.HUD) {
				gameState.updateHUDSprites();
			}
		}
    };
	
	// UNEQUIP_CLICKED:
    // *****************************************************************************
	this.inventoryMenu.unequipClicked = function () {
		var pc = gameState.playerCharacter,
            selectedItemType = this.hardPointsMenu.selectedItemType;
		
		if (selectedItemType) {
			pc.hardPoints.removeItem(selectedItemType.name, 1);
			pc.inventory.addItem(selectedItemType.name, 1);
			pc.updateStats();
			this.refresh();

			if (gameState.HUD) {
				gameState.updateHUDSprites();
			}
		}
	};
	
    // CLOSE_INVENTORY_MENU:
    // *****************************************************************************
    this.inventoryMenu.close = function () {
        gameState.gameState = 'GAME_STATE';
        this.group.visible = false;
    };
	
	// CLOSE_CLICKED:
	// *****************************************************************************
	this.inventoryMenu.closeClicked = function () {
		gameState.menuStack.pop();
	};
	
	// Item Text Box:
    this.inventoryMenu.itemTextBox = this.createTextBox({x: startX + 20, y: startY + 280}, 9);
    this.inventoryMenu.group.add(this.inventoryMenu.itemTextBox.group);
    
    // Buttons:
    this.inventoryMenu.dropButton = this.createTextButton(startX + 3 * width / 4, startY + 446, 'DROP', this.inventoryMenu.dropClicked, this.inventoryMenu, this.inventoryMenu.group);
    this.inventoryMenu.equipButton = this.createTextButton(startX + width / 4, startY + 446, 'EQUIP', this.inventoryMenu.equipClicked, this.inventoryMenu, this.inventoryMenu.group);
    this.inventoryMenu.unequipButton = this.createTextButton(startX + width / 4, startY + 446, 'UNEQUIP', this.inventoryMenu.unequipClicked, this.inventoryMenu, this.inventoryMenu.group);
    this.inventoryMenu.closeButton = this.createTextButton(startX + width / 2, startY + 484, 'CLOSE', this.inventoryMenu.closeClicked, this.inventoryMenu, this.inventoryMenu.group);
	
    // INVENTORY_MENU_OPEN:
    // *****************************************************************************
    this.inventoryMenu.open = function () {
        if (gameState.playerCharacter.inventory.length > 0) {
            this.cargoMenu.selectedSlot = 0;
            this.cargoMenu.selectedItemType = gameState.playerCharacter.inventory[0].type;
        }
        
        this.refresh();
        gameState.gameState = 'INVENTORY_STATE';
        this.group.visible = true;
    };
    
    // INVENTORY_MENU_REFRESH:
    // *****************************************************************************
    this.inventoryMenu.refresh = function () {
        var i, itemName, niceName, pc = gameState.playerCharacter;
    
		// Set hard points text:
		this.hardPointsTitle.setText('Hard Points: ' + pc.hardPoints.length + '/10');
		
        // Set weight text:
        this.cargoTitle.setText('Ship Cargo: ' + Math.ceil(gameState.playerCharacter.inventory.getWeight()) + '/' + gameState.playerCharacter.cargoCap);

        // Set weight text color:
        if (gameState.playerCharacter.inventory.getWeight() > gameState.playerCharacter.cargoCap) {
            this.cargoTitle.setStyle(LARGE_RED_FONT);
        } else {
            this.cargoTitle.setStyle(LARGE_BLACK_FONT);
        }
        
        // Update Cargo Menu:
        this.cargoMenu.refresh();
        
		// Update Hard Points Menu:
		this.hardPointsMenu.refresh();
		
		// Set Stats Text:
		this.hpText.setText('HULL HP: ' + pc.maxHp);
		this.shieldText.setText('SHIELD HP: ' + pc.maxShieldHp);
		this.speedText.setText('MAX SPEED: ' + pc.speedStat);
		this.cargoText.setText('CARGO CAP: ' + pc.cargoCap);
		
        // Set text of selected item (cargo):
        if (this.cargoMenu.selectedSlot !== null) {
            itemName = this.cargoMenu.selectedItemType.name;
			niceName = gameState.itemTypes[itemName].niceName;
            this.itemTextBox.setText(niceName + '\n' + gameState.itemTypes[itemName].value + ' CREDITS\n\n' + gameState.itemTypes[itemName].desc);
       
		// Set text of selected item (hard point):
		} else if (this.hardPointsMenu.selectedSlot !== null) {
			itemName = this.hardPointsMenu.selectedItemType.name;
			niceName = gameState.itemTypes[itemName].niceName;
			this.itemTextBox.setText(niceName + '\n' + gameState.itemTypes[itemName].value + ' CREDITS\n\n' + gameState.itemTypes[itemName].desc);
		} else {
            this.itemTextBox.setText('');
        }

		
        // Set button visibility:
        this.dropButton.group.visible = showDrop && (this.cargoMenu.selectedSlot !== null || this.hardPointsMenu.selectedSlot !== null);
		this.equipButton.group.visible = this.cargoMenu.selectedSlot !== null && this.cargoMenu.selectedItemType.equippable && pc.hardPoints.length < 10;
		this.unequipButton.group.visible = this.hardPointsMenu.selectedSlot !== null;
    };
    
	// Hide inventory:
    this.inventoryMenu.group.visible = false;
    
};

// CREATE_COLONY_MENU:
// *****************************************************************************
gameState.createColonyMenu = function () {
    var startX = 80,
        startY = 40,
        width = 440,
        height = 440,
        text,
        button,
        sprite,
        i;

    this.colonyMenu = {};
    
    // Group:
    this.colonyMenu.group = game.add.group();
    this.colonyMenu.group.fixedToCamera = true;
    
    // Menu:
    this.createSprite(startX, startY, 'Menu', this.colonyMenu.group);

    // Colony Title:
    sprite = this.createSprite(startX + width / 2, startY + 16, 'LargeTitle', this.colonyMenu.group);
    sprite.anchor.setTo(0.5, 0.5);
    this.colonyMenu.title = game.add.text(startX + width / 2, startY + 18, 'Colony', LARGE_BLACK_FONT);
    this.colonyMenu.title.anchor.setTo(0.5, 0.5);
    this.colonyMenu.group.add(this.colonyMenu.title);
    
	// Colony Sprite:
	this.colonyMenu.colonySprite = this.createSprite(startX + width / 2, startY + 80, 'ColonyTileset', this.colonyMenu.group);
	this.colonyMenu.colonySprite.anchor.setTo(0.5, 0.5);
	
    // Text box:
    this.colonyMenu.textBox = gameState.createTextBox({x: startX + 20, y: startY + 136}, 18);
    this.colonyMenu.group.add(this.colonyMenu.textBox.group);

    
    // Hide group:
    this.colonyMenu.group.visible = false;
    
    // COLONY_MENU_OPEN:
    // *****************************************************************************
    this.colonyMenu.open = function () {
        var colony = gameState.currentColony,
			pc = gameState.playerCharacter;
        
        // Set title:
        this.title.setText(colony.type.niceName);

		// Set sprite:
		this.colonySprite.frame = colony.type.frame;
		
        // Set text:
        this.textBox.setText(colony.type.text);

        // Show group:
        this.group.visible = true;

        // Set repair button cost:
        this.repairButton.text.setText('repair ' + (pc.maxHp - pc.currentHp) * (COLONY_REPAIR_COST_PER_HP - pc.skills.engineering) + 'c');

		// Set button visibility:
		this.jobButton.group.visible = (colony.job !== null);
		this.repairButton.group.visible = (pc.currentHp < pc.maxHp);
		
        // Set state:
        gameState.gameState = 'COLONY_MENU_STATE';
    };
    
    // COLONY_MENU_CLOSE:
    // *****************************************************************************
    this.colonyMenu.close = function () {
         // Hide group:
        this.group.visible = false;

        // Set state:
        gameState.gameState = 'GAME_STATE';
    };
	
	// CLOSE_CLICKED:
	// *****************************************************************************
	this.colonyMenu.closeClicked = function () {
		gameState.menuStack.pop();
	};
	
	// MERCHANT_CLICKED:
    // *****************************************************************************
	this.colonyMenu.merchantClicked = function () {
		gameState.menuStack.push(gameState.merchantMenu);
	};
	
	// JOB_CLICKED:
	// ****************************************************************************
	this.colonyMenu.jobClicked = function () {
		gameState.menuStack.push(gameState.jobMenu);
	};
	
    // Buttons:
    this.colonyMenu.repairButton = gameState.createTextButton(startX + width / 4, startY + 446, 'REPAIR', this.colonyRepairShip, this, this.colonyMenu.group);
    this.colonyMenu.jobButton = gameState.createTextButton(startX + 3 * width / 4, startY + 446, 'JOBS', this.colonyMenu.jobClicked, this.jobMenu, this.colonyMenu.group);
    this.colonyMenu.merchantButton = gameState.createTextButton(startX + width / 4, startY + 484, 'MERCHANT', this.colonyMenu.merchantClicked, this.merchantMenu, this.colonyMenu.group);
    this.colonyMenu.exitButton = gameState.createTextButton(startX + 3 * width / 4, startY + 484, 'EXIT', this.colonyMenu.closeClicked, this.colonyMenu, this.colonyMenu.group);

};

// COLONY_REPAIR_SHIP:
// *****************************************************************************
gameState.colonyRepairShip = function () {
    var pc = gameState.playerCharacter;
    
    if (pc.credits >= (pc.maxHp - pc.currentHp) * (COLONY_REPAIR_COST_PER_HP - pc.skills.engineering)) {
        pc.credits -= (pc.maxHp - pc.currentHp) * (COLONY_REPAIR_COST_PER_HP - pc.skills.engineering);
        pc.repairDamage(1000);
        this.colonyMenu.open();
    } else if (pc.credits >= (COLONY_REPAIR_COST_PER_HP - pc.skills.engineering)) {
		pc.repairDamage(Math.floor(pc.credits / (COLONY_REPAIR_COST_PER_HP - pc.skills.engineering)));
		pc.credits -= Math.floor(pc.credits / (COLONY_REPAIR_COST_PER_HP - pc.skills.engineering)) * (COLONY_REPAIR_COST_PER_HP - pc.skills.engineering);
		this.colonyMenu.open();
	}
};

// CREATE_MERCHANT_WINDOW:
// *****************************************************************************
gameState.createMerchantMenu = function (startX, startY) {
    var width = 440,
        height = 440,
        text,
        button,
        sprite,
        i;
    
    // Merchant menu:
    this.merchantMenu = {};
    
    // Merchant menu group:
    this.merchantMenu.group = game.add.group();
    this.merchantMenu.group.fixedToCamera = true;
    
    // Menu:
    gameState.createSprite(startX, startY, 'Menu', this.merchantMenu.group);
    
    // Mercant Title:
    sprite = this.createSprite(startX + width / 2, startY + 16, 'LargeTitle', this.merchantMenu.group);
    sprite.anchor.setTo(0.5, 0.5);
    text = game.add.text(startX + width / 2, startY + 18, 'Merchant', LARGE_BLACK_FONT);
    text.anchor.setTo(0.5, 0.5);
    this.merchantMenu.group.add(text);
    
    // Mercant Title:
    text = game.add.text(startX + width / 2, startY + 36, 'Merchant: ', LARGE_BLACK_FONT);
    text.anchor.setTo(0.5, 0);
    this.merchantMenu.group.add(text);
    
    // Merchant Menu:
    this.merchantMenu.buyMenu = gameState.createBuyMenu({x: startX + 20, y: startY + 52});
    this.merchantMenu.group.add(this.merchantMenu.buyMenu.group);
    
    // Cargo Title:
    this.merchantMenu.cargoTitleText = game.add.text(startX + width / 2, startY + 110, 'Ship Cargo:', LARGE_BLACK_FONT);
    this.merchantMenu.cargoTitleText.anchor.setTo(0.5, 0);
    this.merchantMenu.group.add(this.merchantMenu.cargoTitleText);
    
    // Sell Cargo Menu:
    this.merchantMenu.sellMenu = gameState.createSellMenu({x: startX + 20, y: startY + 126});
    this.merchantMenu.group.add(this.merchantMenu.sellMenu.group);
    
    // Player Credits text:
    sprite = gameState.createSprite(startX + width / 2, startY + 406, 'LargeTitle', this.merchantMenu.group);
    sprite.anchor.setTo(0.5, 0.5);
    this.merchantMenu.creditsText = game.add.text(startX + width / 2, startY + 406, 'Cred:', LARGE_BLACK_FONT);
    this.merchantMenu.creditsText.anchor.setTo(0.5, 0.5);
    this.merchantMenu.group.add(this.merchantMenu.creditsText);
    
    // Item Text Box:
    this.merchantMenu.itemTextBox = this.createTextBox({x: startX + 20, y: startY + 190}, 12);
    this.merchantMenu.group.add(this.merchantMenu.itemTextBox.group);
    
    // BUY_CLICKED:
    // -----------------------------------------------------------------------------
    this.merchantMenu.buyClicked = function () {
        var itemName = gameState.currentColony.inventory[this.buyMenu.selectedListIndex].itemTypeName,
            itemPrice = gameState.currentColony.getItemBuyPrice(itemName);
        
        if (this.buyMenu.selectedListIndex < this.buyMenu.itemList.length
                && gameState.playerCharacter.credits >= itemPrice) {
            gameState.playerCharacter.credits -= itemPrice;
            gameState.playerCharacter.inventory.addItem(itemName, 1);
            gameState.currentColony.inventory.removeItem(itemName, 1);
            this.refresh();

			// Pop up help:
			if (gameState.itemTypes[itemName].equippable && gameState.playerCharacter.equipmentHelp) {
				gameState.playerCharacter.equipmentHelp = false;
				
				gameState.textMenu.setTitle('Equipment');
				gameState.textMenu.setText('In order to use your new equipment, remember to open the inventory menu and equip it to one of your hard point slots.');
				gameState.textMenu.setButtons([{text: 'CLOSE', func: function () { gameState.menuStack.pop(); }}]);
				gameState.menuStack.push(gameState.textMenu);
			}
        }
    };
    
    // BUY_ALL_CLICKED:
    // -----------------------------------------------------------------------------
    this.merchantMenu.buyAllClicked = function () {
        var itemName = gameState.currentColony.inventory[this.buyMenu.selectedListIndex].itemTypeName,
            itemPrice = gameState.currentColony.getItemBuyPrice(itemName),
            num;
        
        if (this.buyMenu.selectedListIndex < this.buyMenu.itemList.length) {
            num = Math.min.apply(Math, [Math.floor(gameState.playerCharacter.credits / itemPrice),
                                        gameState.currentColony.inventory.countItem(itemName),
                                        gameState.playerCharacter.cargoCap - Math.ceil(gameState.playerCharacter.inventory.getWeight())]);
            
            if (num > 0) {
                gameState.playerCharacter.credits -= itemPrice * num;
                gameState.playerCharacter.inventory.addItem(itemName, num);
                gameState.currentColony.inventory.removeItem(itemName, num);
                this.refresh();
                //gameState.updateHUD();
            }
        }
    };
    
    // SELL_CLICKED:
    // -----------------------------------------------------------------------------
    this.merchantMenu.sellClicked = function () {
		var itemTypeName;
		
        if (this.sellMenu.selectedListIndex < this.sellMenu.itemList.length) {
            itemTypeName = this.sellMenu.itemList[this.sellMenu.selectedListIndex].itemTypeName;
            gameState.playerCharacter.inventory.removeItem(itemTypeName, 1);
			gameState.playerCharacter.gainCredits(gameState.currentColony.getItemSellPrice(itemTypeName));
            this.refresh();
        }
    };
    
    // SELL_ALL_CLICKED:
    // -----------------------------------------------------------------------------
    this.merchantMenu.sellAllClicked = function () {
        var itemTypeName = this.sellMenu.itemList[this.sellMenu.selectedListIndex].itemTypeName,
            itemCount = gameState.playerCharacter.inventory.countItem(itemTypeName);
        
        if (this.sellMenu.selectedListIndex < this.sellMenu.itemList.length) {
            //gameState.currentColony.inventory.addItem(itemName, itemCount);
            gameState.playerCharacter.inventory.removeItem(itemTypeName, itemCount);
			gameState.playerCharacter.gainCredits(gameState.currentColony.getItemSellPrice(itemTypeName) * itemCount);
            this.refresh();
        }
    };
    
    // MERCHANT_MENU_OPEN:
    // -----------------------------------------------------------------------------
    this.merchantMenu.open = function () {
        gameState.gameState = 'MERCHANT_MENU_STATE';
        
        this.group.visible = true;
        
        // Update Merchant Menu:
        this.buyMenu.listIndex = 0;
        this.buyMenu.itemList = gameState.currentColony.inventory;

        this.sellMenu.listIndex = 0;
        
        if (gameState.currentColony.inventory.length > 0) {
            this.buyMenu.selectedSlot = 0;
            this.buyMenu.selectedListIndex = 0;
            this.buyMenu.listLength = gameState.currentColony.inventory.length;
        }
        this.sellMenu.selectedSlot = null;
        
        this.refresh();
    };
    
    // MERCHANT_MENU_REFRESH:
    // -----------------------------------------------------------------------------
    this.merchantMenu.refresh = function () {
        var itemName, niceName, itemPrice, itemWeight, itemDesc;
        
        //this.title.setText(gameState.currentColony.name + ' [' + gameState.currentColony.type.name + ']');
        
        // Refresh buy menu
        this.buyMenu.refresh();
        
        // Refresh sell menu:
        this.sellMenu.refresh();
        
        // Set player credits text:
        this.creditsText.setText('Credits: ' + gameState.playerCharacter.credits);
        
         // Set Cargo Title:
        this.cargoTitleText.setText('Cargo: ' + Math.ceil(gameState.playerCharacter.inventory.getWeight()) + '/' + gameState.playerCharacter.cargoCap);
		// Set weight text color:
        if (gameState.playerCharacter.inventory.getWeight() > gameState.playerCharacter.cargoCap) {
            this.cargoTitleText.setStyle(LARGE_RED_FONT);
        } else {
            this.cargoTitleText.setStyle(LARGE_BLACK_FONT);
        }
		
        // Set text of selected item (sell menu):
        if (this.sellMenu.selectedSlot !== null) {
            itemName = this.sellMenu.itemList[this.sellMenu.selectedListIndex].itemTypeName;
			niceName = gameState.itemTypes[itemName].niceName;
            itemPrice = gameState.currentColony.getItemSellPrice(itemName);
            itemDesc = gameState.itemTypes[itemName].desc;
            
            this.itemTextBox.setText(niceName
                                     + ': ' + itemPrice + ' Credits'
                                     + '\n\n' + itemDesc);
            
        // Set text of selected item (buy menu):
        } else if (this.buyMenu.selectedSlot !== null) {
            itemName = this.buyMenu.itemList[this.buyMenu.selectedListIndex].itemTypeName;
			niceName = gameState.itemTypes[itemName].niceName;
            itemPrice = gameState.currentColony.getItemBuyPrice(itemName);
            itemDesc = gameState.itemTypes[itemName].desc;
            
            this.itemTextBox.setText(niceName
                                     + ': ' + itemPrice + ' Credits'
                                     + '\n\n' + itemDesc);
			
			
        } else {
            this.itemTextBox.setText('');
        }
        
        // Set buy button visibility:
        if (this.buyMenu.selectedSlot !== null) {
            itemName = gameState.currentColony.inventory[this.buyMenu.selectedListIndex].itemTypeName;
            itemPrice = gameState.currentColony.getItemBuyPrice(itemName);
            itemWeight = gameState.itemTypes[itemName].weight;
            
            // Only display the buy button if the player has enough credits and will not be overweight:
            if (gameState.playerCharacter.credits >= itemPrice
                    && gameState.playerCharacter.inventory.getWeight() + itemWeight <= gameState.playerCharacter.cargoCap) {
                this.buyButton.group.visible = true;
                this.buyButton.text.setText('Buy ' + itemPrice + ' C');
                this.buyAllButton.group.visible = true;
            } else {
                this.buyButton.group.visible = false;
                this.buyAllButton.group.visible = false;
            }
        } else {
            this.buyButton.group.visible = false;
            this.buyAllButton.group.visible = false;
        }
        
        // Set sell button visibility:
        if (this.sellMenu.selectedSlot !== null) {
            itemName = this.sellMenu.itemList[this.sellMenu.selectedListIndex].itemTypeName;
            itemPrice = gameState.currentColony.getItemSellPrice(itemName);
            
			if (gameState.inArray(itemName, gameState.currentColony.type.buys)) {
				this.sellButton.text.setStyle(LARGE_GREEN_FONT);
				this.sellAllButton.text.setStyle(LARGE_GREEN_FONT);
			} else {
				this.sellButton.text.setStyle(LARGE_BLACK_FONT);
				this.sellAllButton.text.setStyle(LARGE_BLACK_FONT);
			}
			
            this.sellButton.group.visible = true;
            this.sellButton.text.setText('Sell ' + itemPrice + ' C');
            this.sellAllButton.group.visible = true;
        } else {
            this.sellButton.group.visible = false;
            this.sellAllButton.group.visible = false;
        }
    };
    
    // MERCHANT_MENU_CLOSE:
    // -----------------------------------------------------------------------------
    this.merchantMenu.close = function () {
        gameState.gameState = 'GAME_STATE';
        this.group.visible = false;
    };
	
	// CLOSE_CLICKED:
	// *****************************************************************************
	this.merchantMenu.closeClicked = function () {
		gameState.menuStack.pop();
	};
    
    // Buttons:
    this.merchantMenu.buyButton = gameState.createTextButton(startX + width / 4, startY + 446, 'BUY', this.merchantMenu.buyClicked, this.merchantMenu, this.merchantMenu.group);
    this.merchantMenu.buyAllButton = gameState.createTextButton(startX + 3 * width / 4, startY + 446, 'BUY ALL', this.merchantMenu.buyAllClicked, this.merchantMenu, this.merchantMenu.group);
    this.merchantMenu.sellButton = gameState.createTextButton(startX + width / 4, startY + 446, 'SELL', this.merchantMenu.sellClicked, this.merchantMenu, this.merchantMenu.group);
    this.merchantMenu.sellAllButton = gameState.createTextButton(startX + 3 * width / 4, startY + 446, 'SELL ALL', this.merchantMenu.sellAllClicked, this.merchantMenu, this.merchantMenu.group);
    this.merchantMenu.exitButton = gameState.createTextButton(startX + width / 2, startY + 484, 'EXIT', this.merchantMenu.closeClicked, this.merchantMenu, this.merchantMenu.group);
	
    // Hide Merchant Group:
    this.merchantMenu.group.visible = false;
};

// CREATE_TEXT_BOX:
// **********************************************************************************
gameState.createTextBox = function (position, numLines) {
    var button,
        textBox = {},
        i,
        sprite;
    
    // Group:
    textBox.group = game.add.group();
    
    // Text:
    textBox.stringLines = [];

	// Create panel:
	gameState.createSprite(position.x, position.y, 'TextBoxTop', textBox.group);
	sprite = gameState.createSprite(position.x, position.y + 16, 'TextBoxMid', textBox.group);
	sprite.scale.setTo(2, (numLines - 2) * 2);
	gameState.createSprite(position.x, position.y + (numLines - 1) * 16, 'TextBoxBottom', textBox.group);

	// Create text:
	textBox.text = gameState.createText(position.x + 8, position.y + 4, 'Default Text', SMALL_BLACK_FONT, textBox.group);
	
    textBox.setText = function (text) {
        var i, textArray, textSum = '';
		textArray = gameState.wrapText(text, 42);
		
		for (i = 0; i < textArray.length; i += 1) {
			textSum += textArray[i] + '\n';
		}
		
		this.text.setText(textSum);
    };

    return textBox;
};

// CREATE_CHARACTER_MENU:
// *****************************************************************************
gameState.createCharacterMenu = function (startX, startY) {
    var width = 440,
        height = 440,
        text,
        button,
        sprite,
        i,
        createSkillSlots,
        skillSlotsFirstX = 22,
        skillSlotsSecondX = 240,
        skillSlotsFirstY = 90,
        skillSlotsSecondY = 154,
        skillSlotsThirdY = 218;
    
    this.characterMenu = {};
    
    // Group:
    this.characterMenu.group = game.add.group();
    this.characterMenu.group.fixedToCamera = true;
    
    // Menu:
    this.createSprite(startX, startY, 'Menu', this.characterMenu.group);

    // Title:
    sprite = this.createSprite(startX + width / 2, startY + 12, 'LargeTitle', this.characterMenu.group);
    sprite.anchor.setTo(0.5, 0.5);
    text = game.add.text(startX + width / 2 - 48, startY + 2, 'Character', LARGE_BLACK_FONT);
    this.characterMenu.group.add(text);
    
	// Level text:
	sprite = this.createSprite(startX + width / 4, startY + 54, 'MediumTitle', this.characterMenu.group);
	sprite.anchor.setTo(0.5, 0.5);
	this.characterMenu.levelText = gameState.createText(startX + width / 4 - 60, startY + 44, 'Level: 20', LARGE_BLACK_FONT, this.characterMenu.group);
	
	// Net worth text:
	sprite = this.createSprite(startX + 3 * width / 4 - 10, startY + 54, 'LargeTitle', this.characterMenu.group);
	sprite.anchor.setTo(0.5, 0.5);
	this.characterMenu.netWorthText = gameState.createText(startX + 3 * width / 4 - 100, startY + 44, 'Net Worth: 750000', LARGE_BLACK_FONT, this.characterMenu.group);
	
    // Select Skill:
    this.characterMenu.selectSkill = function (button) {
        this.selectedButton = button;
        this.skillSelect.x = button.position.x;
        this.skillSelect.y = button.position.y;
        this.open();
    };
    
    // Icons:
    this.characterMenu.gunneryButton = this.createButton(startX + skillSlotsFirstX, startY + skillSlotsFirstY, 'ItemIcons', this.characterMenu.selectSkill, this.characterMenu, this.characterMenu.group);
    this.characterMenu.navigationButton = this.createButton(startX + skillSlotsFirstX, startY + skillSlotsSecondY, 'ItemIcons', this.characterMenu.selectSkill, this.characterMenu, this.characterMenu.group);
    this.characterMenu.barterButton = this.createButton(startX + skillSlotsFirstX, startY + skillSlotsThirdY, 'ItemIcons', this.characterMenu.selectSkill, this.characterMenu, this.characterMenu.group);
    this.characterMenu.shieldButton = this.createButton(startX + skillSlotsSecondX, startY + skillSlotsFirstY, 'ItemIcons', this.characterMenu.selectSkill, this.characterMenu, this.characterMenu.group);
    this.characterMenu.logisticsButton = this.createButton(startX + skillSlotsSecondX, startY + skillSlotsSecondY, 'ItemIcons', this.characterMenu.selectSkill, this.characterMenu, this.characterMenu.group);
    this.characterMenu.engineeringButton = this.createButton(startX + skillSlotsSecondX, startY + skillSlotsThirdY, 'ItemIcons', this.characterMenu.selectSkill, this.characterMenu, this.characterMenu.group);
    
    // Button Frames:
    this.characterMenu.gunneryButton.frame = 76;
    this.characterMenu.navigationButton.frame = 77;
    this.characterMenu.barterButton.frame = 78;
    this.characterMenu.shieldButton.frame = 79;
    this.characterMenu.logisticsButton.frame = 80;
    this.characterMenu.engineeringButton.frame = 81;
    
    // Button Skill names:
    this.characterMenu.gunneryButton.skillName = 'gunnery';
    this.characterMenu.navigationButton.skillName = 'navigation';
    this.characterMenu.barterButton.skillName = 'barter';
    this.characterMenu.shieldButton.skillName = 'shields';
    this.characterMenu.logisticsButton.skillName = 'logistics';
    this.characterMenu.engineeringButton.skillName = 'engineering';
    
	// Create skill Select:
    this.characterMenu.selectedButton = null;
    this.characterMenu.skillSelect = this.createSprite(startX, startY, 'ItemSlotSelect', this.characterMenu.group);
    
	// Create skill gems:
	this.characterMenu.skillGems = {};
	this.characterMenu.skillGems.gunnery = gameState.createSprite(startX + skillSlotsFirstX + 50, startY + skillSlotsFirstY, 'SkillSlot', gameState.characterMenu.group);
	this.characterMenu.skillGems.navigation = gameState.createSprite(startX + skillSlotsFirstX + 50, startY + skillSlotsSecondY, 'SkillSlot', gameState.characterMenu.group);
	this.characterMenu.skillGems.barter = gameState.createSprite(startX + skillSlotsFirstX + 50, startY + skillSlotsThirdY, 'SkillSlot', gameState.characterMenu.group);
	this.characterMenu.skillGems.shields = gameState.createSprite(startX + skillSlotsSecondX + 50, startY + skillSlotsFirstY, 'SkillSlot', gameState.characterMenu.group);
	this.characterMenu.skillGems.logistics = gameState.createSprite(startX + skillSlotsSecondX + 50, startY + skillSlotsSecondY, 'SkillSlot', gameState.characterMenu.group);
	this.characterMenu.skillGems.engineering = gameState.createSprite(startX + skillSlotsSecondX + 50, startY + skillSlotsThirdY, 'SkillSlot', gameState.characterMenu.group);
	

    // TRAIN_BUTTON_CLICKED:
    // -------------------------------------------------------------------
    this.characterMenu.trainButtonClicked = function () {
        var skillName = this.selectedButton.skillName;
        
        if (gameState.playerCharacter.skillPoints > 0 && gameState.playerCharacter.skills[skillName] < 5) {
            gameState.playerCharacter.skills[skillName] += 1;
            gameState.playerCharacter.skillPoints -= 1;
			
			if (skillName === 'engineering') {
				gameState.playerCharacter.currentHp += 5;
			}
			if (skillName === 'shields') {
				gameState.playerCharacter.currentShieldHp += 1;
			}
			
            gameState.playerCharacter.updateStats();
            this.open();
        }
    };

    // CHARACTER_MENU_OPEN:
    // -------------------------------------------------------------------
    this.characterMenu.open = function () {
        var updateGems, pc = gameState.playerCharacter;
        
        gameState.gameState = 'CHARACTER_MENU_STATE';
        
		this.levelText.setText('Level: ' + gameState.playerCharacter.level);
		this.netWorthText.setText('Net Worth: ' + gameState.getPlayerNetWorth());
		
		this.skillGems.gunnery.frame = pc.skills.gunnery;
		this.skillGems.navigation.frame = pc.skills.navigation;
		this.skillGems.barter.frame = pc.skills.barter;
		this.skillGems.shields.frame = pc.skills.shields;
		this.skillGems.logistics.frame = pc.skills.logistics;
		this.skillGems.engineering.frame = pc.skills.engineering;

        // Update skill points text:
        this.skillPointsText.setText('Skill Pts: ' + gameState.playerCharacter.skillPoints);
        
        this.textBox.setText(SKILL_DESC[this.selectedButton.skillName]);
        
        // Update train button (set visible if available skill points):
        if (gameState.playerCharacter.skillPoints > 0) {
            this.trainButton.group.visible = true;
        } else {
            this.trainButton.group.visible = false;
        }
        
        this.group.visible = true;
        gameState.state = 'CHARACTER_MENU';
    };
    
    // CHARACTER_MENU_CLOSE:
    // -------------------------------------------------------------------
    this.characterMenu.close = function () {
        this.group.visible = false;
        gameState.gameState = 'GAME_STATE';
    };
    
	// CLOSE_CLICKED:
	// *******************************************************************
	this.characterMenu.closeClicked = function () {
		gameState.menuStack.pop();
	};
	
	// Skill points text:
    sprite = gameState.createSprite(startX + 3 * width / 4, startY + 446, 'MediumTitle', this.characterMenu.group);
    sprite.anchor.setTo(0.5, 0.5);
    this.characterMenu.skillPointsText = game.add.text(startX + 3 * width / 4 - 60, startY + 436, 'Skill Pts: 0', LARGE_BLACK_FONT);
    this.characterMenu.group.add(this.characterMenu.skillPointsText);
	
	// Text Box:
    this.characterMenu.textBox = gameState.createTextBox({x: startX + 20, y: startY + 280}, 9);
    this.characterMenu.group.add(this.characterMenu.textBox.group);
    
    // BUTTONS:
	this.characterMenu.trainButton = gameState.createTextButton(startX + width / 4, startY + 446, 'TRAIN', this.characterMenu.trainButtonClicked, this.characterMenu, this.characterMenu.group);
    gameState.createTextButton(startX + width / 2, startY + 484, 'CLOSE', this.characterMenu.closeClicked, this.characterMenu, this.characterMenu.group);
    
    this.characterMenu.selectSkill(this.characterMenu.gunneryButton);
    this.characterMenu.close();
};

// CREATE_MERCHANT_MENU:
// *****************************************************************************
gameState.createEncounterMenu = function () {
	var startX = 80,
        startY = 40,
        width = 440,
        height = 440,
		sprite,
		text;
	
	this.encounterMenu = {};
    
    // Group:
    this.encounterMenu.group = game.add.group();
    this.encounterMenu.group.fixedToCamera = true;
    
    // Menu:
    this.createSprite(startX, startY, 'Menu', this.encounterMenu.group);

    // Title:
    sprite = this.createSprite(startX + width / 2, startY + 16, 'LargeTitle', this.encounterMenu.group);
    sprite.anchor.setTo(0.5, 0.5);
    this.encounterMenu.titleText = gameState.createText(startX + width / 2, startY + 16, 'Encounter', LARGE_BLACK_FONT, this.encounterMenu.group);
    this.encounterMenu.titleText.anchor.setTo(0.5, 0.5);
	
	// Text Box:
    this.encounterMenu.textBox = gameState.createTextBox({x: startX + 16, y: startY + 32}, 24);
    this.encounterMenu.group.add(this.encounterMenu.textBox.group);
    
	// OPEN:
	// *************************************************************************
	this.encounterMenu.open = function () {
		this.group.visible = true;
		//gameState.currentEncounter.stateName = 'Init';
		this.refresh();
		gameState.gameState = 'ENCOUNTER_MENU_STATE';
	};
	
	// CLOSE:
	// *************************************************************************
	this.encounterMenu.close = function () {
		this.group.visible = false;
		gameState.gameState = 'GAME_STATE';
	};
	
	// REFRESH:
	// *************************************************************************
	this.encounterMenu.refresh = function () {
		var buttons, i;
		this.titleText.setText(gameState.currentEncounter.type.niceName);
		this.textBox.setText(gameState.getEncounterText());
		
		buttons = gameState.getEncounterButtons();
		
		for (i = 0; i < 4; i += 1) {
			if (i < buttons.length) {
				this.buttons[i].text.setText(buttons[i].text);
				this.buttons[i].group.visible = true;
				this.buttons[i].button.events.onInputDown.removeAll();
                this.buttons[i].button.events.onInputDown.add(buttons[i].func, gameState.currentEncounter);
			} else {
				this.buttons[i].group.visible = false;
			}
		}
		
	};
	
	// Buttons:
	this.encounterMenu.buttons = [];
	this.encounterMenu.buttons[0] = gameState.createTextButton(startX + width / 4, startY + 446, 'TEXT', null, gameState, this.encounterMenu.group);
	this.encounterMenu.buttons[1] = gameState.createTextButton(startX + 3 * width / 4, startY + 446, 'TEXT', null, gameState, this.encounterMenu.group);
	this.encounterMenu.buttons[2] = gameState.createTextButton(startX + width / 4, startY + 484, 'TEXT', null, gameState, this.encounterMenu.group);
	this.encounterMenu.buttons[3] = gameState.createTextButton(startX + 3 * width / 4, startY + 484, 'TEXT', null, gameState, this.encounterMenu.group);
	
	this.encounterMenu.group.visible = false;
};

// CREATE_JOB_MENU:
// *****************************************************************************
gameState.createJobMenu = function () {
	var startX = 80,
        startY = 40,
        width = 440,
        height = 440,
		sprite,
		text;
	
	this.jobMenu = {};
    
    // Group:
    this.jobMenu.group = game.add.group();
    this.jobMenu.group.fixedToCamera = true;
    
    // Menu:
    this.createSprite(startX, startY, 'Menu', this.jobMenu.group);

    // Title:
    sprite = this.createSprite(startX + width / 2, startY + 16, 'LargeTitle', this.jobMenu.group);
    sprite.anchor.setTo(0.5, 0.5);
    text = gameState.createText(startX + width / 2 - 80, startY + 6, 'Deliver Package', LARGE_BLACK_FONT, this.jobMenu.group);
	
	// Package icon:
	sprite = this.createSprite(startX + width / 2 - 24, startY + 34, 'ItemIcons', this.jobMenu.group);
	sprite.frame = 20;
	
	// Text Box:
    this.jobMenu.textBox = gameState.createTextBox({x: startX + 16, y: startY + 92}, 22);
    this.jobMenu.group.add(this.jobMenu.textBox.group);
    
	// OPEN:
	// *************************************************************************
	this.jobMenu.open = function () {
		this.group.visible = true;
		this.refresh();
		gameState.gameState = 'JOB_MENU_STATE';
	};
	
	// CLOSE:
	// *************************************************************************
	this.jobMenu.close = function () {
		this.group.visible = false;
		gameState.gameState = 'GAME_STATE';
	};
	
	// REFRESH:
	// *************************************************************************
	this.jobMenu.refresh = function () {
		var text, job = gameState.currentColony.job;
		
		if (job.typeName === 'Delivery') {
			text = gameState.jobTypes[job.typeName].text;
			text = text.replace('[DEST]', job.colonyName);
			text = text.replace('[DEST]', job.colonyName);
			text = text.replace('[REWARD]', job.reward);
			
			this.textBox.setText(text);
		}
	};
	
	// ACCEPT_CLICKED:
	// *************************************************************************
	this.jobMenu.acceptClicked = function () {
		var pc = gameState.playerCharacter, job = gameState.currentColony.job;
		
		if (job.typeName === 'Delivery') {
			pc.addJob(job);
			pc.inventory.addItem('Package', 1);
			gameState.getTile(gameState.getColonyWithName(job.colonyName).tileIndex).explored = true;
		}
		
		gameState.currentColony.job = null;
		gameState.menuStack.pop();
	};
	
	// REJECT_CLICKED:
	// *************************************************************************
	this.jobMenu.rejectClicked = function () {
		gameState.menuStack.pop();
	};
	
	// Buttons:
	this.jobMenu.acceptButton = gameState.createTextButton(startX + width / 4, startY + 484, 'ACCEPT', this.jobMenu.acceptClicked, this.jobMenu, this.jobMenu.group);
	this.jobMenu.acceptButton = gameState.createTextButton(startX + 3 * width / 4, startY + 484, 'REJECT', this.jobMenu.rejectClicked, this.jobMenu, this.jobMenu.group);
	this.jobMenu.group.visible = false;
};

// CREATE_MAP_MENU:
// *****************************************************************************
gameState.createMapMenu = function () {
	var startX = 80,
        startY = 40,
        width = 440,
        height = 440,
		sprite,
		text,
		i;
		
	this.mapMenu = {};
    
    // Group:
    this.mapMenu.group = game.add.group();
    this.mapMenu.group.fixedToCamera = true;
    
    // Menu:
    this.createSprite(startX, startY, 'Menu', this.mapMenu.group);

    // Title:
    sprite = this.createSprite(startX + width / 2, startY + 16, 'LargeTitle', this.mapMenu.group);
    sprite.anchor.setTo(0.5, 0.5);
    text = gameState.createText(startX + width / 2, startY + 16, 'SECTOR MAP', LARGE_BLACK_FONT, this.mapMenu.group);
    text.anchor.setTo(0.5, 0.5);
	
	// Map:
    this.createMiniMap(startX + 40, startY + 32, this.mapMenu.group);
	
	// Text:
	this.mapMenu.text = gameState.createText(startX + width / 2, startY + 380, 'TEXT', LARGE_WHITE_FONT, this.mapMenu.group);
	this.mapMenu.text.anchor.setTo(0.5, 0.5);
	
	// Mission Icons:
	this.mapMenu.missionIcons = [];
	for (i = 0; i < 9; i += 1) {
		this.mapMenu.missionIcons[i] = gameState.createSprite(0, 0, 'ItemIcons', this.mapMenu.group);
		this.mapMenu.missionIcons[i].anchor.setTo(0.5, 0.5);
		this.mapMenu.missionIcons[i].frame = 85;
	}
	
	// Player Icon:
	this.mapMenu.playerIcon = gameState.createSprite(0, 0, 'ItemIcons', this.mapMenu.group);
	this.mapMenu.playerIcon.anchor.setTo(0.5, 0.5);
	this.mapMenu.playerIcon.frame = 86;
	
	// OPEN:
	// ******************************************************************************************
	this.mapMenu.open = function () {
		this.group.visible = true;
		this.refresh();
		gameState.gameState = 'MAP_MENU_STATE';
	};
	
	// CLOSE:
	// ******************************************************************************************
	this.mapMenu.close = function () {
		this.group.visible = false;
		gameState.gameState = 'GAME_STATE';
	};
	
	
	// REFRESH:
	// ******************************************************************************************
	this.mapMenu.refresh = function () {
		gameState.refreshMiniMap();
	};
	
	   // MAP_MENU_UPDATE:
    // ------------------------------------------------------------
    this.mapMenu.update = function () {
        var tileX = Math.floor((game.input.activePointer.position.x - (startX + 40)) / MINI_MAP_TILE_SIZE),
            tileY = Math.floor((game.input.activePointer.position.y - (startY + 32)) / MINI_MAP_TILE_SIZE),
			pc = gameState.playerCharacter,
            text = '',
            eventText,
            nearestObj,
            i,
			j,
            distance;
		
		// Clicking map to set waypoint:
		if (gameState.input.activePointer.isDown && tileX >= 0 && tileX < gameState.numTilesX && tileY >= 0 && tileY < gameState.numTilesY) {
			gameState.wayPointIndex = {x: tileX, y: tileY};
			this.refresh();
		}

        if (tileX >= 0 && tileX < gameState.numTilesX && tileY >= 0 && tileY < gameState.numTilesY) {
			// Find the nearest colony, encounter or player to mouse:
			nearestObj = {name: 'You',
						  distance: game.math.distance(tileX, tileY, pc.tileIndex.x, pc.tileIndex.y)};

			// Highlight Colonies:
			for (i = 0; i < gameState.colonyList.length; i += 1) {
				distance = game.math.distance(tileX, tileY, gameState.colonyList[i].tileIndex.x, gameState.colonyList[i].tileIndex.y);
				if (gameState.getTile(gameState.colonyList[i].tileIndex).explored && distance < nearestObj.distance) {
					nearestObj = {name: gameState.colonyList[i].name + ' (' + gameState.colonyList[i].type.niceName + ')',
								  distance: distance};

					if (pc.hasPackageTo(gameState.colonyList[i])) {
						nearestObj.name += ' package';
					}
				}
			}
			
			// Highlight encounters:
			for (i = 0; i < gameState.encounterList.length; i += 1) {
				distance = game.math.distance(tileX, tileY, gameState.encounterList[i].tileIndex.x, gameState.encounterList[i].tileIndex.y);
				if (gameState.getTile(gameState.encounterList[i].tileIndex).explored && distance < nearestObj.distance) {
					nearestObj = {name: gameState.encounterList[i].type.niceName,
								  distance: distance};
				}
			}

			if (nearestObj.distance < 3) {
				this.text.setText(nearestObj.name);
			} else if (gameState.tileMap[tileX][tileY].explored) {
				this.text.setText(gameState.tileMap[tileX][tileY].type.niceName);
			} else {
				this.text.setText('UNEXPLORED');
			}
        } else {
            this.text.setText('CLICK TO CREATE WAY POINT');
		}
		
		// Place mission icons:
		for (i = 0; i < 9; i += 1) {
			this.missionIcons[i].visible = false;
		}
		
		j = 0;
		for (i = 0; i < gameState.colonyList.length; i += 1) {
			if (pc.hasPackageTo(gameState.colonyList[i])) {
				this.missionIcons[j].x = startX + 40 + gameState.colonyList[i].tileIndex.x * MINI_MAP_TILE_SIZE + MINI_MAP_TILE_SIZE / 2;
				this.missionIcons[j].y = startY + 32 + gameState.colonyList[i].tileIndex.y * MINI_MAP_TILE_SIZE + MINI_MAP_TILE_SIZE / 2;
				this.missionIcons[j].visible = true;
				j += 1;
			}
		}
		
		this.playerIcon.x = startX + 40 + gameState.playerCharacter.tileIndex.x * MINI_MAP_TILE_SIZE + MINI_MAP_TILE_SIZE / 2;
		this.playerIcon.y = startY + 32 + gameState.playerCharacter.tileIndex.y * MINI_MAP_TILE_SIZE + MINI_MAP_TILE_SIZE / 2;
    };
	
	// CLOSE_CLICKED:
	// ******************************************
	this.mapMenu.closeClicked = function () {
		gameState.menuStack.pop();
	};
	
	// CLEAR_WAYPOINT:
	// ******************************************************************************************
	this.mapMenu.clearWayPointClicked = function () {
		gameState.wayPointIndex = {x: null, y: null};
		this.refresh();
	};
	
	// BUTTONS:
	// ******************************************************************************************
	gameState.createTextButton(startX + width / 4, startY + 484, 'CLEAR WAYPOINT', this.mapMenu.clearWayPointClicked, this.mapMenu, this.mapMenu.group);
	gameState.createTextButton(startX + 3 * width / 4, startY + 484, 'CLOSE', this.mapMenu.closeClicked, this.mapMenu, this.mapMenu.group);
	
	this.mapMenu.group.visible = false;
};

gameState.createMiniMap = function (startX, startY, group) {
    var mapTileSize = MINI_MAP_TILE_SIZE;

    // Map sprite:
    this.miniMapBMP = game.add.bitmapData(gameState.numTilesX * mapTileSize, gameState.numTilesY * mapTileSize);
    this.miniMapSprite = this.game.add.sprite(startX, startY, this.miniMapBMP);
    group.add(this.miniMapSprite);
   
};

gameState.refreshMiniMap = function () {
    var x, y, mapTileSize = MINI_MAP_TILE_SIZE;

    // Fill black:
    this.miniMapBMP.context.fillStyle = "rgb(0,0,0)";
    this.miniMapBMP.context.fillRect(0, 0, this.miniMapBMP.width, this.miniMapBMP.height);

    // Draw dots:
    for (x = 0; x < gameState.numTilesX; x += 1) {
        for (y = 0; y < gameState.numTilesY; y += 1) {
            
			if (x === gameState.wayPointIndex.x && y === gameState.wayPointIndex.y) {
				this.miniMapBMP.context.fillStyle = 'rgb(255,0,255)';
            // Unexplored (black):
			} else if (!gameState.tileMap[x][y].explored) {
                this.miniMapBMP.context.fillStyle = 'rgb(0,0,0)';
            
            // Player:
            } else if (x === gameState.playerCharacter.tileIndex.x && y === gameState.playerCharacter.tileIndex.y) {
                this.miniMapBMP.context.fillStyle = 'rgb(0,255,0)';
                
				
            // Colony:
            } else if (gameState.tileMap[x][y].colony) {
                this.miniMapBMP.context.fillStyle = 'rgb(0,0,255)';
    
			// Encounter:
			} else if (gameState.tileMap[x][y].encounter) {
				this.miniMapBMP.context.fillStyle = 'rgb(255,255,0';
			
            } else {
                this.miniMapBMP.context.fillStyle = gameState.tileMap[x][y].type.color;
            }
            
            this.miniMapBMP.context.fillRect(x * mapTileSize, y * mapTileSize, mapTileSize, mapTileSize);
        }
    }

    this.miniMapBMP.dirty = true;
};

// CREATE_TEXT_MENU:
// *****************************************************************************
gameState.createTextMenu = function (startX, startY) {
	var width = 440,
        height = 440,
		sprite,
		text;
		
	this.textMenu = {};
    
    // Group:
    this.textMenu.group = game.add.group();
    this.textMenu.group.fixedToCamera = true;
    
    // Menu:
    this.createSprite(startX, startY, 'Menu', this.textMenu.group);

    // Title:
    sprite = this.createSprite(startX + width / 2, startY + 16, 'LargeTitle', this.textMenu.group);
    sprite.anchor.setTo(0.5, 0.5);
    this.textMenu.titleText = gameState.createText(startX + width / 2, startY + 16, 'Character', LARGE_BLACK_FONT, this.textMenu.group);
    this.textMenu.titleText.anchor.setTo(0.5, 0.5);
	
	// Text Box:
    this.textMenu.textBox = gameState.createTextBox({x: startX + 20, y: startY + 32}, 27);
    this.textMenu.group.add(this.textMenu.textBox.group);
    
	// SET_TITLE:
	// ********************************
	this.textMenu.setTitle = function (text) {
		this.titleText.setText(text);
	};
	
	// SET_TEXT:
	// ********************************
	this.textMenu.setText = function (text) {
		this.textBox.setText(text);
	};
	
	// SET_BUTTONS:
	// ********************************
	this.textMenu.setButtons = function (buttons) {
		var i;
		this.buttons[0].group.visible = false;
		this.buttons[1].group.visible = false;
		for (i = 0; i < buttons.length; i += 1) {
			this.buttons[i].text.setText(buttons[i].text);
			this.buttons[i].button.func = buttons[i].func;
			this.buttons[i].group.visible = true;
		}
		
		if (buttons.length === 1) {
			this.buttons[0].button.x = startX + width / 2;
			this.buttons[0].text.x = startX + width / 2;
		} else {
			this.buttons[0].button.x = startX + width / 4;
			this.buttons[0].text.x = startX + width / 4;
			this.buttons[1].button.x = startX + 3 * width / 4;
			this.buttons[1].text.x = startX + 3 *  width / 4;
		}
	};
	
	// REFRESH:
	// ********************************
	this.textMenu.refresh = function () {
		
	};
	
	// OPEN:
	// ********************************
	this.textMenu.open = function () {
		this.refresh();
		gameState.gameState = 'TEXT_MENU_STATE';
		this.group.visible = true;
	};
	
	// CLOSE:
	// ********************************
	this.textMenu.close = function () {
		gameState.gameState = 'GAME_STATE';
		this.group.visible = false;
	};
	
	// BUTTON_CLICKED:
	// ********************************
	this.textMenu.buttonClicked = function (button) {
		button.func();
	};
	
	// BUTTONS:
	// ********************************
	this.textMenu.buttons = [];
	this.textMenu.buttons[0] = this.createTextButton(startX + width / 4, startY + 484, 'BUTTON1', this.textMenu.buttonClicked, this.textMenu, this.textMenu.group);
	this.textMenu.buttons[1] = this.createTextButton(startX + 3 * width / 4, startY + 484, 'BUTTON2', this.textMenu.buttonClicked, this.textMenu, this.textMenu.group);
	this.textMenu.group.visible = false;
};

