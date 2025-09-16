function goTournament() {
    call_page('tournoi');
}

(async function() {
    const isTournament = localStorage.getItem("tournoi") === "true";
    if (isTournament) {
        let player1Name = localStorage.getItem("player1Name");
        let player2Name = localStorage.getItem("player2Name");

        function escapeHTML(str: string): string {
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }
        player1Name = player1Name && /^[\w]+$/.test(player1Name) ? escapeHTML(player1Name) : "Player 1";
        player2Name = player2Name && /^[\w]+$/.test(player2Name) ? escapeHTML(player2Name) : "Player 2";

        const player1Display = document.getElementById("player1Display");
        const player2Display = document.getElementById("player2Display");

        if (player1Name && player2Name && player1Display && player2Display) {
            player1Display.textContent = player1Name;
            player2Display.textContent = player2Name;
            player1Display.classList.remove("hidden");
            player2Display.classList.remove("hidden");
        }
    const tournamentBtn = document.getElementById("tournamentBtn");
    const retryBtn = document.getElementById("retry");
    const go_backBtn = document.getElementById("go_back");
    const go_back_tournamentBtn = document.querySelector("#go_back_tournament a");
    if (isTournament && tournamentBtn && retryBtn && go_back_tournamentBtn) {
        tournamentBtn.classList.remove("hidden");
        retryBtn.classList.add("hidden");
        // go_backBtn.classList.add("hidden");
        go_back_tournamentBtn.classList.remove("hidden");
    }
	}
})();
