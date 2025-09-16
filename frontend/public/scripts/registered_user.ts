// Update username and avatar display
async function updateUserDisplay() {
  const username = localStorage.getItem('username');
  const avatar = localStorage.getItem('avatar');
  
  if (username) {
    const usernameDisplay = document.getElementById('username-display');
    const userInitial = document.getElementById('user-initial') as HTMLImageElement;
	const userAvatar = document.getElementById('user-avatar') as HTMLImageElement;
	const responseavatar = await fetch(`/account/avatar/${encodeURIComponent(username)}`, {
    method: 'GET'
  	});
	if (!responseavatar.ok) {
		throw new Error('Avatar not found');
	}
	const blob = await responseavatar.blob();
	const imageUrl = URL.createObjectURL(blob);
	userAvatar.onload = () => {
        userAvatar.classList.remove("hidden");
        userInitial.classList.add("hidden");
    };
	userAvatar.src = imageUrl;
    
    if (usernameDisplay) {
      usernameDisplay.textContent = username;
    }
    
    if (userInitial && userAvatar) {
      if (avatar) {
        userAvatar.src = avatar;
        userAvatar.classList.remove('hidden');
        userInitial.classList.add('hidden');
      } else {
        userInitial.textContent = username.charAt(0).toUpperCase();
        userAvatar.classList.add('hidden');
        userInitial.classList.remove('hidden');
      }
    }
  }
}

updateUserDisplay();

async function getFriendsList(username: string): Promise<string[]> {
	try {
		const response = await fetch(`/account/friends/get?username=${encodeURIComponent(username)}`);
		const data = await response.json();
		if (data.success && Array.isArray(data.friends)) {
			return data.friends;
		}
	} catch (e) {
		console.error("Could not fetch friends list:", e);
	}
	return [];
}

async function redirSPA() {

	localStorage.removeItem("isTournamentActive");
    localStorage.removeItem("tournamentState");
    localStorage.removeItem("tournoi");
	const usernameRegistered = localStorage.getItem('username');
	const token = localStorage.getItem('token');
	const welcomeMsg = document.getElementById('welcome-msg');

    const survivalRecordsTableBody = document.querySelector('#survival-records-table tbody') as HTMLTableSectionElement;
    const noSurvivalRecordsMessage = document.getElementById('no-survival-records') as HTMLElement;

	
	
	if (!usernameRegistered || !token) {
		call_page('index');
		return;
	}
	
	if (welcomeMsg) {
		welcomeMsg.textContent = `Welcome to ft_transcendance, ${usernameRegistered}!`;
	}
	
	// const profileBtn = document.getElementById('profile-btn');
	// 	if (profileBtn) {
		//   		profileBtn.addEventListener('click', () => {
  	//     		profileBtn.setAttribute('href', `profile`);
  	//     	call_page('profile');
  	//   	});
  	// }

  	const playPongBtn = document.getElementById('play-pong-btn');
	  if (playPongBtn) {
  	  		playPongBtn.addEventListener('click', () => {
				call_page('pong');	
  	  	});
	}
	
	const logoutBtn = document.getElementById('logout-btn');
	if (logoutBtn) {
		logoutBtn.addEventListener('click', () => {
			localStorage.removeItem('username');
			localStorage.removeItem('token');
			localStorage.removeItem('gameMode');
			goBack('index');
		});
	}
	try {
		const response = await fetch('/account/get_all_games');
		const data = await response.json();

		const survivalContainer = document.getElementById('survival-records-container') as HTMLDivElement;
		const recordsListContainer = survivalContainer.querySelector('.space-y-2') as HTMLDivElement;
		const noSurvivalRecordsMessage = document.getElementById('no-survival-records') as HTMLParagraphElement;

		// Clear previous records if reloaded
		recordsListContainer.innerHTML = "";

		// Fetch friends list before rendering
		const friendsList = await getFriendsList(usernameRegistered);

		if (data.success && data.games && data.games.length > 0) {
			const survivalGames = data.games.filter((game: any) => game.mode === 'survival');
			if (survivalGames.length > 0) {
				const sortedSurvivalGames = survivalGames.sort((a: any, b: any) => b.leftscore - a.leftscore);
				const top10Records = sortedSurvivalGames.slice(0, 10);

				top10Records.forEach((game: any) => {
					const recordDiv = document.createElement('div');
					recordDiv.className = "bg-gray-300 rounded-full px-4 py-1 text-gray-700 text-sm flex items-center";
					recordDiv.style.fontFamily = "'Victor Mono', monospace";
					recordDiv.style.fontWeight = "300";

					const gameDate = new Date(game.date);
					const formattedDate = gameDate.toLocaleDateString('fr-FR', {
						year: 'numeric',
						month: 'numeric',
						day: 'numeric'
					});

					const span = document.createElement('span');
					span.textContent = `👤 ${game.username} | 🏆 ${game.leftscore} | 📅 ${formattedDate}`;

					// Make bold if user is in friends list
					if (friendsList.includes(game.username)) {
						span.style.fontWeight = "bold";
					}

					recordDiv.appendChild(span);
					recordsListContainer.appendChild(recordDiv);
				});
				if (noSurvivalRecordsMessage) noSurvivalRecordsMessage.classList.add('hidden');
			} else {
				if (noSurvivalRecordsMessage) noSurvivalRecordsMessage.classList.remove('hidden');
			}
		} else {
			console.log("Aucune donnée de jeu trouvée.");
			if (noSurvivalRecordsMessage) noSurvivalRecordsMessage.classList.remove('hidden');
		}
	} catch (error) {
		console.error("Erreur lors de la récupération des données de jeu:", error);
		const noSurvivalRecordsMessage = document.getElementById('no-survival-records') as HTMLParagraphElement;
		if (noSurvivalRecordsMessage) noSurvivalRecordsMessage.classList.remove('hidden');
	}

}

redirSPA();

document.getElementById("survival")?.addEventListener("click", () => {
	gameMode = "survival";
	localStorage.setItem("gameMode", gameMode);
	goBack("survival_mode");
})

document.getElementById("1vbot")?.addEventListener("click", () => {
	gameMode = "1v1";
	localStorage.setItem("gameMode", gameMode);
	isBot = [false, true, false, false];
	localStorage.setItem("isBot", JSON.stringify(isBot));
	goBack("pong_1vbot");
})

gameMode = "decor";
rules = "normal";
localStorage.setItem("gameMode", gameMode);
localStorage.setItem("rules", rules);

function toggleRanking() {
  const ranking = document.getElementById('survival-records-container');
  const btn = document.getElementById('toggle-ranking-btn');
  if (!ranking || !btn) return;
  ranking.classList.toggle('hidden');
  if (ranking.classList.contains('hidden')) {
    btn.textContent = 'show ranking';
  } else {
    btn.textContent = 'hide ranking';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const ranking = document.getElementById('survival-records-container');
  const btn = document.getElementById('toggle-ranking-btn');
  if (!ranking || !btn) return;
  if (ranking.classList.contains('hidden')) {
    btn.textContent = 'show ranking';
  } else {
    btn.textContent = 'hide ranking';
  }
});