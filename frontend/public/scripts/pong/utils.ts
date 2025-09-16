let rules: "normal" | "modified" = "modified";

let gameMode: "1v1" | "1v1v1v1" | "survival" | "decor";

let isBot: boolean[] = [false, false, false, false];

let keysPressed: Record<string, boolean>;

let htmlPaddle1: HTMLElement;
let htmlPaddle2: HTMLElement;
let htmlPaddle3: HTMLElement;
let htmlPaddle4: HTMLElement;
let htmlBoard: HTMLElement;
let htmlBall: HTMLElement;
let htmlBonus: HTMLElement;

let leftScore: HTMLElement;
let rightScore: HTMLElement;
let topScore: HTMLElement;
let bottomScore: HTMLElement;

let board: Board;
let paddle1: Paddle;
let paddle2: Paddle;
let paddle3: Paddle;
let paddle4: Paddle;
let ball: Ball;
let bonus: Bonus | undefined;
let bot1: Bot;
let bot2: Bot;
let bot3: Bot;
let bot4: Bot;

let player1: Paddle | Bot | undefined;
let player2: Paddle | Bot | undefined;
let player3: Paddle | Bot | undefined;
let player4: Paddle | Bot | undefined;

let topPlayer: HTMLElement;
let bottomPlayer: HTMLElement;
let input3: HTMLElement;
let input4: HTMLElement;
let confirmation: HTMLElement;

const maxScore: string = "3";

let bounces: number;

let xBall: number;
let yBall: number;
let vectorBall: Vector;

function activeKeys(): void {
	window.addEventListener("keydown", (e) => {
		keysPressed[e.key] = true;
	})
	window.addEventListener("keyup", (e) => {
		keysPressed[e.key] = false;
	})
}

function movePaddles(gameMode: "1v1" | "1v1v1v1" | "survival" | "decor", paddles: (Paddle | Bot | undefined)[]): void {
	if (paddles[0]!.getType() === "paddle")
	{
		let pos1 = paddles[0]!.getTop() as number;
		if (keysPressed["w"] || keysPressed["W"])
			paddles[0]!.majPos(Math.max(0, pos1 - paddles[0]!.getSpeed()));
		else if (keysPressed["s"] || keysPressed["S"])
			paddles[0]!.majPos(Math.min(board.getHeight() - paddles[0]!.getHeight(), pos1 + paddles[0]!.getSpeed()));
	}

	if (paddles[1]!.getType() === "paddle")
	{
		let pos2 = paddles[1]!.getTop() as number;
		if (keysPressed["ArrowUp"])
			paddles[1]!.majPos(Math.max(0, pos2 - paddles[1]!.getSpeed()));
		else if (keysPressed["ArrowDown"])
			paddles[1]!.majPos(Math.min(board.getHeight() - paddles[1]!.getHeight(), pos2 + paddles[1]!.getSpeed()));
	}
	
	if (gameMode === "1v1v1v1")
	{
		if (paddles[2]!.getType() === "paddle")
		{
			let pos3 = paddles[2]!.getLeft() as number;
			if (keysPressed["c"] || keysPressed["C"])
				paddles[2]!.majPos(Math.max(0, pos3 - paddles[2]!.getSpeed()));
			else if (keysPressed["v"] || keysPressed["V"])
				paddles[2]!.majPos(Math.min(board.getWidth() - paddles[2]!.getWidth(), pos3 + paddles[2]!.getSpeed()));
		}

		if (paddles[3]!.getType() === "paddle")
		{
			let pos4 = paddles[3]!.getLeft() as number;
			if (keysPressed[","])
				paddles[3]!.majPos(Math.max(0, pos4 - paddles[3]!.getSpeed()));
			else if (keysPressed["."])
				paddles[3]!.majPos(Math.min(board.getWidth() - paddles[3]!.getWidth(), pos4 + paddles[3]!.getSpeed()));
		}
	}
}

function setSurvivalMode() {
	gameMode = "survival";
	localStorage.setItem("gameMode", gameMode);
}

function set1vBot() {
	gameMode = "1v1";
	localStorage.setItem("gameMode", gameMode);
	isBot[1] = true;
	localStorage.setItem("isBot", JSON.stringify(isBot));
}

