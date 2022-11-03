const HEALTH_INITIAL_VALUE = 100;
const ROUND_INITIAL_VALUE = 0;
const SPECIAL_ATTACK_COOLDOWN_VALUE = 3;
const HEAL_COOLDOWN_VALUE = 2;

const getRandomValue = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

Vue.createApp({
  data() {
    return {
      demonHealth: HEALTH_INITIAL_VALUE,
      playerHealth: HEALTH_INITIAL_VALUE,
      battleRound: ROUND_INITIAL_VALUE,
      specialAttackCooldown: 0,
      healCooldown: 0,
      winner: null,
      logEntries: [],
    };
  },
  computed: {
    demonHealthBarStyles() {
      return { width: this.demonHealth < 0 ? 0 : this.demonHealth + "%" };
    },
    playerHealthBarStyles() {
      return { width: this.playerHealth < 0 ? 0 : this.playerHealth + "%" };
    },
    specialAttackAvailable() {
      return this.specialAttackCooldown === 0;
    },
    healAvailable() {
      return this.healCooldown === 0;
    },
  },
  watch: {
    battleRound() {
      if (this.specialAttackCooldown > 0) {
        this.specialAttackCooldown--;
      }

      if (this.healCooldown > 0) {
        this.healCooldown--;
      }
    },
    demonHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        // A draw
        this.winner = "draw";
      } else if (value <= 0) {
        // Demon lost
        this.winner = "player";
      }
    },
    playerHealth(value) {
      if (value <= 0 && this.demonHealth <= 0) {
        // A draw
        this.winner = "draw";
      } else if (value <= 0) {
        // Player lost
        this.winner = "demon";
      }
    },
  },
  methods: {
    attackDemon() {
      const attackValue = getRandomValue(5, 10);

      this.demonHealth -= attackValue;
      this.addLogEntry("player", "attack", attackValue);
    },
    attackPlayer() {
      const attackValue = getRandomValue(8, 15);

      this.playerHealth -= attackValue;
      this.addLogEntry("demon", "attack", attackValue);
    },
    attack() {
      this.battleRound++;

      this.attackDemon();
      this.attackPlayer();
    },
    specialAttack() {
      this.battleRound++;
      this.specialAttackCooldown = SPECIAL_ATTACK_COOLDOWN_VALUE;

      const attackValue = getRandomValue(10, 25);

      this.demonHealth -= attackValue;
      this.addLogEntry("player", "attack", attackValue);

      this.attackPlayer(); // After an special attack, the demon also attacks back
    },
    heal() {
      this.battleRound++;
      this.healCooldown = HEAL_COOLDOWN_VALUE;

      const healValue = getRandomValue(8, 20);

      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }

      this.addLogEntry("player", "heal", healValue);

      this.attackPlayer(); // After healing ourselves, the demon also attacks back
    },
    surrender() {
      this.winner = "demon";
    },
    startGame() {
      this.demonHealth = HEALTH_INITIAL_VALUE;
      this.playerHealth = HEALTH_INITIAL_VALUE;
      this.battleRound = ROUND_INITIAL_VALUE;
      this.specialAttackCooldown = 0;
      this.healCooldown = 0;
      this.winner = null;
      this.logEntries = [];
    },
    addLogEntry(who, what, value) {
      this.logEntries = [
        { actionBy: who, actionType: what, actionValue: value },
        ...this.logEntries,
      ];
    },
  },
}).mount("#game");
