tournamentRound = 1;
matchIndex = 0;
currentPlayers = [];
nextRound = [];

(async function() {
    const startButton = document.getElementById('startTournamentBtn') as HTMLButtonElement;
    const playersInput = document.getElementById('playersCount') as HTMLInputElement;
    const playersNamesContainer = document.getElementById('player-names-container') as HTMLDivElement;
    const statusDiv = document.getElementById('tournament-status') as HTMLDivElement;
    const bracketDiv = document.getElementById('tournament-bracket') as HTMLDivElement;
    let startMatch = document.getElementById('startMatchBtn') as HTMLButtonElement;

    const isConnected = !!localStorage.getItem('token');
    const username = localStorage.getItem('username');


    if (isConnected) {
        playersInput.placeholder = "Nombre de joueurs supplémentaires";
    } else {
        playersInput.placeholder = "Nombre de joueurs";
    }

    playersInput.addEventListener('input', () => {
        playersNamesContainer.innerHTML = "";
        const extraPlayers = parseInt(playersInput.value, 10);
        if (!isNaN(extraPlayers) && extraPlayers > 0 && extraPlayers <= 15) {
            for (let i = 1; i <= extraPlayers; i++) {
                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = `Player's nickname ${i}`;
                input.id = `player-name-${i}`;
                input.className = "w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-500";
                playersNamesContainer.appendChild(input);
            }
        }
    });

    const isTournamentActive = localStorage.getItem("tournoi") === "true";
    const savedState = localStorage.getItem("tournamentState");
    if (isTournamentActive && savedState) {
        const state = JSON.parse(savedState);
        tournamentRound = state.tournamentRound;
        matchIndex = state.matchIndex;
        currentPlayers = state.currentPlayers;
        nextRound = state.nextRound;

        statusDiv.innerHTML = `<p class="text-blue-700 font-semibold">Tournament in progress ! Round ${tournamentRound}</p><p>Next Game : ${currentPlayers[matchIndex]} vs ${currentPlayers[matchIndex + 1]}</p>`;
        startMatch.classList.remove("hidden");
        startMatch.style.display = "inline-block";
        handlePreviousMatchResult(bracketDiv);
    } else {
        startButton.addEventListener('click', () => {
            let extraPlayers = parseInt(playersInput.value, 10);
            if (isNaN(extraPlayers)) extraPlayers = 0;
            if (extraPlayers < 0) {
                statusDiv.textContent = "Error: negative value is forbidden."
                return; }
            let totalPlayers = isConnected ? 1 + extraPlayers : extraPlayers;
            if (!isConnected && totalPlayers < 3) {
                statusDiv.textContent = "Error: 3 players minimum.";
                return;
            }
            if (totalPlayers > 16) {
                statusDiv.textContent = "Error: Maximum 16 players..";
                return;
            }

            localStorage.setItem("tournoi", "true");
            const tournamentSizes = [4, 8, 16];
            let targetSize = tournamentSizes.find(size => size >= totalPlayers) ?? 16;
            const botsNeeded = targetSize - totalPlayers;

            const players: string[] = [];
            if (isConnected && username) {
                const escapedUsername = escapeHTML(username);
                if (!/^[\w]+$/.test(escapedUsername)) {
                    statusDiv.textContent = "Error: Invalid username. Only letters, numbers, and underscores are allowed.";
                    return;
                }
                players.push(escapedUsername);
            }

            for (let i = 1; i <= extraPlayers; i++) {
                const input = document.getElementById(`player-name-${i}`) as HTMLInputElement;
                if (!input || !input.value.trim()) {
                    statusDiv.textContent = `Error: Player nickname ${i} is empty.`;
                    return;
                }
                // Escape and validate nickname
                const nickname = escapeHTML(input.value.trim());
                if (!/^[\w]+$/.test(nickname)) {
                    statusDiv.textContent = `Error: Invalid nickname for player ${i}. Only letters, numbers, and underscores are allowed.`;
                    return;
                }
                players.push(nickname);
            }

            for (let i = 1; i <= botsNeeded; i++) {
                players.push(`Bot${i}`);
            }

            currentPlayers = shuffle_tab(players);

            if (checkDuplicates(currentPlayers)) {
                statusDiv.textContent = "Error: Duplicate player names detected.";
                return;
            }

            statusDiv.innerHTML = `<p class="text-green-700 font-semibold">Tournament lauched with ${targetSize} players.</p><p>Players : ${currentPlayers.join(', ')}</p><p>Next Game : ${currentPlayers[matchIndex]} vs ${currentPlayers[matchIndex + 1]}</p>`;

            startMatch.classList.remove("hidden");
            startMatch.style.display = "inline-block";
            saveTournamentState();
        });
    }

    startMatch.addEventListener('click', () => {
        if (localStorage.getItem("tournoi") === "true") {
            const player1 = currentPlayers[matchIndex];
            const player2 = currentPlayers[matchIndex + 1];
            const isBot1 = player1.startsWith("Bot");
            const isBot2 = player2.startsWith("Bot");

            if (isBot1 && isBot2) {
                const winner = Math.random() < 0.5 ? player1 : player2;
                nextRound.push(winner);

                bracketDiv.innerHTML += `<p>${player1} vs ${player2} → <span class="text-green-600 font-bold">${winner} win (simulated)</span></p>`;
                matchIndex += 2;
                manageNextMatch(bracketDiv, statusDiv);
            } else {
                localStorage.setItem('player1Name', player1);
                localStorage.setItem('player2Name', player2);
                const isBotArray = [isBot1, isBot2, false, false];
                localStorage.setItem("isBot", JSON.stringify(isBotArray));
                localStorage.setItem('tournoi', 'true');
                localStorage.setItem('gameMode', '1v1');
                call_page("pvp");
            }
        }
    });
})();

