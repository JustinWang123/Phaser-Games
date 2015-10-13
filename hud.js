/*global game, gameState, SCREEN_HEIGHT, LARGE_BLACK_FONT, LARGE_RED_FONT, LARGE_GREEN_FONT, LARGE_WHITE_FONT, SMALL_BLACK_FONT, REPAIR_TIME*/
'use strict';

var NUM_DAMAGE_TEXT_SPRITES = 10;

// CREATE_PLAYER_CHARACTER_INPUT:
// ************************************************************************************************
gameState.createPlayerCharacterInput = function () {
	var text;
	
    // Clicking pointer:
    game.input.onDown.add(function () {
		var pointerWorldPosition = {x: game.input.activePointer.x + game.camera.x, y: game.input.activePointer.y + game.camera.y},
			targetShip,
			pc = gameState.playerCharacter;
    
        if (gameState.instructionsSprite) {
            gameState.paused = false;
            gameState.instructionsSprite.destroy();
        }
        
        if (gameState.gameState !== 'GAME_STATE') {
            return;
        }
        
        
        if (gameState.isPointerInWorld()) {
            targetShip = gameState.getShipAtPosition(pointerWorldPosition);
			if (targetShip && targetShip !== pc) {
				pc.targetShip = targetShip;
				if (pc.combatHelp) {
					pc.combatHelp = false;
					gameState.textMenu.setTitle('COMBAT');
					text = 'You have targeted a hostile ship!\n\n';
					text += 'You can change your target at any time by clicking on another ship.\n\n';
					text += 'Click the 1,2,3,4 keys on your keyboard to fire your weapons.\n\n';
					text += 'Try to dodge the enemies projectiles and keep an eye on your hit points and shields';
					gameState.textMenu.setText(text);
					gameState.textMenu.setButtons([{text: 'CLOSE', func: function () { gameState.menuStack.pop(); }}]);
					gameState.menuStack.push(gameState.textMenu);
				}
			} else {
				pc.destination = pointerWorldPosition;
			}
        }
    }, this);
};

// PLAYER CHARACTER EXP PERCENT:
// ************************************************************************************************
gameState.playerCharacterExpPercent = function () {
    var expToLevel = this.playerCharacter.exp - this.expPerLevel[this.playerCharacter.level],
        totalExpToLevel = this.expPerLevel[this.playerCharacter.level + 1] - this.expPerLevel[this.playerCharacter.level];
    return Math.floor(expToLevel / totalExpToLevel * 100);
    
};

