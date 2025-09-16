// class Vector
// {
// 	private x: number;
// 	private y: number;

// 	constructor(x: number, y: number) {
// 		this.x = x;
// 		this.y = y;
// 	}

// 	X() { return this.x; }
// 	Y() { return this.y; }
	
// 	getNorm() { return Math.sqrt(this.x**2 + this.y**2); }

// 	normalise() { this.x /= this.getNorm(); this.y /= this.getNorm(); }

// 	setNorm(norm: number) { this.normalise(); this.x *= norm; this.y *= norm; }
// 	setX(x: number) { this.x = x; }
// 	setY(y: number) { this.y = y; }
// 	setVector(vector: number[]) { this.x = vector[0]; this.y = vector[1]; }

// 	applyOn(x: number, y: number) { return [x + this.x, y + this.y]; }
// }