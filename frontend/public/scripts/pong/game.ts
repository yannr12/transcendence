keysPressed = {};

document.getElementById("retour_pvp")?.addEventListener("click", () => {
	if (localStorage.getItem("token"))
		goBack("registered_user");
	else
		goBack("modes");
})

if (window.location.pathname === "/pong_1vbot" || window.location.pathname === "/survival_mode")
{
	localStorage.setItem("name1", (localStorage.getItem("username") as string));
	localStorage.setItem("name2", "Bot");
}

if (localStorage.getItem("gameMode") === "decor")
{
	switch (window.location.pathname)
	{
		case "/pvp":
			goBack("modes");
			break;
		case "/pong_4P":
			goBack("modes");
			break;
		case "/pong_1vbot":
			goBack("registered_user");
			break;
		case "/survival_mode":
			goBack("registered_user");
			break;
		default:
			break;
	}
}


htmlPaddle1 = document.getElementById("paddle1") as HTMLElement;
htmlPaddle2 = document.getElementById("paddle2") as HTMLElement;
htmlPaddle3 = document.getElementById("paddle3") as HTMLElement;
htmlPaddle4 = document.getElementById("paddle4") as HTMLElement;
htmlBoard = document.getElementById("board") as HTMLElement;
htmlBall = document.getElementById("ball") as HTMLElement;

separator = document.getElementById("separator") as HTMLElement;
winlose = document.getElementById("winlose") as HTMLElement;

board = new Board(htmlBoard);
if (rules === "modified")
	htmlBonus = document.getElementById("bonus") as HTMLElement;
leftScore = document.getElementById("left-score") as HTMLElement;
rightScore = document.getElementById("right-score") as HTMLElement;
topScore = document.getElementById("top-score") as HTMLElement;
bottomScore = document.getElementById("bottom-score") as HTMLElement;

mode = localStorage.getItem("gameMode") as ("1v1" | "1v1v1v1" | "survival" | "decor");

function getValidName(key: string, fallback: string): string {
	const raw = localStorage.getItem(key) || fallback;
	const escaped = escapeHTML(raw);
	return /^[\w]+$/.test(escaped) ? escaped : fallback;
}

player1name = getValidName("name1", "Player 1");
player2name = getValidName("name2", "Player 2");
player3name = getValidName("name3", "Player 3");
player4name = getValidName("name4", "Player 4");

if (mode === "survival" || mode === null)
{
	const usernameGame = localStorage.getItem('username');
	const token = localStorage.getItem('token');
	if (!usernameGame || !token)
		goBack("index");
}

if (mode === "survival")
{
	separator.style.display = "none";
	rightScore.style.display = "none";
	leftScore.style.left = `${board.getWidth() / 2}px`;
	leftScore.style.top = `${board.getHeight() / 2 - 100}px`;
	leftScore.style.fontSize = "200px";
	rules = "normal";
}

tmp = localStorage.getItem("isBot");
if (tmp)
	isBot = JSON.parse(tmp);

player1 = mode === "survival" ? new Paddle(htmlPaddle1, board, "left", player1name) : isBot[0] || mode === "decor" ? new Bot(htmlPaddle1, board, "left", 1, player1name) : new Paddle(htmlPaddle1, board, "left", player1name);
player2 = mode === "survival" ? new Bot(htmlPaddle2, board, "right", 1, player2name) : isBot[1] || mode === "decor" ? new Bot(htmlPaddle2, board, "right", 1, player2name) : new Paddle(htmlPaddle2, board, "right", player2name);
if (mode === "1v1v1v1")
{
	player3 = isBot[2] ? new Bot(htmlPaddle3, board, "top", 1, player3name) : new Paddle(htmlPaddle3, board, "top", player3name)
	player4 = isBot[3] ? new Bot(htmlPaddle4, board, "bottom", 1, player4name) : new Paddle(htmlPaddle4, board, "bottom", player4name)
}

ball = new Ball(htmlBall, board, (mode as "1v1" | "1v1v1v1" | "survival" | "decor"), board.getWidth() / 400);

bonus = undefined;

activeKeys();
leftScore.innerHTML = "0";
rightScore.innerHTML = "0";
if (mode === "1v1v1v1")
{
	topScore.innerHTML = "0";
	bottomScore.innerHTML = "0";
}

xBall = ball.getX();
yBall = ball.getY();
vectorBall = ball.getVector();

animationId = undefined;