// CREATE_HUD_SPRITES:
// ************************************************************************************************
gameState.createHUDSprites = function () {
    var startX = 580,
        width = 220,
        sprite,
        text,
        createItemSlot,
        i,
        buttonX,
        buttonY;
    
    this.HUD = {};
    this.HUD.group = game.add.group();
    this.HUD.group.fixedToCamera = true;
    
    // HUD:
    this.HUD.menu = this.createSprite(0, 0, 'HUD');
    this.HUD.group.add(this.HUD.menu);
    
    // CHARACTER STATUS:
    // ******************************************************************************************
    // HUD HP Bar:
    buttonX = startX + 38;
    buttonY = 18;
    this.createSprite(buttonX, buttonY, 'MediumTitle', this.HUD.group);
    this.HUD.hpBar = this.createSprite(buttonX + 2, buttonY + 2, 'BarFill', this.HUD.group);
    this.HUD.hpBar.frame = 1;
	this.HUD.hpText = this.createText(buttonX + 8, buttonY + 2, 'HP: ', LARGE_BLACK_FONT, this.HUD.group);

	// Shield HP Bar:
	buttonX = startX + 38;
	buttonY = 46;
	this.createSprite(buttonX, buttonY, 'MediumTitle', this.HUD.group);
	this.HUD.shieldBar = this.createSprite(buttonX + 2, buttonY + 2, 'BarFill', this.HUD.group);
	this.HUD.shieldBar.frame = 0;
	this.HUD.shieldBarText = this.createText(buttonX + 8, buttonY + 2, 'SHIELD 10/10: ', LARGE_BLACK_FONT, this.HUD.group);
	
    // Level Text:
    buttonX = startX + 38;
    buttonY = 74;
    this.createSprite(buttonX, buttonY, 'MediumTitle', this.HUD.group);
    this.HUD.levelBar = this.createSprite(buttonX + 2, buttonY + 2, 'BarFill', this.HUD.group);
    this.HUD.levelBar.frame = 2;
    this.HUD.levelText = this.createText(buttonX + 8, buttonY + 2, 'LVL: ', LARGE_BLACK_FONT, this.HUD.group);

	// Fuel Bar:
	buttonX = startX + 38;
	buttonY = 102;
    this.HUD.fuelText = this.createText(buttonX, buttonY, 'FUEL: ', LARGE_BLACK_FONT, this.HUD.group);

    // Credits Text:
    this.HUD.creditsText = this.createText(startX + 38, 130, 'CREDS: ', LARGE_BLACK_FONT, this.HUD.group);
  
	// Cargo Text:
	this.HUD.cargoText = this.createText(startX + 38, 158, 'CARGO: ', LARGE_BLACK_FONT, this.HUD.group);
	
	// Sector Text:
	this.HUD.sectorText = this.createText(180, 0, 'SECTOR: ', LARGE_BLACK_FONT, this.HUD.group);

	// Timer Text:
	this.HUD.timerText = this.createText(20, 0, 'TIME', LARGE_BLACK_FONT, this.HUD.group);
	
	// Mouse Over Text:
	this.HUD.mouseOverText = this.createText(20, SCREEN_HEIGHT - 20, 'MOUSE', LARGE_BLACK_FONT, this.HUD.group);
	
    // WEAPON SLOTS:
	// ******************************************************************************************
	this.HUD.weaponSlots = [];
    buttonX = startX + 12;
    buttonY = 186;
	for (i = 0; i < 4; i += 1) {
		this.HUD.weaponSlots[i] = {};
		// Item:
		this.HUD.weaponSlots[i].item = this.createButton(buttonX, buttonY, 'ItemIcons', this.weaponSlotClicked, this, this.HUD.group);
		this.HUD.weaponSlots[i].item.slot = i;
		
		// Cool down:
		this.createSprite(buttonX + 48, buttonY, 'MediumTitle', this.HUD.group);
		this.HUD.weaponSlots[i].coolDownBar = this.createSprite(buttonX + 48 + 2, buttonY + 2, 'BarFill', this.HUD.group);
		this.HUD.weaponSlots[i].coolDownBar.frame = 3;
		
		// Text:
		this.HUD.weaponSlots[i].text = this.createText(buttonX + 50, buttonY + 22, 'Weapon', SMALL_BLACK_FONT, this.HUD.group);
		
		buttonY += 50;
	}
	
    // BUTTONS:
    // ******************************************************************************************
	this.HUD.exitButton = this.createTextButton(startX + width / 2, 440, 'EXIT', this.exitClicked, this, this.HUD.group);
	this.createTextButton(startX + width / 2, 480, 'MAP', this.mapClicked, this, this.HUD.group);
    this.createTextButton(startX + width / 2, 520, 'INVENTORY', this.inventoryClicked, this, this.HUD.group);
    this.HUD.characterButton = this.createTextButton(startX + width / 2, 560, 'CHARACTER', this.characterClicked, this, this.HUD.group);
    
    // DAMAGE TEXT SPRITES:
    // ******************************************************************************************
    this.HUD.damageTextSprites = [];
    for (i = 0; i < NUM_DAMAGE_TEXT_SPRITES; i += 1) {
        this.HUD.damageTextSprites.push(this.createText(0, 0, 'undefined damage text', LARGE_RED_FONT, this.hudTileSpritesGroup));
        this.HUD.damageTextSprites[i].anchor.setTo(0.5, 0.5);
        this.HUD.damageTextSprites[i].visible = false;
        this.HUD.damageTextSprites[i].isAlive = false;
    }
	
	// SHIP_TARGET_SPRITE:
	// ******************************************************************************************
	this.HUD.targetSprite = this.createSprite(0, 0, 'ItemIcons', this.hudTileSpritesGroup);
	this.HUD.targetSprite.frame = 83;
	this.HUD.targetSprite.anchor.setTo(0.5, 0.5);
	
	this.HUD.targetHp = this.createText(0, 0, '0', LARGE_RED_FONT, this.hudTileSpritesGroup);
	this.HUD.targetShieldHp = this.createText(0, 0, '0', LARGE_GREEN_FONT, this.hudTileSpritesGroup);
	
	// PLAYER SHIP HUD:
	this.HUD.screenHpText = this.createText(0, 0, '0', LARGE_RED_FONT, this.hudTileSpritesGroup);
	this.HUD.shieldHpText = this.createText(0, 0, '0', LARGE_GREEN_FONT, this.hudTileSpritesGroup);
	
	
	// WAY_POINT_SPRITE:
	// ******************************************************************************************
	this.HUD.wayPointSprite = this.createSprite(0, 0, 'WayPoint');
	this.HUD.wayPointSprite.anchor.setTo(0.5, 0.5);
};

