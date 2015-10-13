/*global game, gameState, SECOND, TILE_SIZE*/
'use strict';

var SMOKE_LIFE = 30;
var PROJECTILE_LIFE = 5 * SECOND;
var BEAM_LIFE = SECOND;

// CREATE_PROJECTILE_TYPES:
// ************************************************************************************************
gameState.createProjectileTypes = function () {
    // Projectile Types:
    this.projectileTypes = {LaserBeam:        {name: 'LaserBeam',
												 imageIndex: 0,
												 damage: this.itemTypes.LaserBeam.damage,
												 ignoreShields: this.itemTypes.LaserBeam.ignoreShields,
												 range: this.itemTypes.LaserBeam.range},

							
							LaserCannon:		{name: 'LaserCannon',
												 imageIndex: 15,
												 damage: this.itemTypes.LaserCannon.damage,
												 ignoreShields: this.itemTypes.LaserCannon.ignoreShields,
												 speed: 5,
												 particle: 'CrystalRing',
												 life: PROJECTILE_LIFE},

                            MassDriver:         {name: 'MassDriver',
												 imageIndex: 1,
												 damage: this.itemTypes.MassDriver.damage,
												 ignoreShields: this.itemTypes.MassDriver.ignoreShields,
												 speed: 5,
												 particle: 'Ring',
												 life: PROJECTILE_LIFE},

							
                            MissileLauncher:    {name: 'MissileLauncher',
												 imageIndex: 2,
												 damage: this.itemTypes.MissileLauncher.damage,
												 ignoreShields: this.itemTypes.MissileLauncher.ignoreShields,
												 speed: 4,
												 particle: 'Smoke',
												 life: PROJECTILE_LIFE},

							PlasmaCannon:        {name: 'PlasmaCannon',
												 imageIndex: 7,
												 damage: this.itemTypes.PlasmaCannon.damage,
												 ignoreShields: this.itemTypes.PlasmaCannon.ignoreShields,
												 speed: 4,
												 particle: 'PlasmaRing',
												 life: PROJECTILE_LIFE},
							
							AdvancedLaserCannon:		{name: 'AdvancedLaserCannon',
												 imageIndex: 15,
												 damage: this.itemTypes.AdvancedLaserCannon.damage,
												 ignoreShields: this.itemTypes.AdvancedLaserCannon.ignoreShields,
												 speed: 5,
												 particle: 'CrystalRing',
												 life: PROJECTILE_LIFE},

                            AdvancedMassDriver:         {name: 'AdvancedMassDriver',
												 imageIndex: 1,
												 damage: this.itemTypes.AdvancedMassDriver.damage,
												 ignoreShields: this.itemTypes.AdvancedMassDriver.ignoreShields,
												 speed: 5,
												 particle: 'Ring',
												 life: PROJECTILE_LIFE},

							
                            AdvancedMissileLauncher:    {name: 'AdvancedMissileLauncher',
												 imageIndex: 2,
												 damage: this.itemTypes.AdvancedMissileLauncher.damage,
												 ignoreShields: this.itemTypes.AdvancedMissileLauncher.ignoreShields,
												 speed: 4,
												 particle: 'Smoke',
												 life: PROJECTILE_LIFE},

							AdvancedPlasmaCannon:        {name: 'AdvancedPlasmaCannon',
												 imageIndex: 7,
												 damage: this.itemTypes.AdvancedPlasmaCannon.damage,
												 ignoreShields: this.itemTypes.AdvancedPlasmaCannon.ignoreShields,
												 speed: 4,
												 particle: 'PlasmaRing',
												 life: PROJECTILE_LIFE},
							
							// MONSTER PROJECTILES:
							FireBall:			{name: 'Fireball',
												 imageIndex: 5,
												 damage: 2,
												 ignoreShields: 'default',
												 speed: 1.5,
												 particle: 'Smoke',
												 life: PROJECTILE_LIFE},
							
							CrystalCannon:		{name: 'CrystalCannon',
												 imageIndex: 10,
												 damage: this.itemTypes.CrystalCannon.damage,
												 ignoreShields: this.itemTypes.CrystalCannon.ignoreShields,
												 speed: 5,
												 particle: 'CrystalRing',
												 life: PROJECTILE_LIFE},
							
							IceCannon:			{name: 'IceCannon',
												 imageIndex: 12,
												 damage: this.itemTypes.IceCannon.damage,
												 ignoreShields: this.itemTypes.IceCannon.ignoreShields,
												 speed: 5,
												 particle: 'IceRing',
												 life: PROJECTILE_LIFE},
							
							EelCannon:			{name: 'EelCannon',
												 imageIndex: 14,
												 damage: this.itemTypes.EelCannon.damage,
												 ignoreShields: this.itemTypes.EelCannon.ignoreShields,
												 speed: 5,
												 particle: 'IceRing',
												 life: PROJECTILE_LIFE},
							
							DroneLaser:			{name: 'DroneLaser',
												 imageIndex: 15,
												 damage: this.itemTypes.DroneLaser.damage,
												 ignoreShields: this.itemTypes.DroneLaser.ignoreShields,
												 range: this.itemTypes.DroneLaser.range,
												 speed: 5,
												 particle: 'CrystalRing',
												 life: PROJECTILE_LIFE},
							
							// PARTICLES:
							Smoke:				{name: 'Smoke',
												 imageIndex: 4,
												 damage: 0,
												 ignoreShields: 0,
												 speed: 0},
							
							Ring:				{name: 'Ring',
												 imageIndex: 6,
												 damage: 0,
												 ignoreShields: null,
												 speed: 0},
							
							PlasmaRing:			{name: 'PlasmaRing',
												 imageIndex: 8,
												 damage: 0,
												 ignoreShields: null,
												 speed: 0},
							
							CrystalRing:		{name: 'CrystalRing',
												 imageIndex: 11,
												 damage: 0,
												 ignoreShields: null,
												 speed: 0},
							
							IceRing:		{name: 'IceRing',
												 imageIndex: 13,
												 damage: 0,
												 ignoreShields: null,
												 speed: 0}
                           };
};



