/**
 * Handles the updates for various sub-systems of the main game loop,
 * such as singularity, purge, bosses, raids, and the weaver.
 */
export class GameSystems {
    /**
     * Initializes the GameSystems manager.
     * @param {Object} game - The main game instance.
     */
    constructor(game) {
        this.game = game;
    }

    /**
     * Updates all active subsystems sequentially.
     */
    update() {
        if (this.game.player.inSanctuary) {
            this.game.systemIntegrity = Math.min(100, this.game.systemIntegrity + 0.05);
        } else {
            this.game.systemIntegrity = Math.max(0, this.game.systemIntegrity - 0.03);
        }

        this.game.particleSystem.update();
        this.updateFirewall();

        this.game.singularitySystem.update(
            this.game.player,
            [...this.game.bots, ...this.game.foods],
            this.game.bots
        );

        if (this.game.purgeSystem.canStart(this.game.player)) {
            this.game.purgeSystem.startPurge(this.game);
        }
        this.game.purgeSystem.update(this.game);
        this.game.bossSystem.update(this.game.player);
        this.game.raidSystem.update(this.game);
        this.game.weaverSystem.update(this.game);
        this.game.riftSystem.update(this.game);
        this.game.abyssSystem.update([...this.game.bots, this.game.player]);
        this.game.singularityActive = this.game.singularitySystem.active;
    }

    /**
     * Updates the Great Firewall mechanics and timer.
     */
    updateFirewall() {
        this.game.firewallTimer++;
        if (!this.game.firewall.active && this.game.firewallTimer > 1800) {
            this.game.firewall.start();
            this.game.firewallTimer = 0;
            this.game.ui.showWarning(true);
        }
        if (this.game.firewall.active) {
            this.game.firewall.update();
        }
    }
}
