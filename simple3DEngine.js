
const globalTrigons = [new Trigon(new Point(1, 1, 1), new Point(1, 1, 3), new Point(1, 0, 1))]

class Point {
    constructor(x, y, z){
        this.x = x
        this.y = y
        this.z = z 
    }
}

class Edge {
    constructor(start, end){
        this.start = start
        this.end = end 
    }
}

class Trigon {
    constructor(a, b, c){
        this.a = a
        this.b = b
        this.c = c
    }

    intersectionWithEdge = (edge) => {
        let {a: {x: x1, y: y1, z: z1}, b: {x: x2, y: y2, z: z2}, c: {x: x3, y: y3, z: z3}} = this
        let {start: {x: x4, y: y4, z: z4}, end: {x: x5, y: y5, z: z5}} = edge

        const v0 = [x3 - x1, y3 - y1, z3 - z1];
        const v1 = [x2 - x1, y2 - y1, z2 - z1];
        const v2 = [x4 - x1, y4 - y1, z4 - z1];

        const d = [x5 - x4, y5 - y4, z5 - z4];

        const n = [
            v1[1] * v0[2] - v1[2] * v0[1],
            v1[2] * v0[0] - v1[0] * v0[2],
            v1[0] * v0[1] - v1[1] * v0[0]
        ];

        const dot = n[0] * d[0] + n[1] * d[1] + n[2] * d[2];
        if (dot === 0) {
            return false;
        }

        const t = -(n[0] * v2[0] + n[1] * v2[1] + n[2] * v2[2]) / dot;

        const p = [x4 + d[0] * t, y4 + d[1] * t, z4 + d[2] * t];

        const edge0 = [x2 - x1, y2 - y1, z2 - z1];
        const edge1 = [x3 - x2, y3 - y2, z3 - z2];
        const edge2 = [x1 - x3, y1 - y3, z1 - z3];
        const vp0 = [p[0] - x1, p[1] - y1, p[2] - z1];
        const vp1 = [p[0] - x2, p[1] - y2, p[2] - z2];
        const vp2 = [p[0] - x3, p[1] - y3, p[2] - z3];

        const c0 = edge0[1] * vp0[2] - edge0[2] * vp0[1];
        const c1 = edge1[1] * vp1[2] - edge1[2] * vp1[1];
        const c2 = edge2[1] * vp2[2] - edge2[2] * vp2[1];

        if ((n[0] * c0 + n[1] * c1 + n[2] * c2) >= 0) {
            return new Point(p[0], p[1], p[2]);
        } else {
            return false;
        }   
    }
}

class Rotation {
    constructor(x, y, z){
        this.x = x
        this.y = y
        this.z = z 
    }
}

class Camera{
    constructor(pos, rot, resolutionX, resolutionY){
        this.x = pos.x
        this.y = pos.y
        this.z = pos.z
        this.rot = rot
        this.resolutionX = resolutionX
        this.resolutionY = resolutionY
    }

    raysMap = []

    generateRays = () => {
        for (let y = 0; y < this.resolutionY; y++){
            let xMap = []
            for (let x = 0; x < this.resolutionX; x++){
                xMap.push(new Edge(new Point(this.x, this.y, this.z), ))
            }
        }
    }
}
