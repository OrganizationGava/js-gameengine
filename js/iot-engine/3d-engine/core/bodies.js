export class vec3d {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

export class triangle {
    constructor(p1 = new vec3d(), p2 = new vec3d(), p3 = new vec3d()) {
        this.p = [p1, p2, p3];
    }
}

export class mesh {
    constructor() {
        this.tris = [];
    }
}

export class mat4x4 {
    constructor() {
        this.m = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
    }
}