// CREATE_PROJECTILE:
// ************************************************************************************************
gameState.createProjectile = function (actingShip, targetPosition, typeName) {
    var projectile = {},
        startPos = actingShip.sprite.position,
        endPos = targetPosition,
        distance;
    
    // Initial attributes:
    distance = game.math.distance(startPos.x, startPos.y, endPos.x, endPos.y);
    projectile.normal = {x: (endPos.x - startPos.x) / distance, y: (endPos.y - startPos.y) / distance};
    projectile.ignoreCharacter = actingShip;
    projectile.isAlive = true;
    projectile.type = this.projectileTypes[typeName];
    projectile.distance = distance;
    projectile.life = projectile.type.life;
	projectile.ringTimer = 0;
	
	if (actingShip !== gameState.playerCharacter && actingShip.type.name !== 'Pulser') {
		projectile.ignoreNPC = true;
	} else {
		projectile.ignoreNPC = false;
	}
	
    // Create sprite:
    projectile.sprite = gameState.projectileSpritesGroup.create(startPos.x, startPos.y, 'ProjectileTileset');
    projectile.sprite.anchor.setTo(0.5, 0.5);
    projectile.sprite.smoothed = false;
    projectile.sprite.scale.setTo(this.scaleFactor, this.scaleFactor);
    projectile.sprite.frame = projectile.type.imageIndex;
    projectile.sprite.rotation = game.math.angleBetween(startPos.x, startPos.y, endPos.x, endPos.y) + Math.PI / 2;
    
	// Visibility:
	if (gameState.getTile(gameState.getTileIndexFromPosition(projectile.sprite.position)).explored) {
		projectile.sprite.visible = true;
	} else {
		projectile.sprite.visible = false;
	}
	
	// Functions:
	projectile.update = this.updateProjectile;
	
    // Push to list:
    this.projectileList.push(projectile);
};



// UPDATE PROJECTILE
// *******************************************************************************
gameState.updateProjectile = function () {
    var hitCharacter,
        damage,
        nextPos,
        maxDistance,
		pc = gameState.playerCharacter;
    
	
	
    // Hit characters:
    hitCharacter = gameState.getShipAtPosition(this.sprite.position);
    if (hitCharacter && hitCharacter !== this.ignoreCharacter && (hitCharacter === pc || this.ignoreNPC === false)) {
		
		if (this.type.name === 'MissileLauncher' || this.type.name === 'AdvancedMissileLauncher') {
			gameState.createExplosion(this.sprite.position, 2, this.type.damage);
			gameState.explosionSound.play();
		} else if (this.type.name === 'MassDriver' || this.type.name === 'AdvancedMassDriver') {
			hitCharacter.velocity.x += this.normal.x;
			hitCharacter.velocity.y += this.normal.y;
			hitCharacter.takeDamage(this.type.damage, this.type.ignoreShields);
		} else {
			hitCharacter.takeDamage(this.type.damage, this.type.ignoreShields);
		}

        this.sprite.destroy();
        this.isAlive = false;
        return;
    }
	
	this.life -= 1;
	if (this.life <= 0 || !gameState.isRayClear(this.sprite.position, {x: this.sprite.position.x + this.normal.x * this.type.speed,
																	   y: this.sprite.position.y + this.normal.y * this.type.speed})) {
		if (this.type.name === 'MissileLauncher' || this.type.name === 'AdvancedMissileLauncher') {
			gameState.createExplosion(this.sprite.position, 2, this.type.damage);
		}
		this.sprite.destroy();
		this.isAlive = false;
		return;
	}

	this.ringTimer += 1;
	if (this.ringTimer === Math.floor(30 / this.type.speed)) {
		this.ringTimer = 0;
		gameState.createSmoke(this.sprite.position, {x: 0, y: 0}, 0, this.type.particle);
	}
	
    // Move:
    this.sprite.x += this.normal.x * this.type.speed;
    this.sprite.y += this.normal.y * this.type.speed;
	
	if (!gameState.isTileIndexInBounds(gameState.getTileIndexFromPosition(this.sprite.position))) {
		this.sprite.destroy();
        this.isAlive = false;
        return;
	}
	
	// Visibility:
	if (gameState.getTile(gameState.getTileIndexFromPosition(this.sprite.position)).explored) {
		this.sprite.visible = true;
	} else {
		this.sprite.visible = false;
	}
};