class Paddle
{
    private element: HTMLElement;
    private top?: number;
    private bottom?: number;
	private left?: number;
	private right?: number;
	private height: number;
	private width: number;
	private position: "left" | "right" | "top" | "bottom";
	private speed: number;
	private boosted?: string;
	private bouncesAsBoosted: number;
	private type: "paddle" | "bot";
	private name: string;

	private defaultSpeed: number;
	private defaultWidth: number;
	private defaultHeight: number;

	constructor(element: HTMLElement, board: Board, position: "left" | "right" | "top" | "bottom", name: string) {
		this.type = "paddle";
		this.bouncesAsBoosted = 0;
		this.element = element;
		this.position = position;
		this.height = element.offsetHeight;
		this.defaultHeight = element.offsetHeight;
		this.width = element.offsetWidth;
		this.defaultWidth = element.offsetWidth;
		this.speed = 5;
		this.defaultSpeed = 5;
		this.boosted = undefined;
		this.reset(board);
		this.element.style.width = `${this.width}px`;
		this.element.style.height = `${this.height}px`;
		this.name = name;
	}

	getElement(): HTMLElement { return this.element; }
	getTop(): number | undefined { return this.top; }
	getBottom(): number | undefined { return this.bottom; }
	getLeft(): number | undefined { return this.left; }
	getRight(): number | undefined { return this.right; }
	getHeight(): number { return this.height; }
	getWidth(): number { return this.width; }
	getPosition() { return this.position; }
	getSpeed() { return this.speed; }
	getType() { return this.type; }
	getName() { return this.name; }
	getBouncesAsBoosted() { return this.bouncesAsBoosted; }

	addBouncesAsBoosted() { this.bouncesAsBoosted++; }

	resetBouncesAsBoosted() { this.bouncesAsBoosted = 0; }

	resetBoost() {
		if (this.boosted === "speed")
		{
			this.speed = this.defaultSpeed;
			this.boosted = undefined;
		}
		else if (this.boosted === "size")
		{
			let diffWidth = Math.abs(this.defaultWidth - this.width);
			let diffHeight = Math.abs(this.defaultHeight - this.height);
			if (this.top != undefined && this.bottom != undefined)
			{
				this.top += diffHeight / 2;
				this.bottom -= diffHeight / 2;
				this.element.style.top = `${this.top}px`;
				this.element.style.bottom = `${this.bottom}px`;
			}
			if (this.left != undefined && this.right != undefined)
			{
				this.left += diffWidth / 2;
				this.right -= diffWidth / 2;
				this.element.style.left = `${this.left}px`;
				this.element.style.right = `${this.right}px`;
			}
			this.width = this.defaultWidth;
			this.height = this.defaultHeight;
			this.element.style.width = `${this.width}px`;
			this.element.style.height = `${this.height}px`;
			this.boosted = undefined;
		}
		this.bouncesAsBoosted = 0;
	}

	isBoosted() { return this.boosted; }

	setSpeed(x: number) { this.speed = x; }
	setBoosted(boosted: "speed" | "size" | undefined) { this.boosted = boosted; }
	setType(type: "paddle" | "bot") { this.type = type; }


	setSize(size: number) {
		if (this.position === "right" || this.position === "left")
		{
			let x = this.getHeight() - size;
			if (this.top !== undefined && this.bottom)
			{
				if (this.top - x / 2 >= 0 && this.bottom + x / 2 <= board.getHeight())
				{
					this.top -= x / 2;
					this.bottom += x / 2;
					this.element.style.top = `${this.top}px`;
					this.element.style.bottom = `${this.bottom}px`;
				}
				else if (this.top - x / 2 >= 0)
				{
					this.top -= x / 2;
					this.element.style.top = `${this.top}px`;
				}
				else
				{
					this.bottom += x / 2;
					this.element.style.bottom = `${this.bottom}px`;
				}
				this.height = size;
				this.element.style.height = `${this.height}px`;
			}
		}
		else
		{
			let x = this.getWidth() - size;
			if (this.left !== undefined && this.right)
			{
				if (this.left - x / 2 >= 0 && this.right + x / 2 <= board.getWidth())
				{
					this.left -= x / 2;
					this.right += x / 2;
					this.element.style.left = `${this.left}px`;
					this.element.style.right = `${this.right}px`;
				}
				else if (this.left - x / 2 >= 0)
				{
					this.left -= x / 2;
					this.element.style.left = `${this.left}px`;
				}
				else
				{
					this.right += x / 2;
					this.element.style.right = `${this.right}px`;
				}
				this.width = size;
				this.element.style.width = `${this.width}px`;
			}
		}
	}

