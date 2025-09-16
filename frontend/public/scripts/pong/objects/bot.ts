// class Bot extends Paddle
// {
// 	private difficulty: 1 | 2 | 3;
// 	private anticipated: number;
 
// 	constructor(paddle: HTMLElement, board: Board, position: "left" | "right" | "top" | "bottom", difficulty: 1 | 2 | 3 = 1, name: string) {
// 		super(paddle, board, position, name);
// 		this.setType("bot");
// 		this.difficulty = difficulty;
// 		this.anticipated = 0;
// 	}

// 	private getIntersec(vector1: Vector, position1: number[], board: Board, border: "left" | "right" | "top" | "bottom") {
// 		let foos = {
// 			"left": [1e100, 0],
// 			"right": [1e100 / board.getWidth(), -1e100],
// 			"bottom": [0, board.getHeight()],
// 			"top": [0, 0],
// 		};
// 		let fooBall = [vector1.Y() / vector1.X(), -position1[0] * (vector1.Y() / vector1.X()) + position1[1]];
// 		if (fooBall[0] - foos[border][0] === 0)
// 			return undefined;
// 		let xIntersec = (foos[border][1] - fooBall[1]) / (fooBall[0] - foos[border][0]);
// 		return ([xIntersec, fooBall[0] * xIntersec + fooBall[1]]);
// 	}

// 	private dist2points(a: number[] | undefined, b: number[] | undefined) {
// 		if (a === undefined)
// 			return Math.sqrt(b![0]**2 + b![1]**2);
// 		else if (b === undefined)
// 			return Math.sqrt(a![0]**2 + a![1]**2);
// 		let vector = new Vector(a![0] - b![0], a![1] - b![1]);
// 		return vector.getNorm();
// 	}

// 	private goMiddle(board: Board, position: "left" | "right" | "top" | "bottom") {
// 		if (position === "left" || position === "right")
// 		{
// 			if (this.getTop()! + this.getHeight() / 2 > board.getHeight() / 2 + 10)
// 				this.majPos(this.getTop()! - this.getSpeed());
// 			else if (this.getTop()! + this.getHeight() / 2 < board.getHeight() / 2 - 10)
// 				this.majPos(this.getTop()! + this.getSpeed());
// 		}
// 		else
// 		{
// 			if (this.getLeft()! + this.getWidth() / 2 > board.getWidth() / 2 + 10)
// 				this.majPos(this.getLeft()! - this.getSpeed())
// 			else if (this.getLeft()! + this.getWidth() / 2 < board.getWidth() / 2 - 10)
// 				this.majPos(this.getLeft()! + this.getSpeed());
// 		}
// 	}

// 	private computeBounces(ballVector: Vector, ballX: number, ballY: number, board: Board, border: "top" | "bottom" | "left" | "right", mode: "1v1" | "1v1v1v1")
// 	{
// 		let intersecNeutralBorder = this.getIntersec(ballVector, [ballX, ballY], board, border);
// 		let intersecPosition = this.getIntersec(ballVector, [ballX, ballY], board, this.getPosition());
// 		if (mode === "1v1")
// 		{
// 			if (this.dist2points([ballX, ballY], intersecNeutralBorder!) < this.dist2points([ballX, ballY], intersecPosition!) && this.anticipated++ < this.difficulty)
// 				return this.move1v1(intersecNeutralBorder![0], intersecNeutralBorder![1], new Vector(ballVector.X(), -ballVector.Y()), board);
// 			else
// 				this.anticipated = 0;
// 		}
// 		if (this.dist2points([ballX, ballY], intersecNeutralBorder!) > this.dist2points([ballX, ballY], intersecPosition!))
// 		{
// 			if (this.getPosition() === "left" || this.getPosition() === "right")
// 			{
// 				if (this.getTop()! + this.getHeight() / 2 < intersecPosition![1] - 10)
// 					this.majPos(Math.min(board.getHeight() - this.getHeight(), this.getTop()! + this.getSpeed()));
// 				else if (this.getTop()! + this.getHeight() / 2 > intersecPosition![1] + 10)
// 					this.majPos(Math.max(0, this.getTop()! - this.getSpeed()));
// 			}
// 			else
// 			{
// 				if (this.getLeft()! + this.getWidth() / 2 < intersecPosition![0] - 10)
// 					this.majPos(Math.min(board.getWidth() - this.getWidth(), this.getLeft()! + this.getSpeed()));
// 				else if (this.getLeft()! + this.getWidth() / 2 > intersecPosition![0] + 10)
// 					this.majPos(Math.max(0, this.getLeft()! - this.getSpeed()));
// 			}
// 		}
// 		else
// 			this.goMiddle(board, this.getPosition());
// 	}

