class Player {
    constructor(name, elo, placement) {
        this.name = name;
        this.elo = elo;
        this.placement = placement;
        this.expectedWinProbability = 0.0;
        this.actualPlacementScore = 0.0;
    }
}

// List to hold players
let players = [];

// Constants for ELO calculation
const K_BASE = 20;
const K_INCREMENT = 3;

// Add a new player input form dynamically
function addPlayer() {
    const playersForm = document.getElementById("players-form");

    const playerDiv = document.createElement("div");
    playerDiv.classList.add("player");

    playerDiv.innerHTML = `
        <input type="text" placeholder="Player Name" class="player-name" required>
        <input type="number" placeholder="Initial ELO" class="player-elo" required>
        <input type="number" placeholder="Placement" class="player-placement" required>
    `;

    playersForm.appendChild(playerDiv);
}

// Calculate ELO based on user-defined players and placements
function calculateElo() {
    players = []; // Reset players array
    const playerInputs = document.querySelectorAll(".player");

    // Fetch player data from input fields
    playerInputs.forEach(inputDiv => {
        const name = inputDiv.querySelector(".player-name").value;
        const elo = parseFloat(inputDiv.querySelector(".player-elo").value);
        const placement = parseFloat(inputDiv.querySelector(".player-placement").value);

        if (name && !isNaN(elo) && !isNaN(placement)) {
            players.push(new Player(name, elo, placement));
        }
    });

    if (players.length < 2) {
        alert("Please add at least two players.");
        return;
    }

    // Assign placement scores based on user-defined placements
    const maxPlacement = Math.max(...players.map(player => player.placement));
    players.forEach(player => {
        player.actualPlacementScore = (maxPlacement - player.placement + 1) / maxPlacement;
    });

    // Calculate ELO adjustments
    const kFactor = K_BASE + (players.length - 2) * K_INCREMENT;

    // Calculate expected win probability for each player
    players.forEach(player => {
        player.expectedWinProbability = calculateExpectedWinProbability(player, players);
    });

    // Adjust each player's ELO
    players.forEach(player => {
        const eloChange = kFactor * (player.actualPlacementScore - player.expectedWinProbability);
        player.elo += eloChange;
    });

    displayResults();
}

// Calculate expected win probability for a player
function calculateExpectedWinProbability(player, players) {
    let totalExpectedProbability = 0.0;
    players.forEach(opponent => {
        if (opponent !== player) {
            totalExpectedProbability += 1 / (1 + Math.pow(10, (opponent.elo - player.elo) / 400));
        }
    });
    return totalExpectedProbability / (players.length - 1);
}

// Display updated ELO ratings
function displayResults() {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "<h2>Updated ELO Ratings:</h2>";

    players.forEach(player => {
        const resultDiv = document.createElement("div");
        resultDiv.innerHTML = `${player.name} New ELO: ${player.elo.toFixed(2)}`;
        resultsContainer.appendChild(resultDiv);
    });
}

