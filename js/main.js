import { CONSTANTS } from './constants.js';
import { Utils } from './utils.js';
import { Player } from './player.js';
import { Food } from './food.js';
import { Bot } from './bot.js';
import { Firewall } from './firewall.js';
import { ParticleSystem } from './particles.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const uiLayer = document.getElementById('ui-layer');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const winScreen = document.getElementById('win-screen');
const scoreDisplay = document.getElementById('score-display');
const finalScoreDisplay = document.getElementById('final-score');
const nameInput = document.getElementById('player-name');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const winBtn = document.getElementById('win-btn');
const warningMessage = document.getElementById('warning-message');
const integrityBar = document.getElementById('integrity-bar');
const mobileDashBtn = document.getElementById('mobile-dash-btn');

let gameRunning = false;
let animationId;
let player;
let systemIntegrity = 100;
const MAX_INTEGRITY = 100;
const INTEGRITY_DECAY = 0.03; // per frame
const WIN_MASS = 5000;
let foods = [];
let bots = [];
let particleSystem;
let firewall;
let firewallTimer = 0;
const FIREWALL_INTERVAL = 1800; // ~30 seconds at 60fps

// Mouse state
let mouseX = 0;
let mouseY = 0;

// Camera
let camX = 0;
let camY = 0;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function initGame() {
    const name = nameInput.value || "Unit 734";
    player = new Player(
        CONSTANTS.WORLD_WIDTH / 2,
        CONSTANTS.WORLD_HEIGHT / 2,
        CONSTANTS.INITIAL_RADIUS,
        CONSTANTS.COLORS[0],
        name
    );

    foods = [];
    for (let i = 0; i < CONSTANTS.FOOD_COUNT; i++) {
        spawnFood();
    }

    bots = [];
    for (let i = 0; i < CONSTANTS.BOT_COUNT; i++) {
        spawnBot();
    }

    firewall = new Firewall();
    firewallTimer = 0;
    systemIntegrity = MAX_INTEGRITY;
    particleSystem = new ParticleSystem();

    // Expose for auditing
    window.player = player;
    window.bots = bots;
    window.foods = foods;
    window.firewall = firewall;
    window.particleSystem = particleSystem;

    gameRunning = true;
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    winScreen.classList.add('hidden');
    warningMessage.classList.add('hidden');
    mobileDashBtn.classList.add('active-game');
    animate();
}

function spawnFood() {
    const x = Utils.randomRange(0, CONSTANTS.WORLD_WIDTH);
    const y = Utils.randomRange(0, CONSTANTS.WORLD_HEIGHT);
    const radius = Utils.randomRange(CONSTANTS.MIN_FOOD_RADIUS, CONSTANTS.MAX_FOOD_RADIUS);
    const color = Utils.randomColor(CONSTANTS.COLORS);
    foods.push(new Food(x, y, radius, color));
}

function spawnBot() {
    const x = Utils.randomRange(0, CONSTANTS.WORLD_WIDTH);
    const y = Utils.randomRange(0, CONSTANTS.WORLD_HEIGHT);
    // User Feedback: All must start at the same size
    const radius = CONSTANTS.INITIAL_RADIUS;
    const color = Utils.randomColor(CONSTANTS.COLORS);

    // Determine type
    const rand = Math.random();
    let type = "NORMAL";
    if (rand < 0.20) type = "SEEKER";    // 20%
    else if (rand < 0.35) type = "GUARDIAN"; // 15%
    else if (rand < 0.50) type = "GLITCH";   // 15%
    // Remaining 50% is NORMAL

    bots.push(new Bot(x, y, radius, color, type));
}

function drawGrid() {
    ctx.save();
    ctx.strokeStyle = '#00f3ff';
    ctx.globalAlpha = 0.1;
    ctx.lineWidth = 1;

    const gridSize = CONSTANTS.GRID_SIZE;

    const startX = Math.floor(-camX / gridSize) * gridSize;
    const endX = startX + canvas.width + gridSize;
    const startY = Math.floor(-camY / gridSize) * gridSize;
    const endY = startY + canvas.height + gridSize;

    ctx.beginPath();
    for (let x = startX; x < endX; x += gridSize) {
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
    }
    for (let y = startY; y < endY; y += gridSize) {
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
    }
    ctx.stroke();

    // Draw World Borders
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 5;
    ctx.globalAlpha = 0.5;
    ctx.strokeRect(0, 0, CONSTANTS.WORLD_WIDTH, CONSTANTS.WORLD_HEIGHT);

    ctx.restore();
}