	majPos(x: number): void {
		if (this.position === "left" || this.position === "right")
		{
			this.element.style.top = `${x}px`;
			this.top = x;
			this.bottom = x + this.height;
		}
		else
		{
			this.element.style.left = `${x}px`;
			this.left = x;
			this.right = this.left + this.width;
		}
	}

	move4players(xBall: number, yBall: number, vectorBall: Vector, board: Board) {}
	move1v1(xBall: number, yBall: number, vectorBall: Vector, board: Board) {}

	reset(board: Board) {
		switch (this.position)
		{
			case "left":
				this.top = (board.getHeight() - this.height) / 2;
				this.bottom = this.top + this.height;
				this.left = 0;
				this.element.style.top = `${this.top}px`;
				this.element.style.bottom = `${this.bottom}px`;
				this.element.style.left = `${this.left}px`;
				break;
			case "right":
				this.top = (board.getHeight() - this.height) / 2;
				this.bottom = this.top + this.height;
				this.right = 0;
				this.element.style.top = `${this.top}px`;
				this.element.style.bottom = `${this.bottom}px`;
				this.element.style.right = `${this.right}px`;
				break;
			case "top":
				this.left = (board.getWidth() - this.width) / 2;
				this.right = this.left + this.width;
				this.top = 0;
				this.element.style.left = `${this.left}px`;
				this.element.style.right = `${this.right}px`;
				this.element.style.top = `${this.top}px`;
				break;
			case "bottom":
				this.left = (board.getWidth() - this.width) / 2;
				this.right = this.left + this.width;
				this.bottom = 0;
				this.element.style.left = `${this.left}px`;
				this.element.style.right = `${this.right}px`;
				this.element.style.bottom = `${this.bottom}px`;
				break;
		}
	}
}

class Vector
{
	private x: number;
	private y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	X() { return this.x; }
	Y() { return this.y; }
	
	getNorm() { return Math.sqrt(this.x**2 + this.y**2); }

	normalise() { this.x /= this.getNorm(); this.y /= this.getNorm(); }

	setNorm(norm: number) { this.normalise(); this.x *= norm; this.y *= norm; }
	setX(x: number) { this.x = x; }
	setY(y: number) { this.y = y; }
	setVector(vector: number[]) { this.x = vector[0]; this.y = vector[1]; }

	applyOn(x: number, y: number) { return [x + this.x, y + this.y]; }
}

class Board
{
	private element: HTMLElement;
	private height: number;
	private width: number;

	constructor(board: HTMLElement) {
		this.element = board;
		this.height = board.offsetHeight;
		this.width = board.offsetWidth;
	}

	getHeight(): number { return this.height; }
	getWidth(): number { return this.width; }
	getElement(): HTMLElement { return this.element; }

	setHeight(x: number) { this.height = x; this.element.style.height = `${this.height}px`; }
	setWidth(x: number) { this.width = x; this.element.style.width = `${this.width}px`; }
}



class Ball
{
	private element: HTMLElement;
	private top: number;
	private left: number;
	private xCenter: number;
	private yCenter: number;
	private size: number;
	private vector: Vector;
	private speed: number;
	private radius: number;
	private board: Board;
	private winner?: "left" | "right" | "top" | "bottom";
	private lastTouch?: "left" | "right" | "top" | "bottom";
	private gameMode: string;
	private resetSpeed: number;
	private bounces: number;

	constructor(ball: HTMLElement, board: Board, gameMode: "1v1" | "1v1v1v1" | "survival" | "decor", speed: number) {
		this.gameMode = gameMode;
		this.bounces = 0;
		this.board = board;
		this.element = ball;
		this.size = ball.offsetWidth;
		this.radius = this.size / 2;
		this.top = this.board.getHeight() / 2 - this.radius;
		this.left = this.board.getWidth() / 2 - this.radius;
		this.xCenter = this.left + this.radius;
		this.yCenter = this.top + this.radius;
		this.vector = new Vector(1, Math.random() / 4 - 0.125);
		this.speed = speed;
		this.resetSpeed = speed;
		this.element.style.left = `${this.left}px`;
		this.element.style.top = `${this.top}px`;
		this.vector.setNorm(this.speed);
	}
	