// UPDATE_HUD_SPRITES:
// ************************************************************************************************
gameState.updateHUDSprites = function () {
    var pc = gameState.playerCharacter,
		i,
		seconds,
		minutes;
    
	// UPDATE STATS:
	// ******************************************************
    // Update HP text:
    this.HUD.hpText.setText('HP: ' + pc.currentHp + '/' + pc.maxHp);
    
    // Update HP Bar:
    this.HUD.hpBar.scale.setTo(70 * pc.currentHp / pc.maxHp, 2);
    
	// Update shield text:
	this.HUD.shieldBarText.setText('SHIELD: ' + pc.currentShieldHp + '/' + pc.maxShieldHp);
	
	// Update Shield Bar:
	this.HUD.shieldBar.scale.setTo(70 * pc.currentShieldHp / pc.maxShieldHp, 2);
	
    // Update level text:
    this.HUD.levelText.setText('LVL: ' + pc.level + ' (' + this.playerCharacterExpPercent() + '%)');

    // Update level bar:
    this.HUD.levelBar.scale.setTo(70 * this.playerCharacterExpPercent() / 100, 2);
	
    // Update Credits Text:
    this.HUD.creditsText.setText('CREDS: ' + pc.credits);
    
	// Update timer text:
	seconds = Math.floor(this.testTimer / 60);
	minutes = Math.floor(seconds / 60);
	this.HUD.timerText.setText('TIME: ' + minutes + ':' + (seconds - minutes * 60) + '/20:00');
	
	// Update Mouse Over Text:
	if (this.isPointerInWorld()) {
		this.HUD.mouseOverText.setText(this.getTextUnderPointer());
	} else {
		this.HUD.mouseOverText.setText('');
	}
	
	// Update sector text:
	if (this.objectiveComplete) {
		this.HUD.sectorText.setText('OBJECTIVE COMPLETE');
	} else {
		this.HUD.sectorText.setText('OBJECTIVE: (' + (this.getPlayerNetWorth() - this.initialNetWorth) + '/' + this.goalCredits);
	}
	
	// Update cargo Text:
	this.HUD.cargoText.setText('CARGO: ' + Math.ceil(pc.inventory.getWeight()) + '/' + pc.cargoCap);
	if (pc.inventory.getWeight() > pc.cargoCap) {
		this.HUD.cargoText.setStyle(LARGE_RED_FONT);
	} else {
		this.HUD.cargoText.setStyle(LARGE_BLACK_FONT);
	}
	
	// Update fuel Text:
	this.HUD.fuelText.setText('FUEL: ' + pc.inventory.countItem('Fuel'));
	if (pc.inventory.countItem('Fuel') <= 3) {
		this.HUD.fuelText.setStyle(LARGE_RED_FONT);
	} else {
		this.HUD.fuelText.setStyle(LARGE_BLACK_FONT);
	}
	
	// Update character button:
	if (pc.skillPoints > 0) {
		this.HUD.characterButton.text.setStyle(LARGE_GREEN_FONT);
	} else {
		this.HUD.characterButton.text.setStyle(LARGE_BLACK_FONT);
	}
	
	// Update exit buttons:
	this.HUD.exitButton.group.visible = this.objectiveComplete;
	
	// UPDATE INVENTORY:
	// ******************************************************
    // Update weapon sprite:
	for (i = 0; i < 4; i += 1) {
		if (i < pc.weaponTypes.length) {
			this.HUD.weaponSlots[i].coolDownBar.visible = true;
			this.HUD.weaponSlots[i].text.visible = true;
			this.HUD.weaponSlots[i].item.frame = pc.weaponTypes[i].imageIndex;
			this.HUD.weaponSlots[i].text.setText(pc.weaponTypes[i].shortName);
			
			// Update coolDown bar:
			if (pc.coolDowns[i].current === 0) {
				this.HUD.weaponSlots[i].coolDownBar.frame = 3;
			} else {
				this.HUD.weaponSlots[i].coolDownBar.frame = 1;
			}
			this.HUD.weaponSlots[i].coolDownBar.scale.setTo(70 * (pc.coolDowns[i].max - pc.coolDowns[i].current) / pc.coolDowns[i].max, 2);
	
		} else {
			this.HUD.weaponSlots[i].item.frame = 36;
			this.HUD.weaponSlots[i].coolDownBar.visible = false;
			this.HUD.weaponSlots[i].text.visible = false;
		}
	}

	// UPDATE TARGET SPRITE:
	// ******************************************************
    if (pc.targetShip) {
		// Target Sprite:
		this.HUD.targetSprite.x = pc.targetShip.sprite.x;
		this.HUD.targetSprite.y = pc.targetShip.sprite.y;
		this.HUD.targetSprite.visible = true;
		
		this.HUD.targetHp.setText(pc.targetShip.currentHp);
		this.HUD.targetHp.x = pc.targetShip.sprite.x - 28;
		this.HUD.targetHp.y = pc.targetShip.sprite.y + 22;
		this.HUD.targetHp.visible = true;
		
		this.HUD.targetShieldHp.setText(pc.targetShip.currentShieldHp);
		this.HUD.targetShieldHp.x = pc.targetShip.sprite.x + 16;
		this.HUD.targetShieldHp.y = pc.targetShip.sprite.y + 22;
		this.HUD.targetShieldHp.visible = true;
	} else {
		this.HUD.targetSprite.visible = false;
		this.HUD.targetHp.visible = false;
		this.HUD.targetShieldHp.visible = false;
	}
	
	// UPDATE WAY POINT SPRITE:
	// ******************************************************
	if (this.wayPointIndex.x !== null && gameState.wayPointIndex.y !== null) {
		this.HUD.wayPointSprite.x = pc.sprite.x;
		this.HUD.wayPointSprite.y = pc.sprite.y;
		this.HUD.wayPointSprite.rotation = this.angleToFace(pc.sprite.position, this.getPositionFromTileIndex(this.wayPointIndex));
		this.HUD.wayPointSprite.visible = true;
		
		if (gameState.getDistance(pc.sprite.position, this.getPositionFromTileIndex(this.wayPointIndex)) < 250) {
			this.wayPointIndex = {x: null, y: null};
		}
	} else {
		this.HUD.wayPointSprite.visible = false;
	}
	
	// PLAYER HUD:
	this.HUD.screenHpText.setText(pc.currentHp);
	this.HUD.screenHpText.x = pc.sprite.x - 28;
	this.HUD.screenHpText.y = pc.sprite.y + 22;
		
	this.HUD.shieldHpText.setText(pc.currentShieldHp);
	this.HUD.shieldHpText.x = pc.sprite.x + 16;
	this.HUD.shieldHpText.y = pc.sprite.y + 22;
};