// UPDATE_PROJECTILES:
// ************************************************************************************************
gameState.updateProjectiles = function () {
    var i;
    
    // Remove dead projectiles:
    for (i = this.projectileList.length - 1; i !== -1; i -= 1) {
        if (!this.projectileList[i].isAlive) {
            this.projectileList.splice(i, 1);
        }
    }
    
    for (i = 0; i < this.projectileList.length; i += 1) {
        this.projectileList[i].update();
    }
};


// CREATE_SMOKE:
// ************************************************************************************************
gameState.createSmoke = function (position, normal, rotation, typeName) {
	var projectile = {},
		tileIndex = gameState.getTileIndexFromPosition(position);
	
	if (!gameState.isTileIndexInBounds(tileIndex)) {
		return;
	}
	
	// Initial Attributes:
	projectile.isAlive = true;
	projectile.type = this.projectileTypes[typeName];
	projectile.life = SMOKE_LIFE;
	projectile.normal = {x: normal.x, y: normal.y};
	
	// Sprite:
	projectile.sprite = gameState.projectileSpritesGroup.create(position.x, position.y, 'ProjectileTileset');
    projectile.sprite.anchor.setTo(0.5, 0.5);
    projectile.sprite.smoothed = false;
    projectile.sprite.scale.setTo(this.scaleFactor, this.scaleFactor);
    projectile.sprite.frame = projectile.type.imageIndex;
	projectile.sprite.alpha = 0.75;
	projectile.sprite.rotation = rotation;
	
	// Visibility:
	if (gameState.getTile(tileIndex).explored) {
		projectile.sprite.visible = true;
	} else {
		projectile.sprite.visible = false;
	}
	
	// Functions:
	projectile.update = this.updateSmoke;
	
	this.projectileList.push(projectile);
};

// UPDATE_SMOKE:
// ************************************************************************************************
gameState.updateSmoke = function () {
	this.life -= 1;
	this.sprite.alpha -= 0.02;
	this.sprite.scale.x -= 0.04;
	this.sprite.scale.y -= 0.04;
	
	// Visibility:
	if (gameState.getTile(gameState.getTileIndexFromPosition(this.sprite.position)).explored) {
		this.sprite.visible = true;
	} else {
		this.sprite.visible = false;
	}
	
	this.sprite.x += this.normal.x * 0.5;
	this.sprite.y += this.normal.y * 0.5;

	if (!gameState.isTileIndexInBounds(gameState.getTileIndexFromPosition(this.sprite.position))) {
		this.sprite.destroy();
        this.isAlive = false;
        return;
	}
	
	if (this.life === 0) {
		this.sprite.destroy();
        this.isAlive = false;
	}
};

// CREATE_BEAM:
// ************************************************************************************************
gameState.createBeam = function (fromShip, toShip, typeName) {
	var beam = {},
		startPos = fromShip.sprite.position,
		endPos = toShip.sprite.position,
		midPos = {x: (startPos.x + endPos.x) / 2, y: (startPos.y + endPos.y) / 2},
		distance = this.getDistance(startPos, endPos);
	
	// Attributes:
	beam.isAlive = true;
	beam.type = this.projectileTypes[typeName];
	beam.life = BEAM_LIFE;
	beam.damageTimer = 0;
	beam.fromShip = fromShip;
	beam.toShip = toShip;
	
	// Sprite:
	beam.sprite = gameState.createSprite(midPos.x, midPos.y, 'ProjectileTileset', this.projectileSpriteGroup);
	beam.sprite.anchor.setTo(0.5, 0.5);
	beam.sprite.frame = beam.type.imageIndex;
	beam.sprite.rotation = gameState.angleToFace(startPos, endPos);
	beam.sprite.scale.setTo(2, distance / 10);
							
	// Functions:
	beam.update = this.updateBeam;
	
	this.projectileList.push(beam);
};