function manageNextMatch(bracketDiv: HTMLDivElement, statusDiv: HTMLDivElement) {
    if (matchIndex >= currentPlayers.length) {
        if (nextRound.length === 1) {
            bracketDiv.innerHTML += `<h3 class="text-xl font-bold mt-6 text-green-700">🏆 Winner: ${nextRound[0]}</h3>`;
            // localStorage.clear();
            localStorage.setItem("tournoi", "false");
            statusDiv.innerHTML = `<p class="text-green-700 font-semibold">Tournament finish. Winner: ${nextRound[0]}</p>`;
            return;
        } else {
            currentPlayers = nextRound;
            nextRound = [];
            matchIndex = 0;
            tournamentRound++;
            bracketDiv.innerHTML += `<h3 class="text-lg font-semibold mt-4">Round ${tournamentRound}</h3>`;
        }
    }
    statusDiv.innerHTML = `<p class="text-blue-700 font-semibold">Tournament in progress ! Round ${tournamentRound}</p><p>Next Game : ${currentPlayers[matchIndex]} vs ${currentPlayers[matchIndex + 1]}</p>`;
    saveTournamentState();
}

function saveTournamentState() {
    const state = {
        tournamentRound: tournamentRound,
        matchIndex: matchIndex,
        currentPlayers: currentPlayers,
        nextRound: nextRound
    };
    localStorage.setItem('tournamentState', JSON.stringify(state));
}

function handlePreviousMatchResult(bracketDiv: HTMLDivElement) {
    const winnerFromGame = localStorage.getItem("winner");
    localStorage.removeItem("winner");
    if (winnerFromGame !== null && winnerFromGame !== undefined) {
        const player1 = currentPlayers[matchIndex];
        const player2 = currentPlayers[matchIndex + 1];
        let actualWinner = (winnerFromGame === 'right') ? player2 : player1;
        nextRound.push(actualWinner);
        bracketDiv.innerHTML += `<p>${player1} vs ${player2} → <span class="text-green-600 font-bold">${actualWinner} gagne</span></p>`;
        matchIndex += 2;
        manageNextMatch(bracketDiv, document.getElementById('tournament-status') as HTMLDivElement);
    }
}

function shuffle_tab(tableau: string[]): string[] {
    for (let i = tableau.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [tableau[i], tableau[j]] = [tableau[j], tableau[i]];
    }
    return tableau;
}

function checkDuplicates(players: string[]): boolean {
    const seen = new Set<string>();
    for (const player of players) {
        if (seen.has(player)) {
            return true;
        }
        seen.add(player);
    }
    return false;
}

document.getElementById("leftTournament")?.addEventListener("click", () => {
    localStorage.setItem("tournoi", "false");
    call_page(localStorage.getItem("token") ? "registered_user" : "guest");
})