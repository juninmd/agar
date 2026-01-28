import { CONSTANTS } from './constants.js';
import { Utils } from './utils.js';
import { Player } from './player.js';
import { Food } from './food.js';
import { Bot } from './bot.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const uiLayer = document.getElementById('ui-layer');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const scoreDisplay = document.getElementById('score-display');
const finalScoreDisplay = document.getElementById('final-score');
const nameInput = document.getElementById('player-name');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

let gameRunning = false;
let animationId;
let player;
let foods = [];
let bots = [];

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

    gameRunning = true;
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
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
    const radius = Utils.randomRange(CONSTANTS.INITIAL_RADIUS * 0.8, CONSTANTS.INITIAL_RADIUS * 2.5); // Bots vary in size
    const color = Utils.randomColor(CONSTANTS.COLORS);
    bots.push(new Bot(x, y, radius, color));
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
        }
    }
}

function update() {
    if (player.markedForDeletion) {
        gameOver();
        return;
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
    ctx.translate(camX, camY);

    drawGrid();

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

function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    finalScoreDisplay.innerText = Math.floor(player.mass);
    gameOverScreen.classList.remove('hidden');
    uiLayer.style.pointerEvents = 'auto';
}

// Event Listeners
window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

startBtn.addEventListener('click', () => {
    initGame();
});

restartBtn.addEventListener('click', () => {
    initGame();
});

// Initial setup
resize();
mouseX = canvas.width / 2;
mouseY = canvas.height / 2;
