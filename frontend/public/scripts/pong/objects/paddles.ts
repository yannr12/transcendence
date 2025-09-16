// class Paddle
// {
//     private element: HTMLElement;
//     private top?: number;
//     private bottom?: number;
// 	private left?: number;
// 	private right?: number;
// 	private height: number;
// 	private width: number;
// 	private position: "left" | "right" | "top" | "bottom";
// 	private speed: number;
// 	private boosted?: string;
// 	private bouncesAsBoosted: number;
// 	private type: "paddle" | "bot";
// 	private name: string;

// 	private defaultSpeed: number;
// 	private defaultWidth: number;
// 	private defaultHeight: number;

// 	constructor(element: HTMLElement, board: Board, position: "left" | "right" | "top" | "bottom", name: string) {
// 		this.type = "paddle";
// 		this.bouncesAsBoosted = 0;
// 		this.element = element;
// 		this.position = position;
// 		this.height = element.offsetHeight;
// 		this.defaultHeight = element.offsetHeight;
// 		this.width = element.offsetWidth;
// 		this.defaultWidth = element.offsetWidth;
// 		this.speed = 5;
// 		this.defaultSpeed = 5;
// 		this.boosted = undefined;
// 		this.reset(board);
// 		this.element.style.width = `${this.width}px`;
// 		this.element.style.height = `${this.height}px`;
// 		this.name = name;
// 	}

// 	getElement(): HTMLElement { return this.element; }
// 	getTop(): number | undefined { return this.top; }
// 	getBottom(): number | undefined { return this.bottom; }
// 	getLeft(): number | undefined { return this.left; }
// 	getRight(): number | undefined { return this.right; }
// 	getHeight(): number { return this.height; }
// 	getWidth(): number { return this.width; }
// 	getPosition() { return this.position; }
// 	getSpeed() { return this.speed; }
// 	getType() { return this.type; }
// 	getName() { return this.name; }
// 	getBouncesAsBoosted() { return this.bouncesAsBoosted; }

// 	addBouncesAsBoosted() { this.bouncesAsBoosted++; }

// 	resetBouncesAsBoosted() { this.bouncesAsBoosted = 0; }

// 	resetBoost() {
// 		if (this.boosted === "speed")
// 		{
// 			this.speed = this.defaultSpeed;
// 			this.boosted = undefined;
// 		}
// 		else if (this.boosted === "size")
// 		{
// 			let diffWidth = Math.abs(this.defaultWidth - this.width);
// 			let diffHeight = Math.abs(this.defaultHeight - this.height);
// 			if (this.top != undefined && this.bottom != undefined)
// 			{
// 				this.top += diffHeight / 2;
// 				this.bottom -= diffHeight / 2;
// 				this.element.style.top = `${this.top}px`;
// 				this.element.style.bottom = `${this.bottom}px`;
// 			}
// 			if (this.left != undefined && this.right != undefined)
// 			{
// 				this.left += diffWidth / 2;
// 				this.right -= diffWidth / 2;
// 				this.element.style.left = `${this.left}px`;
// 				this.element.style.right = `${this.right}px`;
// 			}
// 			this.width = this.defaultWidth;
// 			this.height = this.defaultHeight;
// 			this.element.style.width = `${this.width}px`;
// 			this.element.style.height = `${this.height}px`;
// 			this.boosted = undefined;
// 		}
// 		this.bouncesAsBoosted = 0;
// 	}

// 	isBoosted() { return this.boosted; }

// 	setSpeed(x: number) { this.speed = x; }
// 	setBoosted(boosted: "speed" | "size" | undefined) { this.boosted = boosted; }
// 	setType(type: "paddle" | "bot") { this.type = type; }


// 	setSize(size: number) {
// 		if (this.position === "right" || this.position === "left")
// 		{
// 			let x = this.getHeight() - size;
// 			if (this.top !== undefined && this.bottom)
// 			{
// 				if (this.top - x / 2 >= 0 && this.bottom + x / 2 <= board.getHeight())
// 				{
// 					this.top -= x / 2;
// 					this.bottom += x / 2;
// 					this.element.style.top = `${this.top}px`;
// 					this.element.style.bottom = `${this.bottom}px`;
// 				}
// 				else if (this.top - x / 2 >= 0)
// 				{
// 					this.top -= x / 2;
// 					this.element.style.top = `${this.top}px`;
// 				}
// 				else
// 				{
// 					this.bottom += x / 2;
// 					this.element.style.bottom = `${this.bottom}px`;
// 				}
// 				this.height = size;
// 				this.element.style.height = `${this.height}px`;
// 			}
// 		}
// 		else
// 		{
// 			let x = this.getWidth() - size;
// 			if (this.left !== undefined && this.right)
// 			{
// 				if (this.left - x / 2 >= 0 && this.right + x / 2 <= board.getWidth())
// 				{
// 					this.left -= x / 2;
// 					this.right += x / 2;
// 					this.element.style.left = `${this.left}px`;
// 					this.element.style.right = `${this.right}px`;
// 				}
// 				else if (this.left - x / 2 >= 0)
// 				{
// 					this.left -= x / 2;
// 					this.element.style.left = `${this.left}px`;
// 				}
// 				else
// 				{
// 					this.right += x / 2;
// 					this.element.style.right = `${this.right}px`;
// 				}
// 				this.width = size;
// 				this.element.style.width = `${this.width}px`;
// 			}
// 		}
// 	}

// 	majPos(x: number): void {
// 		if (this.position === "left" || this.position === "right")
// 		{
// 			this.element.style.top = `${x}px`;
// 			this.top = x;
// 			this.bottom = x + this.height;
// 		}
// 		else
// 		{
// 			this.element.style.left = `${x}px`;
// 			this.left = x;
// 			this.right = this.left + this.width;
// 		}
// 	}

// 	move4players(xBall: number, yBall: number, vectorBall: Vector, board: Board) {}
// 	move1v1(xBall: number, yBall: number, vectorBall: Vector, board: Board) {}

// 	reset(board: Board) {
// 		switch (this.position)
// 		{
// 			case "left":
// 				this.top = (board.getHeight() - this.height) / 2;
// 				this.bottom = this.top + this.height;
// 				this.left = 0;
// 				this.element.style.top = `${this.top}px`;
// 				this.element.style.bottom = `${this.bottom}px`;
// 				this.element.style.left = `${this.left}px`;
// 				break;
// 			case "right":
// 				this.top = (board.getHeight() - this.height) / 2;
// 				this.bottom = this.top + this.height;
// 				this.right = 0;
// 				this.element.style.top = `${this.top}px`;
// 				this.element.style.bottom = `${this.bottom}px`;
// 				this.element.style.right = `${this.right}px`;
// 				break;
// 			case "top":
// 				this.left = (board.getWidth() - this.width) / 2;
// 				this.right = this.left + this.width;
// 				this.top = 0;
// 				this.element.style.left = `${this.left}px`;
// 				this.element.style.right = `${this.right}px`;
// 				this.element.style.top = `${this.top}px`;
// 				break;
// 			case "bottom":
// 				this.left = (board.getWidth() - this.width) / 2;
// 				this.right = this.left + this.width;
// 				this.bottom = 0;
// 				this.element.style.left = `${this.left}px`;
// 				this.element.style.right = `${this.right}px`;
// 				this.element.style.bottom = `${this.bottom}px`;
// 				break;
// 		}
// 	}
// }