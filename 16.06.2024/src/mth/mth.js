class _vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export function vec2(x, y) {
    if (x == undefined)
        return new _vec2(0, 0);
    if (y == undefined)
        return new _vec2(x, x);
    return new _vec2(x, y);
}

class _vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v) {
        return vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    sub(v) {
        return vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    mul(a) {
        return vec3(this.x * a, this.y * a, this.z * a);
    }
    div(a) {
        return vec3(this.x / a, this.y / a, this.z / a);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    cross(v) {
        return vec3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }
    len2() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    len() {
        return Math.sqrt(this.len2());
    }
    norm() {
        return vec3(this.div(this.len()));
    }
    mulmat(m) {
        let w = this.x * m.a[0][3] + this.y * m.a[1][3] + this.z * m.a[2][3] + m.a[3][3];

        return vec3(
            (this.x * m.a[0][0] + this.y * m.a[1][0] + this.z * m.a[2][0] + m.a[3][0]) / w,
            (this.x * m.a[0][1] + this.y * m.a[1][1] + this.z * m.a[2][1] + m.a[3][1]) / w,
            (this.x * m.a[0][2] + this.y * m.a[1][2] + this.z * m.a[2][2] + m.a[3][2]) / w
        );
    }
    transform(m) {
        return vec3(
            this.x * m.a[0][0] + this.y * m.a[1][0] + this.z * m.a[2][0],
            this.x * m.a[0][1] + this.y * m.a[1][1] + this.z * m.a[2][1],
            this.x * m.a[0][2] + this.y * m.a[1][2] + this.z * m.a[2][2]
        )
    }
    pointTransform(m) {
        return vec3(
            this.x * m.a[0][0] + this.y * m.a[1][0] + this.z * m.a[2][0] + m.a[3][0],
            this.x * m.a[0][1] + this.y * m.a[1][1] + this.z * m.a[2][1] + m.a[3][1],
            this.x * m.a[0][2] + this.y * m.a[1][2] + this.z * m.a[2][2] + m.a[3][2]
        )
    }
}

export function vec3(x, y, z) {
    if (x == undefined)
        return new _vec3(0, 0, 0);
    if (typeof(x) == "object")
        return new _vec3(x.x, x.y, x.z);
    if (y == undefined)
        return new _vec3(x, x, x);
    return new _vec3(x, y, z);
}

class _mat4 {
    constructor(
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        a30, a31, a32, a33
    ) {
        this.a = [
            [a00, a01, a02, a03],
            [a10, a11, a12, a13],
            [a20, a21, a22, a23],
            [a30, a31, a32, a33]
        ]
    }

    setFrustum(left, right, bottom, top, near, far) {
        this.a = [
            [2 * near / (right - left), 0, 0, 0],
            [0, 2 * near / (top - bottom), 0, 0],
            [(right + left) / (right - left), (top + bottom) / (top - bottom), -(far + near) / (far - near), -1],
            [0, 0, -2 * near * far / (far - near), 0]
        ]
    }

    setView(loc, at, up1) {
        let 
            dir = at.sub(loc).norm(),
            right = dir.cross(up1).norm(),
            up = right.cross(dir).norm();
        this.a = [
            [right.x, up.x, -dir.x, 0],
            [right.y, up.y, -dir.y, 0],
            [right.z, up.z, -dir.z, 0],
            [-loc.dot(right), -loc.dot(up), loc.dot(dir), 1]
        ];

        return {dir: dir, up: up, right: right};
    }

    mul(m) {
        return mat4(
            this.a[0][0] * m.a[0][0] + this.a[0][1] * m.a[1][0] + this.a[0][2] * m.a[2][0] + this.a[0][3] * m.a[3][0],
            this.a[0][0] * m.a[0][1] + this.a[0][1] * m.a[1][1] + this.a[0][2] * m.a[2][1] + this.a[0][3] * m.a[3][1],
            this.a[0][0] * m.a[0][2] + this.a[0][1] * m.a[1][2] + this.a[0][2] * m.a[2][2] + this.a[0][3] * m.a[3][2],
            this.a[0][0] * m.a[0][3] + this.a[0][1] * m.a[1][3] + this.a[0][2] * m.a[2][3] + this.a[0][3] * m.a[3][3],

            this.a[1][0] * m.a[0][0] + this.a[1][1] * m.a[1][0] + this.a[1][2] * m.a[2][0] + this.a[1][3] * m.a[3][0],
            this.a[1][0] * m.a[0][1] + this.a[1][1] * m.a[1][1] + this.a[1][2] * m.a[2][1] + this.a[1][3] * m.a[3][1],
            this.a[1][0] * m.a[0][2] + this.a[1][1] * m.a[1][2] + this.a[1][2] * m.a[2][2] + this.a[1][3] * m.a[3][2],
            this.a[1][0] * m.a[0][3] + this.a[1][1] * m.a[1][3] + this.a[1][2] * m.a[2][3] + this.a[1][3] * m.a[3][3],

            this.a[2][0] * m.a[0][0] + this.a[2][1] * m.a[1][0] + this.a[2][2] * m.a[2][0] + this.a[2][3] * m.a[3][0],
            this.a[2][0] * m.a[0][1] + this.a[2][1] * m.a[1][1] + this.a[2][2] * m.a[2][1] + this.a[2][3] * m.a[3][1],
            this.a[2][0] * m.a[0][2] + this.a[2][1] * m.a[1][2] + this.a[2][2] * m.a[2][2] + this.a[2][3] * m.a[3][2],
            this.a[2][0] * m.a[0][3] + this.a[2][1] * m.a[1][3] + this.a[2][2] * m.a[2][3] + this.a[2][3] * m.a[3][3],

            this.a[3][0] * m.a[0][0] + this.a[3][1] * m.a[1][0] + this.a[3][2] * m.a[2][0] + this.a[3][3] * m.a[3][0],
            this.a[3][0] * m.a[0][1] + this.a[3][1] * m.a[1][1] + this.a[3][2] * m.a[2][1] + this.a[3][3] * m.a[3][1],
            this.a[3][0] * m.a[0][2] + this.a[3][1] * m.a[1][2] + this.a[3][2] * m.a[2][2] + this.a[3][3] * m.a[3][2],
            this.a[3][0] * m.a[0][3] + this.a[3][1] * m.a[1][3] + this.a[3][2] * m.a[2][3] + this.a[3][3] * m.a[3][3]
        )
    }
}

export function mat4(
    a00, a01, a02, a03,
    a10, a11, a12, a13,
    a20, a21, a22, a23,
    a30, a31, a32, a33
) {
    if (a00 == undefined)
        return new _mat4(
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        );
    if (a00 == 1 && a01 == undefined)
        return new _mat4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    if (typeof a00 == "object")
        return new _mat4(
            a00[0][0], a00[0][1], a00[0][2], a00[0][3],
            a00[1][0], a00[1][1], a00[1][2], a00[1][3],
            a00[2][0], a00[2][1], a00[2][2], a00[2][3],
            a00[3][0], a00[3][1], a00[3][2], a00[3][3]
        )
    return new _mat4(
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        a30, a31, a32, a33
    );
}

export function rotate(angle, axis) {
    let 
        s = Math.sin(angle),
        c = Math.cos(angle);
    let v = axis.norm();

    return mat4(
        c + v.x * v.x * (1 - c), v.x * v.y * (1 - c) + v.z * s, v.x * v.z * (1 - c) - v.y * s, 0,
        v.y * v.x * (1 - c) - v.z * s, c + v.y * v.y * (1 - c), v.y * v.z * (1 - c) + v.x * s, 0,
        v.z * v.x * (1 - c) + v.y * s, v.z * v.y * (1 - c) - v.x * s, c + v.z * v.z * (1 - c), 0,
        0, 0, 0, 1
    )
}

export function translate(s) {
    let m = mat4(1);

    m.a[3][0] = s.x;
    m.a[3][1] = s.y;
    m.a[3][2] = s.z;

    return m;
}

export function scale(s) {
    return mat4(
        s.x, 0, 0, 0,
        0, s.y, 0, 0,
        0, 0, s.z, 0,
        0, 0, 0, 1
    );
}