	getElement() { return this.element; }
	getTop() { return this.top; }
	getLeft() { return this.left; }
	getX() { return this.xCenter; }
	getY() { return this.yCenter; }
	getSize() { return this.size; }
	getRadius() { return this.radius; }
	getVector() { let vector = new Vector(this.vector.X(), this.vector.Y()); return vector; }
	getSpeed() { return this.speed; }
	getWinner() { return this.winner; }
	getLastTouch() { return this.lastTouch; }

	setSpeed(speed: number) { this.speed = speed; }
	setLeft(x: number) { this.left = x; this.xCenter = this.left + this.radius; this.element.style.left = `${this.left}px`; }
	setTop(x: number) { this.top = x; this.xCenter = this.top + this.radius; this.element.style.top = `${this.top}px`; }

	private justMove(): void {
		this.xCenter += this.vector.X();
		this.left += this.vector.X();
		this.element.style.left = `${this.left}px`;
		this.yCenter += this.vector.Y();
		this.top += this.vector.Y();
		this.element.style.top = `${this.top}px`;
	}

	isCollision(bonus: Bonus): boolean {
    	const ballLeft = ball.getLeft();
    	const ballTop = ball.getTop();
    	const ballRight = ballLeft + ball.getSize();
    	const ballBottom = ballTop + ball.getSize();

    	const bonusLeft = bonus.getLeft();
    	const bonusTop = bonus.getTop();
    	const bonusRight = bonusLeft + bonus.getSize();
    	const bonusBottom = bonusTop + bonus.getSize();

    	return (
    	    ballLeft <= bonusRight &&
    	    ballRight >= bonusLeft &&
    	    ballTop <= bonusBottom &&
    	    ballBottom >= bonusTop
    	);
	}