function checkEntityCollision(e1, e2) {
    const dist = Utils.getDistance(e1.x, e1.y, e2.x, e2.y);
    const minOverlap = e1.radius + e2.radius;

    // Only eat if centers are close enough (usually somewhat inside)
    // Agario style: center of smaller must be inside larger?
    // Or just simple touch? Simple touch is hard to play.
    // Let's say dist < largerRadius - smallerRadius * 0.5

    if (dist < minOverlap) {
        // Determine eater
        let predator, prey;
        if (e1.mass > e2.mass * 1.1) {
            predator = e1;
            prey = e2;
        } else if (e2.mass > e1.mass * 1.1) {
            predator = e2;
            prey = e1;
        } else {
            return; // No one eats
        }

        // Check if close enough to consume
        // The predator must cover the prey center roughly
        if (dist < predator.radius - prey.radius * 0.2) {
            predator.grow(prey.mass);
            prey.markedForDeletion = true;

            // Particle effect? (TODO for polish)
            particleSystem.emit(prey.x, prey.y, prey.color, 30, 4, 4, 40);
        }
    }
}

function update() {
    if (player.markedForDeletion) {
        gameOver("DATA PURGED");
        return;
    }

    // System Integrity Decay
    systemIntegrity -= INTEGRITY_DECAY;
    if (systemIntegrity <= 0) {
        systemIntegrity = 0;
        // No Game Over, just visual glitching (handled in draw)
    }

    particleSystem.update();

    // Win Condition
    if (player.mass >= WIN_MASS) {
        gameWin();
        return;
    }

    // Update UI
    const integrityPercent = Math.max(0, (systemIntegrity / MAX_INTEGRITY) * 100);
    integrityBar.style.width = `${integrityPercent}%`;

    // Firewall Logic
    if (!firewall.active) {
        firewallTimer++;
        if (firewallTimer > FIREWALL_INTERVAL) {
            firewall.start();
            firewallTimer = 0;
            warningMessage.classList.remove('hidden');
            setTimeout(() => warningMessage.classList.add('hidden'), 5000);
        }
    } else {
        firewall.update();

        // Check collisions
        const handleFirewallHit = (entity) => {
            if (entity.firewallHitTimer > 0) {
                entity.firewallHitTimer--;
                return;
            }

            if (firewall.checkCollision(entity)) {
                // Reduce mass by 30%
                const lostMass = entity.mass * 0.30;
                entity.mass -= lostMass;
                entity.radius = Utils.getRadiusFromMass(entity.mass);

                // Visual feedback
                particleSystem.emit(entity.x, entity.y, entity.color, 10, 3, 3, 30);

                // Push forward to give a chance to escape
                entity.x = firewall.x + entity.radius + 50;

                // Invulnerability for a short time
                entity.firewallHitTimer = 60; // 1 second at 60fps

                // If too small, die? Or just keep shrinking?
                // Minimal mass check
                if (entity.mass < 100) { // Arbitrary death threshold
                     entity.markedForDeletion = true;
                     particleSystem.emit(entity.x, entity.y, entity.color, 20, 4, 4, 40);
                }
            }
        };

        handleFirewallHit(player);
        bots.forEach(bot => handleFirewallHit(bot));

        // Destroy food behind firewall
        for (let i = foods.length - 1; i >= 0; i--) {
            if (firewall.checkCollision(foods[i])) {
                foods.splice(i, 1);
            }
        }
    }

    // Camera
    // Lerp camera for smoothness? No, direct is tighter for this game.
    camX = canvas.width / 2 - player.x;
    camY = canvas.height / 2 - player.y;

    // 1. Update Player
    const targetX = player.x + (mouseX - canvas.width / 2);
    const targetY = player.y + (mouseY - canvas.height / 2);
    player.setTarget(targetX, targetY);
    player.update(CONSTANTS.WORLD_WIDTH, CONSTANTS.WORLD_HEIGHT);

    // 2. Update Bots
    const allEntities = [player, ...bots];
    bots.forEach(bot => {
        bot.update(CONSTANTS.WORLD_WIDTH, CONSTANTS.WORLD_HEIGHT, allEntities, foods);
    });

    // 3. Collision: Entities vs Food
    const activeEntities = [player, ...bots];
    activeEntities.forEach(entity => {
        for (let i = foods.length - 1; i >= 0; i--) {
            const food = foods[i];
            const dist = Utils.getDistance(entity.x, entity.y, food.x, food.y);

            if (dist < entity.radius + food.radius) {
                // Calculation: grow by food mass
                const areaFood = Math.PI * food.radius * food.radius;
                entity.grow(areaFood);

                // Visual Effect
                particleSystem.emit(food.x, food.y, food.color, 5, 1, 2, 20);

                foods.splice(i, 1);
                spawnFood();
            }
        }
    });

    // 4. Collision: Entity vs Entity
    for (let i = 0; i < activeEntities.length; i++) {
        for (let j = i + 1; j < activeEntities.length; j++) {
            checkEntityCollision(activeEntities[i], activeEntities[j]);
        }
    }

    // 5. Cleanup Dead Entities
    for (let i = bots.length - 1; i >= 0; i--) {
        if (bots[i].markedForDeletion) {
            bots.splice(i, 1);
            spawnBot(); // Respawn to keep world alive
        }
    }

    // Update Score UI
    const kb = Math.floor(player.mass);
    scoreDisplay.innerText = `${kb} KB`;
}

