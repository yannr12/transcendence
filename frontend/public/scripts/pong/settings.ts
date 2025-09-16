if (localStorage.getItem("token"))
	goBack("registered_user");

topPlayer = document.getElementById("top-player") as HTMLElement;
bottomPlayer = document.getElementById("bottom-player") as HTMLElement;
input3 = document.getElementById("input-3") as HTMLElement;
input4 = document.getElementById("input-4") as HTMLElement;
confirmation = document.getElementById("confirm") as HTMLElement;

gameMode = "decor";
chosenMode = "1v1";
rules = "normal";
localStorage.setItem("rules", rules);
localStorage.setItem("gameMode", gameMode);
isBot = [false, false, false, false];
localStorage.setItem("isBot", JSON.stringify(isBot));
localStorage.setItem("name1", "Joueur 1");
localStorage.setItem("name2", "Joueur 2");
localStorage.setItem("name3", "Joueur 3");
localStorage.setItem("name4", "Joueur 4");

function mode2players() {
	topPlayer.style.visibility = "hidden";
	bottomPlayer.style.visibility = "hidden";
	chosenMode = "1v1";
}

function mode4players() {
	topPlayer.style.visibility = "visible";
	bottomPlayer.style.visibility = "visible";
	chosenMode = "1v1v1v1";
}

function botOrNot(input: HTMLElement) {
	switch (input.id)
	{
		case "player1":
			isBot[0] = !isBot[0];
			break;
		case "player2":
			isBot[1] = !isBot[1];
			break;
		case "player3":
			isBot[2] = !isBot[2];
			break;
		case "player4":
			isBot[3] = !isBot[3];
			break;
		default:
			break;
	}
	localStorage.setItem("isBot", JSON.stringify(isBot));
	let textInput = input.parentElement?.querySelector('input[type="text"]') as HTMLElement | null;
	if (textInput)
		textInput.style.display = input instanceof HTMLInputElement && input.checked ? "none" : "block";
}

document.getElementById("back")?.addEventListener("click", () => {
	goBack("guest");
})

confirmation?.addEventListener("click", () => {
	let j1name = (document.getElementById("input-1") as HTMLInputElement)?.value.trim() || "Player 1";
	let j2name = (document.getElementById("input-2") as HTMLInputElement)?.value.trim() || "Player 2";
	let j3name = (document.getElementById("input-3") as HTMLInputElement)?.value.trim() || "Player 3";
	let j4name = (document.getElementById("input-4") as HTMLInputElement)?.value.trim() || "Player 4";
	if (j1name === j2name || j1name === j2name || j1name === j3name || j2name === j3name || j2name === j4name || j3name === j4name)
		return alert("At least 2 usernames are the same");
	const nameInputs = [
		document.getElementById("input-1") as HTMLInputElement,
		document.getElementById("input-2") as HTMLInputElement,
		document.getElementById("input-3") as HTMLInputElement,
		document.getElementById("input-4") as HTMLInputElement
	];
	let errorDiv = document.getElementById("settings-error-message") as HTMLElement;
	if (!errorDiv) {
		errorDiv = document.createElement("div");
		errorDiv.id = "settings-error-message";
		errorDiv.className = "text-red-700 text-base mb-4 text-center bg-red-100 border border-red-300 rounded px-4 py-2";
		confirmation.parentElement?.insertBefore(errorDiv, confirmation);
	}
	errorDiv.textContent = "";
	for (let i = 0; i < nameInputs.length; i++) {
		if (nameInputs[i]) {
			const val = nameInputs[i].value.trim();
			const escaped = escapeHTML(val);
			if (val && !/^[\w]+$/.test(escaped)) {
				errorDiv.textContent = `Invalid nickname for player ${i+1}. Only letters, numbers, and underscores are allowed.`;
				return;
			}
			localStorage.setItem(`name${i+1}`, escaped || `Player ${i+1}`);
		}
	}
	gameMode = chosenMode;
	rules = chosenRules;
	localStorage.setItem("gameMode", gameMode);
	localStorage.setItem("rules", rules);
	gameMode === "1v1" ? goBack("pvp") : goBack("pong_4P");
	localStorage.setItem("name1", j1name !== "" ? j1name : "Player 1");
	localStorage.setItem("name2", j2name !== "" ? j2name : "Player 2");
	localStorage.setItem("name3", j3name !== "" ? j3name : "Player 3");
	localStorage.setItem("name4", j4name !== "" ? j4name : "Player 4");
})

gameMode = "decor";
rules = "normal";
chosenRules = "normal";
localStorage.setItem("gameMode", gameMode);
localStorage.setItem("rules", rules);

document.getElementById("modifiedRules")?.addEventListener("click", () => {
	const slider = document.getElementById("slider")!;

	chosenRules = chosenRules === "normal" ? "modified" : "normal";

	if (chosenRules === "modified") {
		slider.style.backgroundColor = "rgb(0,150,0)";
		slider.classList.add("-translate-x-full");
	} else {
		slider.style.backgroundColor = "rgb(255,0,0)";
		slider.classList.remove("-translate-x-full");
	}
});