	moveBall(paddles: (Paddle | Bot | undefined)[], paddleScores: (HTMLElement | undefined)[], bonus: Bonus | undefined, mode: "1v1" | "1v1v1v1" | "survival" | "decor"): number {
		if (this.bounces === -1)
			this.bounces = 0;
		if (mode !== "decor" && bonus && bonus.isDefined() && this.isCollision(bonus))
		{
			if (this.lastTouch === "left")
			{
				if (!paddles[0]!.isBoosted())
					bonus.activate(paddles[0]!);
				bonus.disappear();
			}
			else if (this.lastTouch === "right")
			{
				if (!paddles[1]!.isBoosted())
					bonus.activate(paddles[1]!);
				bonus.disappear();
			}
			else if (this.lastTouch === "top")
			{
				if (!paddles[2]!.isBoosted())
					bonus.activate(paddles[2]!);
				bonus.disappear();
			}
			else if (this.lastTouch === "bottom")
			{
				if (!paddles[3]!.isBoosted())
					bonus.activate(paddles[3]!);
				bonus.disappear();
			}
			this.bounces = 0;
		}
		for (const paddle of paddles)
		{
			if (!paddle)
				continue;
			let paddleTop = paddle.getTop() as number;
			let paddleBottom = paddle.getBottom() as number;
			let paddleLeft = paddle.getLeft() as number;
			let paddleRight = paddle.getRight() as number;
			if (paddle.getPosition() === "left")
			{
				if (this.left + this.vector.X() < paddle.getWidth() && this.yCenter + this.radius >= paddleTop && this.yCenter - this.radius <= paddleBottom)
				{
					this.left = paddle.getWidth();
					this.xCenter = this.left + this.radius;
					this.element.style.left = `${this.left}px`;
					this.vector.setX(this.vector.X() * -1);
					let collisionPoint = this.yCenter - (paddleTop + paddle.getHeight() / 2);
					collisionPoint /= paddle.getHeight() / 2.5;
					this.vector.normalise();
					this.vector.setY(collisionPoint);
					this.vector.setNorm(this.speed);
					this.speed += mode === "decor" ? 0 : 0.2;
					this.lastTouch = "left";
					this.bounces++;
					paddle.addBouncesAsBoosted();
					if (paddle.isBoosted() != undefined && paddle.getBouncesAsBoosted() >= 3)
						paddle.resetBoost();
					if (mode === "survival")
						paddleScores[0]!.innerHTML = String(parseInt(paddleScores[0]!.innerHTML) + 1);
				}
				else if (this.left < 0)
				{
					bonus?.disappear();
					this.reset(paddleScores, "left", paddles, mode);
				}
				else
					this.justMove();
			}
			else if (paddle.getPosition() === "right")
			{
				if (this.left + this.size + this.vector.X() > this.board.getWidth() - paddle.getWidth() && this.yCenter + this.radius >= paddleTop && this.yCenter - this.radius <= paddleBottom)
				{
					this.left = this.board.getWidth() - paddle.getWidth() - this.size;
					this.xCenter = this.left + this.radius;
					this.element.style.left = `${this.left}px`;
					this.vector.setX(this.vector.X() * -1);
					let collisionPoint = this.yCenter - (paddleTop + paddle.getHeight() / 2);
					collisionPoint /= paddle.getHeight() / 2.5;
					this.vector.normalise();
					this.vector.setY(collisionPoint);
					this.vector.setNorm(this.speed);
					this.speed += mode === "decor" ? 0 : 0.2;
					this.lastTouch = "right";
					this.bounces++;
					paddle.addBouncesAsBoosted();
					if (paddle.isBoosted() != undefined && paddle.getBouncesAsBoosted() >= 3)
						paddle.resetBoost();
				}
				else if (this.left + this.size > this.board.getWidth())
				{
					bonus?.disappear();
					this.reset(paddleScores, "right", paddles, mode);
				}
				else
					this.justMove();
			}
			else if (paddle.getPosition() === "top")
			{
				if (this.top + this.vector.Y() < paddle.getHeight() && this.xCenter + this.radius >= paddleLeft && this.xCenter - this.radius <= paddleRight)
				{
					this.top = paddle.getHeight();
					this.yCenter = this.top + this.radius;
					this.element.style.top = `${this.top}px`;
					this.vector.setY(this.vector.Y() * -1);
					let collisionPoint = this.xCenter - (paddleLeft + paddle.getWidth() / 2);
					collisionPoint /= paddle.getWidth() / 2.5;
					this.vector.normalise();
					this.vector.setX(collisionPoint);
					this.vector.setNorm(this.speed);
					this.speed += mode === "decor" ? 0 : 0.2;
					this.lastTouch = "top";
					this.bounces++;
					paddle.addBouncesAsBoosted();
					if (paddle.isBoosted() != undefined && paddle.getBouncesAsBoosted() >= 3)
						paddle.resetBoost();
				}
				else if (this.top < 0)
				{
					bonus?.disappear();
					this.reset(paddleScores, "top", paddles, mode);
				}
				else
					this.justMove();
			}
			else if (paddle.getPosition() === "bottom")
			{
				if (this.top + this.size + this.vector.Y() > this.board.getHeight() - paddle.getHeight() && this.xCenter + this.radius >= paddleLeft && this.xCenter - this.radius <= paddleRight)
				{
					this.top = this.board.getHeight() - paddle.getHeight() - this.size;
					this.yCenter = this.top + this.radius;
					this.element.style.top = `${this.top}px`;
					this.vector.setY(this.vector.Y() * -1);
					let collisionPoint = this.xCenter - (paddleLeft + paddle.getWidth() / 2);
					collisionPoint /= paddle.getWidth() / 2.5;
					this.vector.normalise();
					this.vector.setX(collisionPoint);
					this.vector.setNorm(this.speed);
					this.speed += mode === "decor" ? 0 : 0.2;
					this.lastTouch = "bottom";
					this.bounces++;
					paddle.addBouncesAsBoosted();
					if (paddle.isBoosted() != undefined && paddle.getBouncesAsBoosted() >= 3)
						paddle.resetBoost();
				}
				else if (this.top + this.size > this.board.getHeight())
				{
					bonus?.disappear();
					this.reset(paddleScores, "bottom", paddles, mode);
				}
				else
					this.justMove();
			}
		}
		return this.bounces;
	}

