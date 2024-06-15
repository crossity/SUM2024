const INF = 1000000;

function intersection(x1, y1, x2, y2) {
    return ((y1 + x1 * x1) - (y2 + x2 * x2)) / (2 * x1 - 2 * x2);
} 

function runLine(dists, y, width) {
    let xs = [], ys = [], ls = 0;

    for (let x = 0; x < width; x++) {
        let ny = dists[y * width + x];

        if (ny < INF) {
            xs.push(x);
            ys.push(ny);
        }
    }

    let l = xs.length;

    if (l == 0)
        return;


    for (let i = 0; i < l - 2; i++) {
        let s = intersection(xs[i], ys[i], xs[i + 2], ys[i + 2]);
        let f2s = ys[i + 1] + (s - xs[i + 1]) * (s - xs[i + 1]);
        let f1s = ys[i] + (s - xs[i]) * (s - xs[i]);

        if (f1s <= f2s) {
            xs.splice(i + 1, 1);
            ys.splice(i + 1, 1);
            l--;
            i = 0;
        }
    }


    for (let i = 0; i < width; i++)
        dists[i + y * width] = INF;
    for (let i = 0; i < l - 1; i++) {
        let s = Math.round(intersection(xs[i], ys[i], xs[i + 1], ys[i + 1]));

        for (let x = Math.max(ls, 0); x < width && x < s; x++) {
            dists[y * width + x] = (ys[i] + (x - xs[i]) * (x - xs[i]));
        }
        ls = s;
    }

    for (let x = ls; x < width; x++) {
        dists[y * width + x] = (ys[l - 1] + (x - xs[l - 1]) * (x - xs[l - 1]));
    }
}

function main() {
    let img = new Image();
    let context;
    let data = [], dists1 = [], dists = [];

    img.onload = function() {
        let canvas = document.getElementById("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        context = canvas.getContext("2d");

        let cv = document.getElementById("result");
        cv.width = img.width;
        cv.height = img.height;
        let result = cv.getContext("2d");

        context.globalCompositeOperation = "hard-light";

        context.drawImage(img, 0, 0);

        let data1 = Array.from(context.getImageData(0, 0, img.width, img.height).data);

        for (let i = 0; i < data1.length; i += 4) {
            if (data1[i] + data1[i + 1] + data1[i + 2] > 300)
                data.push(1);
            else
                data.push(0);
        }

        for (let i = 0; i < data.length; i++)
        {
            if (data[i] == 1)
                context.fillStyle = "rgba(255, 255, 255, 1)";
            else
                context.fillStyle = "rgba(0, 0, 0, 1)";
            context.fillRect(Math.floor(i % img.width), Math.floor(i / img.width), 1, 1);
        }

        // Creating base dists array
        for (let i = 0; i < data.length; i++) 
            if (data[i] == 1)
                dists.push(0);
            else
                dists.push(INF);

        for (let i = 0; i < img.height; i++)
            runLine(dists, i, img.width);

        // Rotating image
        for (let y = 0; y < img.height; y++) {
            for (let x = 0; x < img.width; x++) {
                let nx = y;
                let ny = img.width - 1 - x;

                dists1[ny * img.height + nx] = dists[y * img.width + x];
            }
        }
        
        // Vertical run
        for (let i = 0; i < img.width; i++)
            runLine(dists1, i, img.height);

        // Rotating back
        for (let y = 0; y < img.width; y++) {
            for (let x = 0; x < img.height; x++) {
                let nx = img.width - 1 - y;
                let ny = x;

                dists[ny * img.width + nx] = dists1[y * img.height + x];
            }
        }
        
        //dists.length
        for (let i = 0; i < dists.length; i++) {
            let c = Math.floor(Math.min(Math.sqrt(dists[i]), 255));

            result.fillStyle = `rgba(${c}, ${c}, ${c}, 1)`;
            result.fillRect(Math.floor((i) % img.width), Math.floor(i / img.width), 1, 1);
            //result.fillRect(i, 0, 1, 1);
        }
    };

    img.src = "./Accident.png";
}

main();