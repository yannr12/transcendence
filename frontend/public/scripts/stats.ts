(async function() {

    const oldContainer = document.getElementById('friendListContainer');
    if (oldContainer) {
        oldContainer.remove();
    }
    const username = localStorage.getItem('username');

    if (!username) {
        console.error('Username not found in localStorage.');
        return ;
    }

    try {
        const res = await fetch(`/account/get_1v1_stats?username=${encodeURIComponent(username)}`)
        const data = await res.json();
        if (data.success) {
            const statsContainer = document.getElementById('stats-container');
            if (statsContainer) {
                statsContainer.innerHTML = 
                    `<p class="text-lg text-[#112550]"><strong>1v1 Bot :</strong></p>
                    <p class="mt-2">Games Played : <span class="font-bold text-blue-700">${data.gamesCount}</span></p>
                    <p class="mt-2">Wins : <span class="font-bold text-green-700">${data.wins}</span></p><p>Losses : <span class="font-bold text-red-700">${data.losses}</span></p>`;
            }
        } else {
            console.log("Erreur backend :", data.message);
        }
        const res2 = await fetch(`/account/get_survival_stats?username=${encodeURIComponent(username)}`)
        const data2 = await res2.json();
        if (data2.success) {
            const statsContainer2 = document.getElementById('stats-container2');
            if (statsContainer2) {
                statsContainer2.innerHTML =
                    `<p class="text-lg text-[#112550]"><strong>Survival Mode :</strong></p>
                    <p class="mt-2">Games Played : <span class="font-bold text-blue-700">${data2.gamesCount}</span></p>
                    <p class="mt-2">Record : <span class="font-bold text-blue-700">${data2.record}</span></p>`;
            }
        } else {
            console.log("Erreur backend :", data2.message);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des stats 1v1 :', error);
    }
    try {
        const res3 = await fetch(`/account/get_games_data?username=${encodeURIComponent(username)}`);
        const data3 = await res3.json();
        if (data3.success) {
            const tableContainer = document.getElementById('history-table');
            if (tableContainer) {
                if (data3.games.length === 0) {
                    tableContainer.innerHTML = `<p class="text-center text-[#112550]">No games played yet.</p>`;
                    return;
                }
                let tableHTML = `
                    <div class="overflow-x-auto">
                    <table class="min-w-full bg-white rounded-x1 shadow">
                        <thead class="bg-[#1d3349] text-white">
                            <tr>
                                <th class="px-4 py-2">Mode</th>
                                <th class="px-4 py-2">Score</th>
                                <th class="px-4 py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>`;

            for (const game of data3.games) {
                let scoreDisplay = '';
                if (game.mode === '1v1') {
                    scoreDisplay = `${game.leftscore} - ${game.rightscore}`;
                } else if (game.mode === 'survival') {
                    scoreDisplay = `${game.leftscore}`;
                }
                const formattedDate = new Date(game.date).toLocaleString();
                tableHTML += `
                    <tr class="text-center border-b">
                        <td class="px-4 py-2">${game.mode}</td>
                        <td class="px-4 py-2">${scoreDisplay}</td>
                        <td class="px-4 py-2">${formattedDate}</td>
                    </tr>`;
            }
            tableHTML += `
                        </tbody>
                    </table>
                    </div>`;
            tableContainer.innerHTML = tableHTML;
          }
        } else {
            console.log("Erreur backend :", data3.message);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des stats de jeu :', error);
    }
})();