	collision(): void {
		if (this.gameMode === "1v1" || this.gameMode === "survival" || this.gameMode === "decor")
		{
			if (this.yCenter - this.radius < 0)
			{
				this.vector.setY(this.vector.Y() * -1);
				this.top = 0;
				this.yCenter = this.top + this.radius;
				this.element.style.top = `${this.top}`;
			}
			if (this.yCenter + this.radius > this.board.getHeight())
			{
				this.vector.setY(this.vector.Y() * -1);
				this.top = this.board.getHeight() - this.size;
				this.yCenter = this.top + this.radius;
				this.element.style.top = `${this.top}`;
			}
		}
	}

	reset(paddleScores: (HTMLElement | undefined)[], loser: "right" | "left" | "top" | "bottom", paddles: (Paddle | Bot | undefined)[], mode: "1v1" | "1v1v1v1" | "survival" | "decor"): void {
		let scores = {
			"left": paddleScores[0],
			"right": paddleScores[1],
			"top": paddleScores[2],
			"bottom": paddleScores[3],
		};
		this.bounces = 0;
		this.top = this.board.getHeight() / 2 - this.radius / 2;
		this.left = this.board.getWidth() / 2 - this.radius / 2;
		this.xCenter = this.left + this.radius;
		this.yCenter = this.top + this.radius;
		if (this.lastTouch !== undefined)
		{
			let scorer = scores[this.lastTouch] as HTMLElement;
			let tmpScore = parseInt(scorer.textContent || "0", 10);
			if (mode === "survival" && scorer.id === "left-score")
				scorer.innerHTML = String(tmpScore + 5);
			else
				scorer.innerHTML = String(++tmpScore);
		}
		switch (loser)
		{
			case "left":
				this.vector.setVector([-1, Math.random() / 4 - 0.125]);
				break;
			case "right":
				this.vector.setVector([1, Math.random() / 4 - 0.125]);
				break;
			case "top":
				this.vector.setVector([Math.random() / 4 - 0.125, -1]);
				break;
			case "bottom":
				this.vector.setVector([Math.random() / 4 - 0.125, 1]);
				break;
			default:
				this.vector.setVector([1, Math.random() / 4 - 0.125]);
				break;
		}
		this.speed = this.resetSpeed;
		this.vector.setNorm(this.speed);
		this.element.style.left = `${this.left}px`;
		this.element.style.top = `${this.top}px`;
		for (let paddle of paddles)
			paddle?.reset(this.board);
		this.bounces = -1;
		this.lastTouch = undefined;
	}
}

abstract class Bonus
{
	private type: string;
	private element: HTMLElement;
	private top: number;
	private left: number;
	private size: number;

	constructor(type: string, element: HTMLElement, board: Board) {
		this.type = type;
		this.element = element;
		this.size = 60;
		this.top = board.getHeight() / 2 - this.size / 2;
		this.left = board.getWidth() / 2 - this.size / 2;
		this.element.style.top = `${this.top}px`;
		this.element.style.left = `${this.left}px`;
		this.element.style.display = "none";
	}

	getType() { return this.type; }
	getElement() { return this.element; }
	getTop() { return this.top; }
	getBottom() { return this.top + this.size; }
	getLeft() { return this.left; }
	getRight() { return this.left + this.size; }
	getSize() { return this.size; }

	setTop(x: number) { this.top = x; this.element.style.top = `${this.top}px`; }
	setLeft(x: number) { this.left = x; this.element.style.left = `${this.left}px`; }
	
	isDefined() { return this.element.style.display === "block"; }

	appear(): void { this.element.style.backgroundImage = `url(${this.type === "paddle-size-bonus" ? "/assets/boost_size.png" : "/assets/boost_speed.png"})`; this.element.style.display = "block"; }

	disappear(): void { this.element.style.display = "none"; }

	abstract activate(paddle: Paddle | Bot): void;
}

class PaddleSpeedBonus extends Bonus
{
	private defaultSpeed?: number;

	constructor(element: HTMLElement, board: Board) {
		super("paddle-speed-bonus", element, board);
	}

	activate(paddle: Paddle | Bot): void {
		this.defaultSpeed = paddle.getSpeed();
		paddle.setSpeed(this.defaultSpeed * 2);
		paddle.setBoosted("speed");
		paddle.resetBouncesAsBoosted();
	}
}

class PaddleSizeBonus extends Bonus
{
	private defaultSize?: number;