// UPDATE_BEAM:
// ************************************************************************************************
gameState.updateBeam = function () {
	var startPos = this.fromShip.sprite.position,
		endPos = this.toShip.sprite.position,
		midPos = {x: (startPos.x + endPos.x) / 2, y: (startPos.y + endPos.y) / 2},
		distance = gameState.getDistance(startPos, endPos);
	
	this.sprite.x = midPos.x;
	this.sprite.y = midPos.y;
	this.sprite.rotation = gameState.angleToFace(startPos, endPos);
	this.sprite.scale.setTo(2, distance / 10);
	
	this.life -= 1;
	if (this.life === 0) {
		this.isAlive = false;
		this.sprite.destroy();
	}
	
	this.damageTimer += 1;
	if (this.damageTimer === SECOND / 3) {
		this.damageTimer = 0;
		this.toShip.takeDamage(this.type.damage, this.type.ignoreShields);
	}
	
	if (!this.toShip.isAlive || !this.fromShip.isAlive || distance > this.type.range) {
		this.isAlive = false;
		this.sprite.destroy();
	}
};

// CREATE_EXPLOSION:
// ************************************************************************************************
gameState.createExplosion = function (position, tileRadius, damage) {
    var x, y, i, normal;
    
    for (x = -tileRadius; x <= tileRadius; x += 1) {
        for (y = -tileRadius; y <= tileRadius; y += 1) {
			if (this.getDistance(position, {x: position.x + x * TILE_SIZE, y: position.y + y * TILE_SIZE}) <= tileRadius * TILE_SIZE) {
				if (this.isTileIndexInBounds(this.getTileIndexFromPosition({x: position.x + x * TILE_SIZE, y: position.y + y * TILE_SIZE}))) {
				
					this.createFire({x: position.x + x * TILE_SIZE, y: position.y + y * TILE_SIZE});

					if (this.getTile(this.getTileIndexFromPosition({x: position.x + x * TILE_SIZE, y: position.y + y * TILE_SIZE})).type.name === 'Asteroid') {
						this.getTile(this.getTileIndexFromPosition({x: position.x + x * TILE_SIZE, y: position.y + y * TILE_SIZE})).type = this.tileTypes.Space;
					}
				}
				
			}
        }
    }
    
    // Damage characters:
    for (i = 0; i < this.characterList.length; i += 1) {
        if (game.math.distance(position.x, position.y, this.characterList[i].sprite.x, this.characterList[i].sprite.y) <= tileRadius * TILE_SIZE) {
            if (this.characterList[i].isAlive) {
				normal = this.getNormal(position, this.characterList[i].sprite.position);
				this.characterList[i].velocity.x += normal.x * 1.5;
				this.characterList[i].velocity.y += normal.y * 1.5;
				this.characterList[i].takeDamage(damage, 'default');
			}
        }
    }
};


// CREATE_FIRE:
// ************************************************************************************************
gameState.createFire = function (position) {
    var fire = {};
    
    fire.isAlive = true;
    
    // Create sprite:
    fire.sprite = gameState.projectileSpritesGroup.create(position.x, position.y, 'ProjectileTileset');
    fire.sprite.anchor.setTo(0.5, 0.5);
    fire.sprite.smoothed = false;
    fire.sprite.scale.setTo(this.scaleFactor, this.scaleFactor);
    fire.sprite.animations.add('Explode', [16, 17, 18, 19, 20], 10);
    fire.sprite.play('Explode');
	fire.life = 10;
	
    // Visibility:
	if (gameState.getTile(gameState.getTileIndexFromPosition(fire.sprite.position)).explored) {
		fire.sprite.visible = true;
	} else {
		fire.sprite.visible = false;
	}
	
    // Update:
    fire.update = this.updateFire;
    
    this.projectileList.push(fire);
};

// UPDATE_FIRE:
// ************************************************************************************************
gameState.updateFire = function () {
	// Visibility:
	if (gameState.getTile(gameState.getTileIndexFromPosition(this.sprite.position)).explored) {
		this.sprite.visible = true;
	} else {
		this.sprite.visible = false;
	}
	
	this.life -= 1;
    if (this.life === 0 || this.sprite.frame === 4) {
		gameState.createSmoke(this.sprite.position, {x: 0, y: 0}, 0, 'Smoke');
        this.sprite.destroy();
        this.isAlive = false;
    }
};

// DESTROY_ALL_PROJECTILES
// ************************************************************************************************
gameState.destroyAllProjectiles = function () {
	var i;
	
	for (i = 0; i < this.projectileList.length; i += 1) {
		this.projectileList[i].sprite.destroy();
	}
	
	this.projectileList = [];
};