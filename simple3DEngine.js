let globalTrigons = []

class Point {
    constructor(x, y, z){
        this.x = x
        this.y = y
        this.z = z 
    }

    rotateZ(pivot, theta) {
        const rad = theta * Math.PI / 180;
        const cosTheta = Math.cos(rad);
        const sinTheta = Math.sin(rad);

        // Translate point to the pivot
        this.x -= pivot.x;
        this.y -= pivot.y;

        // Perform rotation
        const xNew = this.x * cosTheta - this.y * sinTheta;
        const yNew = this.x * sinTheta + this.y * cosTheta;

        // Translate point back
        this.x = xNew + pivot.x;
        this.y = yNew + pivot.y;
    }

    // Rotate around the X-axis by phi degrees at a pivot point
    rotateX(pivot, phi) {
        const rad = phi * Math.PI / 180;
        const cosPhi = Math.cos(rad);
        const sinPhi = Math.sin(rad);

        // Translate point to the pivot
        this.z -= pivot.z;
        this.y -= pivot.y;

        // Perform rotation
        const zNew = this.z * cosPhi - this.y * sinPhi;
        const yNew = this.z * sinPhi + this.y * cosPhi;

        // Translate point back
        this.z = zNew + pivot.z;
        this.y = yNew + pivot.y;
    }

    // Rotate around the Y-axis by psi degrees at a pivot point
    rotateY(pivot, psi) {
        const rad = psi * Math.PI / 180;
        const cosPsi = Math.cos(rad);
        const sinPsi = Math.sin(rad);

        // Translate point to the pivot
        this.x -= pivot.x;
        this.z -= pivot.z;

        // Perform rotation
        const xNew = this.x * cosPsi + this.z * sinPsi;
        const zNew = -this.x * sinPsi + this.z * cosPsi;

        // Translate point back
        this.x = xNew + pivot.x;
        this.z = zNew + pivot.z;
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
    
        const v0 = [x2 - x1, y2 - y1, z2 - z1];
        const v1 = [x3 - x1, y3 - y1, z3 - z1];
        const lineDirection = [x5 - x4, y5 - y4, z5 - z4];
        const p1ToPoint = [x4 - x1, y4 - y1, z4 - z1];

        // Calculate the normal of the triangle using the cross product
        const n = [
            v0[1] * v1[2] - v0[2] * v1[1],
            v0[2] * v1[0] - v0[0] * v1[2],
            v0[0] * v1[1] - v0[1] * v1[0]
        ];

        // Calculate the denominator, which is the dot product of the normal and the line's direction
        const denominator = n[0] * lineDirection[0] + n[1] * lineDirection[1] + n[2] * lineDirection[2];

        // Check if the line is parallel to the plane (denominator is 0)
        if (Math.abs(denominator) < 1e-10) {
            return false;  // No intersection, line is parallel to the triangle
        }

        // Compute t for the line equation
        const t = -(n[0] * p1ToPoint[0] + n[1] * p1ToPoint[1] + n[2] * p1ToPoint[2]) / denominator;

        // Calculate the intersection point
        const x0 = x4 + t * lineDirection[0];
        const y0 = y4 + t * lineDirection[1];
        const z0 = z4 + t * lineDirection[2];

        // Check if the intersection point is inside the triangle using barycentric coordinates
        const u = [x0 - x1, y0 - y1, z0 - z1];
        const dot00 = v0[0] * v0[0] + v0[1] * v0[1] + v0[2] * v0[2];
        const dot01 = v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
        const dot02 = v0[0] * u[0] + v0[1] * u[1] + v0[2] * u[2];
        const dot11 = v1[0] * v1[0] + v1[1] * v1[1] + v1[2] * v1[2];
        const dot12 = v1[0] * u[0] + v1[1] * u[1] + v1[2] * u[2];

        const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
        const a = (dot11 * dot02 - dot01 * dot12) * invDenom;
        const b = (dot00 * dot12 - dot01 * dot02) * invDenom;
        const c = 1 - a - b;

        // Check if point is in triangle
        if (a >= 0 && a <= 1 && b >= 0 && b <= 1 && c >= 0 && c <= 1) {
            return new Point(x0, y0, z0) ;  // Intersection point is inside the triangle
        } else {
            return false;  // Intersection point is outside the triangle
        }
    }
}

class Ray{
    constructor(start, end){
        this.start = start
        this.end = end
    }

    intersections = []

    appendIntersection = (point) => {
        this.intersections.push([point, Math.sqrt((this.start.x - point.x)*(this.start.x - point.x)  +  (this.start.y - point.y)*(this.start.y - point.y)  +  (this.start.z - point.z)*(this.start.z - point.z))])
    }

    get toClosestIntersection(){
        let min = Infinity
        for(let i in this.intersections){
            if (this.intersections[i][1] < min) min = this.intersections[i][1]
        }
        if (min == Infinity){
            return Math.sqrt((this.start.x - this.end.x)*(this.start.x - this.end.x)  +  (this.start.y - this.end.y)*(this.start.y - this.end.y)  +  (this.start.z - this.end.z)*(this.start.z - this.end.z))
        }
        return min
    } 