	constructor(element: HTMLElement, board: Board) {
		super("paddle-size-bonus", element, board);
	}

	activate(paddle: Paddle | Bot): void {
		paddle.setBoosted("size");
		if (paddle.getPosition() === "right" || paddle.getPosition() === "left")
			this.defaultSize = paddle.getHeight();
		else
			this.defaultSize = paddle.getWidth();
		paddle.setSize(this.defaultSize * 1.5);
		paddle.resetBouncesAsBoosted();
	}
}

class Bot extends Paddle
{
	private difficulty: 1 | 2 | 3;
	private anticipated: number;
 
	constructor(paddle: HTMLElement, board: Board, position: "left" | "right" | "top" | "bottom", difficulty: 1 | 2 | 3 = 1, name: string) {
		super(paddle, board, position, name);
		this.setType("bot");
		this.difficulty = difficulty;
		this.anticipated = 0;
	}

	private getIntersec(vector1: Vector, position1: number[], board: Board, border: "left" | "right" | "top" | "bottom") {
		let foos = {
			"left": [1e100, 0],
			"right": [1e100 / board.getWidth(), -1e100],
			"bottom": [0, board.getHeight()],
			"top": [0, 0],
		};
		let fooBall = [vector1.Y() / vector1.X(), -position1[0] * (vector1.Y() / vector1.X()) + position1[1]];
		if (fooBall[0] - foos[border][0] === 0)
			return undefined;
		let xIntersec = (foos[border][1] - fooBall[1]) / (fooBall[0] - foos[border][0]);
		return ([xIntersec, fooBall[0] * xIntersec + fooBall[1]]);
	}

	private dist2points(a: number[] | undefined, b: number[] | undefined) {
		if (a === undefined)
			return Math.sqrt(b![0]**2 + b![1]**2);
		else if (b === undefined)
			return Math.sqrt(a![0]**2 + a![1]**2);
		let vector = new Vector(a![0] - b![0], a![1] - b![1]);
		return vector.getNorm();
	}

	private goMiddle(board: Board, position: "left" | "right" | "top" | "bottom") {
		if (position === "left" || position === "right")
		{
			if (this.getTop()! + this.getHeight() / 2 > board.getHeight() / 2 + 10)
				this.majPos(this.getTop()! - this.getSpeed());
			else if (this.getTop()! + this.getHeight() / 2 < board.getHeight() / 2 - 10)
				this.majPos(this.getTop()! + this.getSpeed());
		}
		else
		{
			if (this.getLeft()! + this.getWidth() / 2 > board.getWidth() / 2 + 10)
				this.majPos(this.getLeft()! - this.getSpeed())
			else if (this.getLeft()! + this.getWidth() / 2 < board.getWidth() / 2 - 10)
				this.majPos(this.getLeft()! + this.getSpeed());
		}
	}

	private computeBounces(ballVector: Vector, ballX: number, ballY: number, board: Board, border: "top" | "bottom" | "left" | "right", mode: "1v1" | "1v1v1v1")
	{
		let intersecNeutralBorder = this.getIntersec(ballVector, [ballX, ballY], board, border);
		let intersecPosition = this.getIntersec(ballVector, [ballX, ballY], board, this.getPosition());
		if (mode === "1v1")
		{
			if (this.dist2points([ballX, ballY], intersecNeutralBorder!) < this.dist2points([ballX, ballY], intersecPosition!) && this.anticipated++ < this.difficulty)
				return this.move1v1(intersecNeutralBorder![0], intersecNeutralBorder![1], new Vector(ballVector.X(), -ballVector.Y()), board);
			else
				this.anticipated = 0;
		}
		if (this.dist2points([ballX, ballY], intersecNeutralBorder!) > this.dist2points([ballX, ballY], intersecPosition!))
		{
			if (this.getPosition() === "left" || this.getPosition() === "right")
			{
				if (this.getTop()! + this.getHeight() / 2 < intersecPosition![1] - 10)
					this.majPos(Math.min(board.getHeight() - this.getHeight(), this.getTop()! + this.getSpeed()));
				else if (this.getTop()! + this.getHeight() / 2 > intersecPosition![1] + 10)
					this.majPos(Math.max(0, this.getTop()! - this.getSpeed()));
			}
			else
			{
				if (this.getLeft()! + this.getWidth() / 2 < intersecPosition![0] - 10)
					this.majPos(Math.min(board.getWidth() - this.getWidth(), this.getLeft()! + this.getSpeed()));
				else if (this.getLeft()! + this.getWidth() / 2 > intersecPosition![0] + 10)
					this.majPos(Math.max(0, this.getLeft()! - this.getSpeed()));
			}
		}
		else
			this.goMiddle(board, this.getPosition());
	}