// GET_TEXT_UNDER_POINTER:
// ************************************************************************************************
gameState.getTextUnderPointer = function () {
	var tile = this.getTile(this.getPointerTileIndex());
	
	if (tile.items.length > 0) {
		return tile.items[0].amount + ' x ' + tile.items[0].type.niceName;
	} else if (tile.encounter) {
		return tile.encounter.type.niceName;
	} else if (tile.colony) {
		return tile.colony.type.niceName + ' ' + tile.colony.name;
	} else {
		return tile.type.niceName;
	}
};

// CREATE_DAMAGE_TEXT:
// ************************************************************************************************
gameState.createDamageText = function (x, y, text, color) {
    var i;
    
    for (i = 0; i < NUM_DAMAGE_TEXT_SPRITES; i += 1) {
        if (!this.HUD.damageTextSprites[i].isAlive) {
            this.HUD.damageTextSprites[i].x = x;
            this.HUD.damageTextSprites[i].y = y;
            this.HUD.damageTextSprites[i].life = 80;
            this.HUD.damageTextSprites[i].isAlive = true;
            this.HUD.damageTextSprites[i].setText(text);
            this.HUD.damageTextSprites[i].setStyle({font: '18px silkscreennormal', fill: color });
            this.HUD.damageTextSprites[i].visible = true;
            this.HUD.damageTextSprites[i].alpha = 1.0;
            break;
        }
    }
};

