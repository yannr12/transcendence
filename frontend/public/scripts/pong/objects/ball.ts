// class Ball
// {
// 	private element: HTMLElement;
// 	private top: number;
// 	private left: number;
// 	private xCenter: number;
// 	private yCenter: number;
// 	private size: number;
// 	private vector: Vector;
// 	private speed: number;
// 	private radius: number;
// 	private board: Board;
// 	private winner?: "left" | "right" | "top" | "bottom";
// 	private lastTouch?: "left" | "right" | "top" | "bottom";
// 	private gameMode: string;
// 	private resetSpeed: number;
// 	private bounces: number;

// 	constructor(ball: HTMLElement, board: Board, gameMode: "1v1" | "1v1v1v1" | "survival", speed: number) {
// 		this.gameMode = gameMode;
// 		this.bounces = 0;
// 		this.board = board;
// 		this.element = ball;
// 		this.size = ball.offsetWidth;
// 		this.radius = this.size / 2;
// 		this.top = this.board.getHeight() / 2 - this.radius;
// 		this.left = this.board.getWidth() / 2 - this.radius;
// 		this.xCenter = this.left + this.radius;
// 		this.yCenter = this.top + this.radius;
// 		this.vector = new Vector(1, Math.random() / 4 - 0.125);
// 		this.speed = speed;
// 		this.resetSpeed = speed;
// 		this.element.style.left = `${this.left}px`;
// 		this.element.style.top = `${this.top}px`;
// 		this.vector.setNorm(this.speed);
// 	}
	
// 	getElement() { return this.element; }
// 	getTop() { return this.top; }
// 	getLeft() { return this.left; }
// 	getX() { return this.xCenter; }
// 	getY() { return this.yCenter; }
// 	getSize() { return this.size; }
// 	getRadius() { return this.radius; }
// 	getVector() { let vector = new Vector(this.vector.X(), this.vector.Y()); return vector; }
// 	getSpeed() { return this.speed; }
// 	getWinner() { return this.winner; }
// 	getLastTouch() { return this.lastTouch; }

// 	setSpeed(speed: number) { this.speed = speed; }

// 	private justMove(): void {
// 		this.xCenter += this.vector.X();
// 		this.left += this.vector.X();
// 		this.element.style.left = `${this.left}px`;
// 		this.yCenter += this.vector.Y();
// 		this.top += this.vector.Y();
// 		this.element.style.top = `${this.top}px`;
// 	}

// 	isCollision(bonus: Bonus): boolean {
//     	const ballLeft = ball.getLeft();
//     	const ballTop = ball.getTop();
//     	const ballRight = ballLeft + ball.getSize();
//     	const ballBottom = ballTop + ball.getSize();

//     	const bonusLeft = bonus.getLeft();
//     	const bonusTop = bonus.getTop();
//     	const bonusRight = bonusLeft + bonus.getSize();
//     	const bonusBottom = bonusTop + bonus.getSize();

//     	return (
//     	    ballLeft <= bonusRight &&
//     	    ballRight >= bonusLeft &&
//     	    ballTop <= bonusBottom &&
//     	    ballBottom >= bonusTop
//     	);
// 	}

