// Point: [x, y, z]
// Edge: [start: point, end: point]
// Trigon: [A: point, B: point, C: point]
// Rotation: [x, y, z] in rads

const globalFigures = []

class Figure{
    
}

class Cube extends Figure{
    constructor(pos, side){
        super()
        this.pos = pos
        this.side = side

        let halfSide = side/2

        this.vertices = [
            [this.pos[0]+-halfSide, this.pos[1]+-halfSide, this.pos[2]+-halfSide], // 0: left-bottom-back
            [this.pos[0]+halfSide, this.pos[1]+-halfSide, this.pos[2]+-halfSide],  // 1: right-bottom-back
            [this.pos[0]+halfSide, this.pos[1]+halfSide, this.pos[2]+-halfSide],   // 2: right-top-back
            [this.pos[0]+-halfSide, this.pos[1]+halfSide, this.pos[2]+-halfSide],  // 3: left-top-back
            [this.pos[0]+-halfSide, this.pos[1]+-halfSide, this.pos[2]+halfSide],  // 4: left-bottom-front
            [this.pos[0]+halfSide, this.pos[1]+-halfSide, this.pos[2]+halfSide],   // 5: right-bottom-front
            [this.pos[0]+halfSide, this.pos[1]+halfSide, this.pos[2]+halfSide],    // 6: right-top-front
            [this.pos[0]+-halfSide, this.pos[1]+halfSide, this.pos[2]+halfSide]    // 7: left-top-front
        ];

        this.trigons = [
            [this.vertices[0], this.vertices[1], this.vertices[2]],
            [this.vertices[0], this.vertices[2], this.vertices[3]],
            // Front face
            [this.vertices[4], this.vertices[6], this.vertices[5]],
            [this.vertices[4], this.vertices[7], this.vertices[6]],
            // Left face
            [this.vertices[0], this.vertices[3], this.vertices[7]],
            [this.vertices[0], this.vertices[7], this.vertices[4]],
            // Right face
            [this.vertices[1], this.vertices[5], this.vertices[6]],
            [this.vertices[1], this.vertices[6], this.vertices[2]],
            // Top face
            [this.vertices[3], this.vertices[2], this.vertices[6]],
            [this.vertices[3], this.vertices[6], this.vertices[7]],
            // Bottom face
            [this.vertices[0], this.vertices[4], this.vertices[5]],
            [this.vertices[0], this.vertices[5], this.vertices[1]]
        ]
    }
}

class Camera{
    constructor(pos, rot, resolutionX, resolutionY){
        this.pos = pos
        this. rot = rot 
        this.resolutionX = resolutionX
        this.resolutionY = resolutionY
    }
}

const rotateX = (pivot, point, rotX) => {
    const rad = rotX * Math.PI / 180;
        const cosPhi = Math.cos(rad);
        const sinPhi = Math.sin(rad);

        point[2] -= pivot[2];
        point[1] -= pivot[1];

        const zNew = point[2] * cosPhi - point[1] * sinPhi;
        const yNew = point[2] * sinPhi + point[1] * cosPhi;

        point[2] = zNew + pivot[2];
        point[1] = yNew + pivot[1];

        return point
}

const rotateY = (pivot, point, rotY) => {
    const rad = rotY * Math.PI / 180;
        const cosPhi = Math.cos(rad);
        const sinPhi = Math.sin(rad);

        point[2] -= pivot[2];
        point[0] -= pivot[0];

        const xNew = point[0] * cosPhi + point[2] * sinPhi;
        const zNew = -point[0] * sinPhi + point[2] * cosPhi;

        point[0] = xNew + pivot[0];
        point[2] = zNew + pivot[2];

        return point
}

const rotateZ = (pivot, point, rotZ) => {
    const rad = rotZ * Math.PI / 180;
        const cosPhi = Math.cos(rad);
        const sinPhi = Math.sin(rad);

        point[0] -= pivot[0];
        point[1] -= pivot[1];

        const xNew = point[0] * cosPhi - point[1] * sinPhi;
        const yNew = point[0] * sinPhi + point[1] * cosPhi;

        point[0] = xNew + pivot[0];
        point[1] = yNew + pivot[1];

        return point
}