// UPDATE_DAMAGE_TEXT:
// ************************************************************************************************
gameState.updateDamageText = function () {
    var i;
    
    for (i = 0; i < NUM_DAMAGE_TEXT_SPRITES; i += 1) {
        // Disapear:
        if (this.HUD.damageTextSprites[i].life === 0) {
            this.HUD.damageTextSprites[i].isAlive = false;
            this.HUD.damageTextSprites[i].visible = false;
        // Pause and fade:
        } else if (this.HUD.damageTextSprites[i].life < 30) {
            this.HUD.damageTextSprites[i].life -= 1;
            this.HUD.damageTextSprites[i].alpha = this.HUD.damageTextSprites[i].alpha - 0.03;
        // Pause:
        } else if (this.HUD.damageTextSprites[i].life < 40) {
            this.HUD.damageTextSprites[i].life -= 1;
        
        
        // Move upwards:
        } else {
            this.HUD.damageTextSprites[i].life -= 1;
            this.HUD.damageTextSprites[i].y -= 0.25;
        }
    }
};

// INVENTORY_CLICKED:
// *****************************************************************************
gameState.inventoryClicked = function () {
	if (gameState.menuStack.head() === gameState.inventoryMenu) {
		gameState.menuStack.pop();
	} else {
		gameState.menuStack.push(gameState.inventoryMenu);
	}
};

// CHARACTER_CLICKED:
// *****************************************************************************
gameState.characterClicked = function () {
	if (gameState.menuStack.head() === gameState.characterMenu) {
		gameState.menuStack.pop();
	} else {
		gameState.menuStack.push(gameState.characterMenu);
	}
};

// EXIT_CLICKED
// *****************************************************************************
gameState.exitClicked = function () {
	gameState.enterGate();
};

// MAP_CLICKED:
// *****************************************************************************
gameState.mapClicked = function () {
	if (gameState.menuStack.head() === gameState.mapMenu) {
		gameState.menuStack.pop();
	} else {
		gameState.menuStack.push(gameState.mapMenu);
	}
};

// WEAPON_SLOT_CLICKED:
// *****************************************************************************
gameState.weaponSlotClicked = function (button) {
	var canFire, pc = gameState.playerCharacter;
	
    canFire = function (weaponSlot) {
		var pc = gameState.playerCharacter;
		return pc.targetShip
			&& pc.weaponTypes.length >= (weaponSlot + 1)
			&& pc.coolDowns[weaponSlot].current === 0
			&& gameState.getDistance(pc.sprite.position, pc.targetShip.sprite.position) < pc.weaponTypes[weaponSlot].range;
	};

	// Firing:
	if (canFire(button.slot)) {
		pc.fireAtShip(pc.targetShip, button.slot);
		pc.targetShip.gainAgro();
	}
};


// GET_POINTER_TILE_INDEX:
// ************************************************************************************************
gameState.getPointerTileIndex = function () {
    return this.getTileIndexFromPosition({x: game.input.activePointer.x + game.camera.x,
                                          y: game.input.activePointer.y + game.camera.y});
};

// GET_POINTER_WORLD_POSITION:
// ************************************************************************************************
gameState.getPointerWorldPosition = function () {
	return {x: game.input.activePointer.x + game.camera.x, y: game.input.activePointer.y + game.camera.y};
};

// IS_POINTER_IN_WORLD:
// ************************************************************************************************
gameState.isPointerInWorld = function () {
    return game.input.activePointer.x < 580
        && game.input.activePointer.x > 20
        && game.input.activePointer.y < 580
        && gameState.isTileIndexInBounds(this.getPointerTileIndex());
};