// 	moveBall(paddles: (Paddle | Bot)[], paddleScores: (HTMLElement | undefined)[], bonus: Bonus | undefined, mode: "1v1" | "1v1v1v1" | "survival"): number {
// 		if (this.bounces === -1)
// 			this.bounces = 0;
// 		if (bonus && bonus.isDefined() && this.isCollision(bonus))
// 		{
// 			if (this.lastTouch === "left")
// 			{
// 				if (!paddles[0].isBoosted())
// 					bonus.activate(paddles[0]);
// 				bonus.disappear();
// 			}
// 			else if (this.lastTouch === "right")
// 			{
// 				if (!paddles[1].isBoosted())
// 					bonus.activate(paddles[1]);
// 				bonus.disappear();
// 			}
// 			else if (this.lastTouch === "top")
// 			{
// 				if (!paddles[2].isBoosted())
// 					bonus.activate(paddles[2]);
// 				bonus.disappear();
// 			}
// 			else if (this.lastTouch === "bottom")
// 			{
// 				if (!paddles[3].isBoosted())
// 					bonus.activate(paddles[3]);
// 				bonus.disappear();
// 			}
// 			this.bounces = 0;
// 		}
// 		for (const paddle of paddles)
// 		{
// 			if (!paddle)
// 				continue;
// 			let paddleTop = paddle.getTop() as number;
// 			let paddleBottom = paddle.getBottom() as number;
// 			let paddleLeft = paddle.getLeft() as number;
// 			let paddleRight = paddle.getRight() as number;
// 			if (paddle.getPosition() === "left")
// 			{
// 				if (this.left + this.vector.X() < paddle.getWidth() && this.yCenter + this.radius >= paddleTop && this.yCenter - this.radius <= paddleBottom)
// 				{
// 					this.left = paddle.getWidth();
// 					this.xCenter = this.left + this.radius;
// 					this.element.style.left = `${this.left}px`;
// 					this.vector.setX(this.vector.X() * -1);
// 					let collisionPoint = this.yCenter - (paddleTop + paddle.getHeight() / 2);
// 					collisionPoint /= paddle.getHeight() / 2.5;
// 					this.vector.normalise();
// 					this.vector.setY(collisionPoint);
// 					this.vector.setNorm(this.speed);
// 					this.speed += 0.2;
// 					this.lastTouch = "left";
// 					this.bounces++;
// 					paddle.addBouncesAsBoosted();
// 					if (paddle.isBoosted() != undefined && paddle.getBouncesAsBoosted() >= 3)
// 						paddle.resetBoost();
// 					if (mode === "survival")
// 						paddleScores[0]!.innerHTML = String(parseInt(paddleScores[0]!.innerHTML) + 1);
// 				}
// 				else if (this.left < 0)
// 				{
// 					bonus?.disappear();
// 					this.reset(paddleScores, "left", paddles, mode);
// 				}
// 				else
// 					this.justMove();
// 			}
// 			else if (paddle.getPosition() === "right")
// 			{
// 				if (this.left + this.size + this.vector.X() > this.board.getWidth() - paddle.getWidth() && this.yCenter + this.radius >= paddleTop && this.yCenter - this.radius <= paddleBottom)
// 				{
// 					this.left = this.board.getWidth() - paddle.getWidth() - this.size;
// 					this.xCenter = this.left + this.radius;
// 					this.element.style.left = `${this.left}px`;
// 					this.vector.setX(this.vector.X() * -1);
// 					let collisionPoint = this.yCenter - (paddleTop + paddle.getHeight() / 2);
// 					collisionPoint /= paddle.getHeight() / 2.5;
// 					this.vector.normalise();
// 					this.vector.setY(collisionPoint);
// 					this.vector.setNorm(this.speed);
// 					this.speed += 0.2;
// 					this.lastTouch = "right";
// 					this.bounces++;
// 					paddle.addBouncesAsBoosted();
// 					if (paddle.isBoosted() != undefined && paddle.getBouncesAsBoosted() >= 3)
// 						paddle.resetBoost();
// 				}
// 				else if (this.left + this.size > this.board.getWidth())
// 				{
// 					bonus?.disappear();
// 					this.reset(paddleScores, "right", paddles, mode);
// 				}
// 				else
// 					this.justMove();
// 			}
// 			else if (paddle.getPosition() === "top")
// 			{
// 				if (this.top + this.vector.Y() < paddle.getHeight() && this.xCenter + this.radius >= paddleLeft && this.xCenter - this.radius <= paddleRight)
// 				{
// 					this.top = paddle.getHeight();
// 					this.yCenter = this.top + this.radius;
// 					this.element.style.top = `${this.top}px`;
// 					this.vector.setY(this.vector.Y() * -1);
// 					let collisionPoint = this.xCenter - (paddleLeft + paddle.getWidth() / 2);
// 					collisionPoint /= paddle.getWidth() / 2.5;
// 					this.vector.normalise();
// 					this.vector.setX(collisionPoint);
// 					this.vector.setNorm(this.speed);
// 					this.speed += 0.2;
// 					this.lastTouch = "top";
// 					this.bounces++;
// 					paddle.addBouncesAsBoosted();
// 					if (paddle.isBoosted() != undefined && paddle.getBouncesAsBoosted() >= 3)
// 						paddle.resetBoost();
// 				}
// 				else if (this.top < 0)
// 				{
// 					bonus?.disappear();
// 					this.reset(paddleScores, "top", paddles, mode);
// 				}
// 				else
// 					this.justMove();
// 			}
// 			else if (paddle.getPosition() === "bottom")
// 			{
// 				if (this.top + this.size + this.vector.Y() > this.board.getHeight() - paddle.getHeight() && this.xCenter + this.radius >= paddleLeft && this.xCenter - this.radius <= paddleRight)
// 				{
// 					this.top = this.board.getHeight() - paddle.getHeight() - this.size;
// 					this.yCenter = this.top + this.radius;
// 					this.element.style.top = `${this.top}px`;
// 					this.vector.setY(this.vector.Y() * -1);
// 					let collisionPoint = this.xCenter - (paddleLeft + paddle.getWidth() / 2);
// 					collisionPoint /= paddle.getWidth() / 2.5;
// 					this.vector.normalise();
// 					this.vector.setX(collisionPoint);
// 					this.vector.setNorm(this.speed);
// 					this.speed += 0.2;
// 					this.lastTouch = "bottom";
// 					this.bounces++;
// 					paddle.addBouncesAsBoosted();
// 					if (paddle.isBoosted() != undefined && paddle.getBouncesAsBoosted() >= 3)
// 						paddle.resetBoost();
// 				}
// 				else if (this.top + this.size > this.board.getHeight())
// 				{
// 					bonus?.disappear();
// 					this.reset(paddleScores, "bottom", paddles, mode);
// 				}
// 				else
// 					this.justMove();
// 			}
// 		}
// 		return this.bounces;
// 	}