function draw() {
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    // Camera Jitter on Low Integrity
    let jitterX = 0;
    let jitterY = 0;
    if (systemIntegrity < 30) {
        const intensity = (30 - systemIntegrity) * 0.5;
        jitterX = (Math.random() - 0.5) * intensity;
        jitterY = (Math.random() - 0.5) * intensity;
    }

    ctx.translate(camX + jitterX, camY + jitterY);

    drawGrid();

    // Draw Firewall (Background layer)
    if (firewall.active) {
        firewall.draw(ctx);
    }

    particleSystem.draw(ctx);

    // Draw Foods
    foods.forEach(food => food.draw(ctx));

    // Draw Entities (Sort by size so small are on top? Or large on top?)
    // Usually smaller on top so they aren't hidden under big ones until eaten
    const drawList = [player, ...bots].sort((a, b) => a.mass - b.mass);
    drawList.forEach(e => {
        if (!e.markedForDeletion) e.draw(ctx);
    });

    ctx.restore();
}

function animate() {
    if (!gameRunning) return;
    update();
    draw();
    animationId = requestAnimationFrame(animate);
}

function gameOver(reason) {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    finalScoreDisplay.innerText = Math.floor(player.mass);
    const reasonEl = gameOverScreen.querySelector('.error-text');
    if (reasonEl) reasonEl.innerText = reason || "FATAL ERROR";
    gameOverScreen.classList.remove('hidden');
    uiLayer.style.pointerEvents = 'auto';
}

function gameWin() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    winScreen.classList.remove('hidden');
    uiLayer.style.pointerEvents = 'auto';
}

// Event Listeners
window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Mobile Touch Controls
window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
    }
}, {passive: false});

window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        e.preventDefault(); // Prevent scrolling
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
    }
}, {passive: false});

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameRunning && player) {
        if (player.dash()) {
            particleSystem.emit(player.x, player.y, player.color, 20, 2, 3, 30);
        }
    }
});

startBtn.addEventListener('click', () => {
    initGame();
});

restartBtn.addEventListener('click', () => {
    initGame();
});

if (winBtn) {
    winBtn.addEventListener('click', () => {
        initGame();
    });
}

// Mobile Dash Button
mobileDashBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent ghost click
    if (gameRunning && player) {
        if (player.dash()) {
            particleSystem.emit(player.x, player.y, player.color, 20, 2, 3, 30);
        }
    }
});

// Initial setup
resize();
mouseX = canvas.width / 2;
mouseY = canvas.height / 2;