async function main(): Promise<void> {
	movePaddles((mode as "1v1" | "1v1v1v1" | "survival" | "decor"), [player1, player2, player3, player4]);
	bounces = ball.moveBall([player1, player2, player3, player4], [leftScore, rightScore, topScore, bottomScore], bonus, mode);
	if (bounces === -1)
	{
		let text: string | undefined = undefined;
		if (parseInt(rightScore.innerHTML) !== 0 && mode === "survival")
			text = `Your score: ${leftScore.textContent}`;
		if (mode === "1v1" && leftScore.innerHTML === maxScore)
			text = `The winner is ${localStorage.getItem("name1")} !`;
		else if (mode === "1v1" && rightScore.innerHTML === maxScore)
			text = `The winner is ${localStorage.getItem("name2")}`;
		if (mode === "1v1v1v1")
		{
			if (leftScore.innerHTML === maxScore && player1)
				text = `The winner is ${localStorage.getItem("name1")}`;
			else if (rightScore.innerHTML === maxScore && player2)
				text = `The winner is ${localStorage.getItem("name2")}`;
			else if (topScore?.innerHTML === maxScore)
				text = `The winner is ${localStorage.getItem("name3")}`;
			else if (bottomScore?.innerHTML === maxScore)
				text = `The winner is ${localStorage.getItem("name4")}`;
		}
		if (localStorage.getItem("tournoi") && leftScore.innerHTML === maxScore) {
			text = `The winner is ${localStorage.getItem("player1Name")}`; }
		else if (localStorage.getItem("tournoi") && rightScore.innerHTML === maxScore) {
			text = `The winner is ${localStorage.getItem("player2Name")}` }
		if (animationId && text !== undefined)
		{
			winlose.style.display = "block";
			(document.getElementById("finalScore") as HTMLElement).innerHTML = text;
			let leftscore, rightscore: number;
			leftscore = parseInt(leftScore.innerHTML);
			rightscore = parseInt(rightScore.innerHTML);
			const tournoi = localStorage.getItem("tournoi");
			if (tournoi && leftscore > rightscore)
				localStorage.setItem("winner", "left");
			else if (tournoi && leftscore < rightscore)
				localStorage.setItem("winner", "right");
			if (localStorage.getItem("token") !== null && !tournoi && mode != "1v1v1v1") {
				const isoDate = new Date().toISOString();
				const res = await fetch("/account/add_game",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json"},
					body: JSON.stringify({
							username: localStorage.getItem("username"),
							mode: mode,
							scoreleft: leftscore,
							scoreright: rightscore,
							date: isoDate})			
				});
				const data = await res.json();
				if (data.succes)
					console.log("Game added successfully.");
				else
					console.error("Error adding game:", data.message);
			}
			return cancelAnimationFrame(animationId);
		}
		return mode === "decor" ? main() : startCountdown(3, main);
	}
	if (localStorage.getItem("rules") === "modified")
	{
		if (bounces === 5 && bonus === undefined)
		{
			bonus = Math.round(Math.random()) === 0 ? new PaddleSizeBonus(htmlBonus, board) : new PaddleSpeedBonus(htmlBonus, board);
			bonus.appear();
		}
		else if (bounces === 0)
			bonus = undefined;
	}
	if (mode === "1v1" || mode === "survival" || mode === "decor")
	{
		player1!.move1v1(xBall, yBall, vectorBall, board);
		player2!.move1v1(xBall, yBall, vectorBall, board);
	}
	else
	{
		player1!.move4players(xBall, yBall, vectorBall, board);
		player2!.move4players(xBall, yBall, vectorBall, board);
		player3!.move4players(xBall, yBall, vectorBall, board);
		player4!.move4players(xBall, yBall, vectorBall, board);
	}
	ball.collision();
	animationId = requestAnimationFrame(main);
}

function startCountdown(seconds: number, callback: () => void) {
	bounces = 0;
	const countDown = document.getElementById("countdown") as HTMLElement;
	countDown.style.display = "block";
	let timeLeft = seconds;
	countDown.innerHTML = timeLeft.toString();

	const pulse = () => {
		countDown.animate(
			[
				{ transform: "scale(1)", opacity: 1 },
				{ transform: "scale(1.2)", opacity: 0.7 },
				{ transform: "scale(1)", opacity: 1 }
			],
			{
				duration: 1000,
				easing: "ease-in-out"
			}
		);
	};

	pulse();

	interval = setInterval(() => {
		timeLeft--;
		if (timeLeft > 0)
		{
			pulse();
			countDown.innerHTML = timeLeft.toString();
		}
		else
		{
			clearInterval(interval);
			interval = undefined;
			countDown.style.display = "none";
			callback();
		}
	}, 1000);
}

botViewInterval = setInterval(() => {
	xBall = ball.getX();
	yBall = ball.getY();
	vectorBall = ball.getVector();
}, 1000);

mode === "decor" ? main() : startCountdown(3, main);

document.getElementById("pause")?.addEventListener("click", () => {
	if (interval)
		return;
	if (animationId)
		cancelAnimationFrame(animationId);
	(document.getElementById("pause-page") as HTMLElement).style.display = "block";
})

document.getElementById("continuer")?.addEventListener("click", () => {
	(document.getElementById("pause-page") as HTMLElement).style.display = "none";
	animationId = requestAnimationFrame(main);
})

window.addEventListener("resize", () => {
	if (location.pathname !== "/modes" && location.pathname !== "/registered_user")
	{
		board.setHeight(window.innerHeight);
		board.setWidth(mode === "1v1v1v1" ? board.getHeight() : window.innerWidth);
		ball.setTop(board.getHeight() / 2 - ball.getRadius());
		ball.setLeft(board.getWidth() / 2 - ball.getRadius());
		player1?.reset(board);
		player2?.reset(board);
		player3?.reset(board);
		player4?.reset(board);
		bonus?.setLeft(board.getWidth() / 2 - bonus.getSize() / 2);
		bonus?.setTop(board.getHeight() / 2 - bonus.getSize() / 2);
	}
})

if (mode !== "decor")
{
	document.getElementById("player1Display")!.textContent = localStorage.getItem("name1");
	document.getElementById("player2Display")!.textContent = localStorage.getItem("name2");
}
if (mode === "1v1v1v1")
{
	document.getElementById("player3Display")!.textContent = localStorage.getItem("name3");
	document.getElementById("player4Display")!.textContent = localStorage.getItem("name4");
}