    get colorKof (){
        let size = Math.sqrt((this.start.x - this.end.x)*(this.start.x - this.end.x)  +  (this.start.y - this.end.y)*(this.start.y - this.end.y)  +  (this.start.z - this.end.z)*(this.start.z - this.end.z))
        let dist = this.toClosestIntersection
        return 1-dist/size
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
    constructor(pos, rot, resolutionX, resolutionY, FOV, dist){
        this.x = pos.x
        this.y = pos.y
        this.z = pos.z
        this.rot = rot
        this.FOV = FOV
        this.dist = dist
        this.resolutionX = resolutionX
        this.resolutionY = resolutionY
    }

    raysMap = []

    generateRays = () => {
        this.raysMap = []
        for (let y = 0; y < this.resolutionY; y++){
            let xMap = []
            for (let x = 0; x < this.resolutionX; x++){
                xMap.push(new Ray(new Point(this.x, this.y, this.z), new Point(this.x+this.dist, this.y + (this.resolutionY/(-2) + y)*this.FOV, this.z + (this.resolutionX/(-2) + x)*this.FOV)))
            }
            this.raysMap.push(xMap)
        }
    }

    findIntersections = () => {
        this.raysMap.forEach((rayY, i) => {
            rayY.forEach((ray, j) => {
                globalTrigons.forEach(trigon => {
                    let res = trigon.intersectionWithEdge(ray)
                    if (res) {
                        this.raysMap[i][j].appendIntersection(res)
                    }
                })
            })
        });
    }

    render = (ctx) =>{
        this.generateRays()
        this.findIntersections()
        ctx.clearRect(0, 0, this.resolutionX, this.resolutionY)
        for (let y = 0; y < this.resolutionY; y++){
            for (let x = 0; x < this.resolutionX; x++){
                let color = `rgb(${256*this.raysMap[y][x].colorKof}, ${256*this.raysMap[y][x].colorKof}, ${256*this.raysMap[y][x].colorKof})`
                ctx.fillStyle = color
                ctx.fillRect(x, y, 1, 1)
            }
        }
    }
}

class Cube {
    constructor(pos, side){
        this.x = pos.x
        this.y = pos.y
        this.z = pos.z
        this.side = side

        let halfSide = side/2

        this.vertices = [
            new Point(this.x+-halfSide, this.y+-halfSide, this.z+-halfSide), // 0: left-bottom-back
            new Point(this.x+halfSide, this.y+-halfSide, this.z+-halfSide),  // 1: right-bottom-back
            new Point(this.x+halfSide, this.y+halfSide, this.z+-halfSide),   // 2: right-top-back
            new Point(this.x+-halfSide, this.y+halfSide, this.z+-halfSide),  // 3: left-top-back
            new Point(this.x+-halfSide, this.y+-halfSide, this.z+halfSide),  // 4: left-bottom-front
            new Point(this.x+halfSide, this.y+-halfSide, this.z+halfSide),   // 5: right-bottom-front
            new Point(this.x+halfSide, this.y+halfSide, this.z+halfSide),    // 6: right-top-front
            new Point(this.x+-halfSide, this.y+halfSide, this.z+halfSide)    // 7: left-top-front
        ];

        this.defineTrigons()
    }

    defineTrigons = () => {
        this.trigons = [
            new Trigon(this.vertices[0], this.vertices[1], this.vertices[2]),
            new Trigon(this.vertices[0], this.vertices[2], this.vertices[3]),
            // Front face
            new Trigon(this.vertices[4], this.vertices[6], this.vertices[5]),
            new Trigon(this.vertices[4], this.vertices[7], this.vertices[6]),
            // Left face
            new Trigon(this.vertices[0], this.vertices[3], this.vertices[7]),
            new Trigon(this.vertices[0], this.vertices[7], this.vertices[4]),
            // Right face
            new Trigon(this.vertices[1], this.vertices[5], this.vertices[6]),
            new Trigon(this.vertices[1], this.vertices[6], this.vertices[2]),
            // Top face
            new Trigon(this.vertices[3], this.vertices[2], this.vertices[6]),
            new Trigon(this.vertices[3], this.vertices[6], this.vertices[7]),
            // Bottom face
            new Trigon(this.vertices[0], this.vertices[4], this.vertices[5]),
            new Trigon(this.vertices[0], this.vertices[5], this.vertices[1])
        ]

        globalTrigons.push(...this.trigons)
    }

    rotateX = (deg) => {
        globalTrigons = []
        this.vertices.forEach(ver => {
            ver.rotateX(new Point (this.x, this.y, this.z), deg)
        });
        this.defineTrigons()
    }
    rotateY = (deg) => {
        globalTrigons = []
        this.vertices.forEach(ver => {
            ver.rotateY(new Point (this.x, this.y, this.z), deg)
        });
        this.defineTrigons()
    }
    rotateZ = (deg) => {
        globalTrigons = []
        this.vertices.forEach(ver => {
            ver.rotateZ(new Point (this.x, this.y, this.z), deg)
        });
        this.defineTrigons()
    }
}

const cube = new Cube(new Point(60,0,0), 80)
cube.rotateZ(45)
cube.rotateY(45)

let canvas = document.getElementById('canvas3D')
let ctx = canvas.getContext('2d')

let cam = new Camera(new Point(-100, 0, 0), 0, 600, 500,0.4, 200)

cam.render(ctx)

setInterval(()=>{
    cube.rotateZ(3)
    cube.rotateY(3)
    cam.render(ctx)
},30)