// 	collision(): void {
// 		if (this.gameMode === "1v1" || this.gameMode === "survival")
// 		{
// 			if (this.yCenter - this.radius < 0)
// 			{
// 				this.vector.setY(this.vector.Y() * -1);
// 				this.top = 0;
// 				this.yCenter = this.top + this.radius;
// 				this.element.style.top = `${this.top}`;
// 			}
// 			if (this.yCenter + this.radius > this.board.getHeight())
// 			{
// 				this.vector.setY(this.vector.Y() * -1);
// 				this.top = this.board.getHeight() - this.size;
// 				this.yCenter = this.top + this.radius;
// 				this.element.style.top = `${this.top}`;
// 			}
// 		}
// 	}

// 	reset(paddleScores: (HTMLElement | undefined)[], loser: "right" | "left" | "top" | "bottom", paddles: (Paddle | Bot)[], mode: "1v1" | "1v1v1v1" | "survival"): void {
// 		let scores = {
// 			"left": paddleScores[0],
// 			"right": paddleScores[1],
// 			"top": paddleScores[2],
// 			"bottom": paddleScores[3],
// 		};
// 		this.bounces = 0;
// 		this.top = this.board.getHeight() / 2 - this.radius / 2;
// 		this.left = this.board.getWidth() / 2 - this.radius / 2;
// 		this.xCenter = this.left + this.radius;
// 		this.yCenter = this.top + this.radius;
// 		if (this.lastTouch !== undefined)
// 		{
// 			let scorer = scores[this.lastTouch] as HTMLElement;
// 			let tmpScore = parseInt(scorer.textContent || "0", 10);
// 			if (mode === "survival" && scorer.id === "left-score")
// 				scorer.innerHTML = String(tmpScore + 5);
// 			else
// 				scorer.innerHTML = String(++tmpScore);
// 		}
// 		switch (loser)
// 		{
// 			case "left":
// 				this.vector.setVector([-1, Math.random() / 4 - 0.125]);
// 				break;
// 			case "right":
// 				this.vector.setVector([1, Math.random() / 4 - 0.125]);
// 				break;
// 			case "top":
// 				this.vector.setVector([Math.random() / 4 - 0.125, -1]);
// 				break;
// 			case "bottom":
// 				this.vector.setVector([Math.random() / 4 - 0.125, 1]);
// 				break;
// 			default:
// 				this.vector.setVector([1, Math.random() / 4 - 0.125]);
// 				break;
// 		}
// 		this.speed = this.resetSpeed;
// 		this.vector.setNorm(this.speed);
// 		this.element.style.left = `${this.left}px`;
// 		this.element.style.top = `${this.top}px`;
// 		for (let paddle of paddles)
// 			paddle?.reset(this.board);
// 		this.bounces = -1;
// 		this.lastTouch = undefined;
// 	}
// }