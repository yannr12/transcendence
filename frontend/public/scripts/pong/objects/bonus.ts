// abstract class Bonus
// {
// 	private type: string;
// 	private element: HTMLElement;
// 	private top: number;
// 	private left: number;
// 	private size: number;

// 	constructor(type: string, element: HTMLElement, board: Board) {
// 		this.type = type;
// 		this.element = element;
// 		this.size = 60;
// 		this.top = board.getHeight() / 2 - this.size / 2;
// 		this.left = board.getWidth() / 2 - this.size / 2;
// 		this.element.style.top = `${this.top}px`;
// 		this.element.style.left = `${this.left}px`;
// 		this.element.style.display = "none";
// 		if (this.type === "paddle-speed-bonus")
// 			this.element.style.background = "yellow";
// 		else
// 			this.element.style.background = "blue";
// 	}

// 	getType() { return this.type; }
// 	getElement() { return this.element; }
// 	getTop() { return this.top; }
// 	getBottom() { return this.top + this.size; }
// 	getLeft() { return this.left; }
// 	getRight() { return this.left + this.size; }
// 	getSize() { return this.size; }
	
// 	isDefined() { return this.element.style.display === "block"; }

// 	appear(): void { this.element.style.display = "block"; }

// 	disappear(): void { this.element.style.display = "none"; }

// 	abstract activate(paddle: Paddle | Bot): void;
// }

// class PaddleSpeedBonus extends Bonus
// {
// 	private defaultSpeed?: number;

// 	constructor(element: HTMLElement, board: Board) {
// 		super("paddle-speed-bonus", element, board);
// 	}

// 	activate(paddle: Paddle | Bot): void {
// 		this.defaultSpeed = paddle.getSpeed();
// 		paddle.setSpeed(this.defaultSpeed * 2);
// 		paddle.setBoosted("speed");
// 		paddle.resetBouncesAsBoosted();
// 	}
// }

// class PaddleSizeBonus extends Bonus
// {
// 	private defaultSize?: number;

// 	constructor(element: HTMLElement, board: Board) {
// 		super("paddle-size-bonus", element, board);
// 	}

// 	activate(paddle: Paddle | Bot): void {
// 		paddle.setBoosted("size");
// 		if (paddle.getPosition() === "right" || paddle.getPosition() === "left")
// 			this.defaultSize = paddle.getHeight();
// 		else
// 			this.defaultSize = paddle.getWidth();
// 		paddle.setSize(this.defaultSize * 1.5);
// 		paddle.resetBouncesAsBoosted();
// 	}
// }