	move1v1(ballX: number, ballY: number, ballVector: Vector, board: Board): void {
		if (ballVector.X() < 0 && this.getPosition() === "right")
			return this.goMiddle(board, "right");
		if (ballVector.X() > 0 && this.getPosition() === "left")
			return this.goMiddle(board, "left");
		if (ballVector.Y() < 0)
			this.computeBounces(ballVector, ballX, ballY, board, "top", "1v1");
		else if (ballVector.Y() > 0)
			this.computeBounces(ballVector, ballX, ballY, board, "bottom", "1v1");
		else
		{
			if (this.getTop()! + this.getHeight() / 2 < ballY - 10)
				this.majPos(Math.min(board.getHeight() - this.getHeight(), this.getTop()! + this.getSpeed()))
			else if (this.getTop()! + this.getHeight() / 2 > ballY + 10)
				this.majPos(Math.max(0, this.getTop()! - this.getSpeed()));
		}
	}

	move4players(ballX: number, ballY: number, ballVector: Vector, board: Board): void {
		if (ballVector.X() < 0 && this.getPosition() === "right")
			return this.goMiddle(board, "right");
		if (ballVector.X() > 0 && this.getPosition() === "left")
			return this.goMiddle(board, "left");
		if (ballVector.Y() < 0 && this.getPosition() === "bottom")
			return this.goMiddle(board, "bottom");
		if (ballVector.Y() > 0 && this.getPosition() === "top")
			return this.goMiddle(board, "top");
		if (ballVector.Y() < 0 && (this.getPosition() === "left" || this.getPosition() === "right"))
			this.computeBounces(ballVector, ballX, ballY, board, "top", "1v1v1v1");
		else if (ballVector.Y() > 0 && (this.getPosition() === "left" || this.getPosition() === "right"))
			this.computeBounces(ballVector, ballX, ballY, board, "bottom", "1v1v1v1");
		else if (ballVector.X() < 0 && (this.getPosition() === "top" || this.getPosition() === "bottom"))
			this.computeBounces(ballVector, ballX, ballY, board, "left", "1v1v1v1");
		else if (ballVector.X() > 0 && (this.getPosition() === "top" || this.getPosition() === "bottom"))
			this.computeBounces(ballVector, ballX, ballY, board, "right", "1v1v1v1");
		else
		{
			if (this.getPosition() === "left" || this.getPosition() === "right")
			{
				if (this.getTop()! + this.getHeight() / 2 < ballY - 10)
					this.majPos(Math.min(board.getHeight() - this.getHeight(), this.getTop()! + this.getSpeed()))
				else if (this.getTop()! + this.getHeight() / 2 > ballY + 10)
					this.majPos(Math.max(0, this.getTop()! - this.getSpeed()));
			}
			else
			{
				if (this.getLeft()! + this.getWidth() / 2 < ballX - 10)
					this.majPos(Math.min(board.getWidth() - this.getWidth(), this.getLeft()! + this.getSpeed()))
				else if (this.getLeft()! + this.getWidth() / 2 > ballX + 10)
					this.majPos(Math.max(0, this.getLeft()! - this.getSpeed()));
			}
		}
	}
}

let mode: "1v1" | "1v1v1v1" | "survival" | "decor";
let player1name: string;
let player2name: string;
let player3name: string;
let player4name: string;

let separator: HTMLElement;
let winlose: HTMLElement;

let animationId: number | undefined;

let tmp: string | null;

let botViewInterval: NodeJS.Timeout;

let interval: NodeJS.Timeout | undefined;

let tournamentRound: number;
let matchIndex: number;
let currentPlayers: string[];
let nextRound: string[];

let chosenMode: "1v1" | "1v1v1v1";
let chosenRules: "normal" | "modified";

let lastPage: string | undefined;

function escapeHTML(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}