// 	move1v1(ballX: number, ballY: number, ballVector: Vector, board: Board): void {
// 		if (ballVector.X() < 0 && this.getPosition() === "right")
// 			return this.goMiddle(board, "right");
// 		if (ballVector.X() > 0 && this.getPosition() === "left")
// 			return this.goMiddle(board, "left");
// 		if (ballVector.Y() < 0)
// 			this.computeBounces(ballVector, ballX, ballY, board, "top", "1v1");
// 		else if (ballVector.Y() > 0)
// 			this.computeBounces(ballVector, ballX, ballY, board, "bottom", "1v1");
// 		else
// 		{
// 			if (this.getTop()! + this.getHeight() / 2 < ballY - 10)
// 				this.majPos(Math.min(board.getHeight() - this.getHeight(), this.getTop()! + this.getSpeed()))
// 			else if (this.getTop()! + this.getHeight() / 2 > ballY + 10)
// 				this.majPos(Math.max(0, this.getTop()! - this.getSpeed()));
// 		}
// 	}

// 	move4players(ballX: number, ballY: number, ballVector: Vector, board: Board): void {
// 		if (ballVector.X() < 0 && this.getPosition() === "right")
// 			return this.goMiddle(board, "right");
// 		if (ballVector.X() > 0 && this.getPosition() === "left")
// 			return this.goMiddle(board, "left");
// 		if (ballVector.Y() < 0 && this.getPosition() === "bottom")
// 			return this.goMiddle(board, "bottom");
// 		if (ballVector.Y() > 0 && this.getPosition() === "top")
// 			return this.goMiddle(board, "top");
// 		if (ballVector.Y() < 0 && (this.getPosition() === "left" || this.getPosition() === "right"))
// 			this.computeBounces(ballVector, ballX, ballY, board, "top", "1v1v1v1");
// 		else if (ballVector.Y() > 0 && (this.getPosition() === "left" || this.getPosition() === "right"))
// 			this.computeBounces(ballVector, ballX, ballY, board, "bottom", "1v1v1v1");
// 		else if (ballVector.X() < 0 && (this.getPosition() === "top" || this.getPosition() === "bottom"))
// 			this.computeBounces(ballVector, ballX, ballY, board, "left", "1v1v1v1");
// 		else if (ballVector.X() > 0 && (this.getPosition() === "top" || this.getPosition() === "bottom"))
// 			this.computeBounces(ballVector, ballX, ballY, board, "right", "1v1v1v1");
// 		else
// 		{
// 			if (this.getPosition() === "left" || this.getPosition() === "right")
// 			{
// 				if (this.getTop()! + this.getHeight() / 2 < ballY - 10)
// 					this.majPos(Math.min(board.getHeight() - this.getHeight(), this.getTop()! + this.getSpeed()))
// 				else if (this.getTop()! + this.getHeight() / 2 > ballY + 10)
// 					this.majPos(Math.max(0, this.getTop()! - this.getSpeed()));
// 			}
// 			else
// 			{
// 				if (this.getLeft()! + this.getWidth() / 2 < ballX - 10)
// 					this.majPos(Math.min(board.getWidth() - this.getWidth(), this.getLeft()! + this.getSpeed()))
// 				else if (this.getLeft()! + this.getWidth() / 2 > ballX + 10)
// 					this.majPos(Math.max(0, this.getLeft()! - this.getSpeed()));
// 			}
// 		}
// 	}
// }