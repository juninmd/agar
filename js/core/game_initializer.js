import { Player } from '../player.js';
import { Spawner } from '../spawner.js';
import { Firewall } from '../firewall.js';
import { CONSTANTS } from '../constants.js';

const SPAWN_SHIELD_FRAMES = 180; // 3 seconds at 60 FPS

export class GameInitializer {
    static start(game, name, protocol, mutations = [], skin = 'DEFAULT', roomId = null) {
        game.mutationSystem.applyModifiers(mutations, CONSTANTS);

        if (roomId) {
            game.network.connect(roomId);
        }
        game.player = new Player(CONSTANTS.WORLD_WIDTH / 2, CONSTANTS.WORLD_HEIGHT / 2, protocol, name, skin);
        game.player.invulnerable = true; // Spawn protection
        game.player.shieldEffectTimer = SPAWN_SHIELD_FRAMES;
        game.foods = Array(CONSTANTS.FOOD_COUNT).fill().map(() => Spawner.spawnFood());
        game.bots = Array(CONSTANTS.BOT_COUNT).fill().map(() => Spawner.spawnBot(game.player));
        game.ghostSystem.spawnGhosts(game);
        game.firewall = new Firewall();
        game.systemIntegrity = 100;
        game.singularitySystem.active = false;
        game.purgeSystem.isActive = false;
        game.purgeSystem.timer = 0;
        game.bossSystem.activeBoss = null;
        game.bossSystem.bossSpawned = false;
        game.raidSystem.isActive = false;
        game.raidSystem.activeTitan = null;
        game.weaverSystem.isActive = false;
        game.weaverSystem.hasSpawned = false;
        game.weaverSystem.activeWeaver = null;
        game.riftSystem.reset();
        game.gameRunning = true;
        game.ui.setGameActive(true);
    }
}
