var colourDict = {
    2: "#fff5fb",
    4: "#ffe7f6",
    8: "#ffdbf2",
    16: "#ffc5ea",
    32: "#ffa3b9",
    64: "#ff8d8c",
    128: "#ff7b62",
    256: "#ff5d3d",
    512: "#fc2c03",
    1024: "#ab1f03",
    2048: "#7d392c",
    "higher": "#360f08"
};
let board = [
    { x: 20, y: 20, c: 0, r: 0 },
    { x: 140, y: 20, c: 1, r: 0 },
    { x: 260, y: 20, c: 2, r: 0 },
    { x: 380, y: 20, c: 3, r: 0 },
    { x: 20, y: 140, c: 0, r: 1 },
    { x: 140, y: 140, c: 1, r: 1 },
    { x: 260, y: 140, c: 2, r: 1 },
    { x: 380, y: 140, c: 3, r: 1 },
    { x: 20, y: 260, c: 0, r: 2 },
    { x: 140, y: 260, c: 1, r: 2 },
    { x: 260, y: 260, c: 2, r: 2 },
    { x: 380, y: 260, c: 3, r: 2 },
    { x: 20, y: 380, c: 0, r: 3 },
    { x: 140, y: 380, c: 1, r: 3 },
    { x: 260, y: 380, c: 2, r: 3 },
    { x: 380, y: 380, c: 3, r: 3 }
];
var grid;
var score;
// Gets the canvas element
const gameboard = document.getElementById("gameboard");
// Gets a 2-D drawing context
const ctx = gameboard.getContext("2d");
ctx.font = "30px Arial";
main();
document.addEventListener("keydown", getMove);

function main() {
    initBoard();
}

function initBoard() {
    document.getElementById("overlay").style.display = "none"
    score = 0
    document.getElementById('score').innerHTML = `Score: ${score}`;
    grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    var first = [genRandomNum(4), genRandomNum(4)];
    var second = [genRandomNum(4), genRandomNum(4)];
    while (JSON.stringify(first.sort()) == JSON.stringify(second.sort())) {
        second = [genRandomNum(4), genRandomNum(4)];
    }
    grid[first[0]][first[1]] = genRandomNumWithProbs();
    grid[second[0]][second[1]] = genRandomNumWithProbs();
    drawBoard();
}

function genRandomNum(num) {
    return Math.floor(Math.random() * num);
}

function genRandomNumWithProbs() {
    var arr = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
    return arr[genRandomNum(arr.length)];
}

function drawBoard() {
    board.forEach(drawCell);
}

function drawCell(cell) {
    var g = grid[cell.r][cell.c]
    if (g !== 0) {
        if (g > 2048) {
            ctx.fillStyle = colourDict["higher"]
            ctx.fillRect(cell.x, cell.y, 105, 105);
            ctx.fillStyle = '#000000';
            ctx.fillText(grid[cell.r][cell.c], 80 + (120 * cell.c), 80 + (120 * cell.r));
        }
        else {
            ctx.fillStyle = colourDict[g]
            ctx.fillRect(cell.x, cell.y, 105, 105);
            ctx.fillStyle = '#000000';
            ctx.fillText(grid[cell.r][cell.c], 66 + (120 * cell.c), 80 + (120 * cell.r));
        }
    }
    else {
        ctx.fillStyle = '#c7bbaf';
        ctx.fillRect(cell.x, cell.y, 105, 105);
    }
}

function checkWin() {
    grid.forEach(function (entry) {
        if (entry.includes(2048)) {
            document.getElementById("overlay").style.display = "block";
        }
    });
    return true;
}

function checkGameOver() {
    for (let x = 1; x < 5; x++) {
        if (x > 2) {
            grid = transpose();
        }
        for (let y = 0; y < 4; y++) {
            //grid.forEach(function (entry) {
            if (x == 2 || x == 4) {
                grid[y] = grid[y].reverse()
                //entry = entry.reverse();
            }
            if (grid[y].includes(0)) {
                if (x == 2 || x == 4) {
                    grid[y] = grid[y].reverse();
                }
                return false;
            }
            for (let i = 0; i < grid[y].length - 1; i++) {
                if (grid[y][i] == grid[y][i + 1]) {
                    if (x == 2 || x == 4) {
                        grid[y] = grid[y].reverse();
                    }
                    return false;
                }
            }
            if (x == 2 || x == 4) {
                grid[y] = grid[y].reverse();
            }
        }
        //});
        if (x > 2) {
            grid = transpose();
        }
    }
    return true;
}

function move(dir) {
    var counter = 0;
    var reverseCheck = [68, 39, 40, 83];
    var transposeCheck = [87, 38, 40, 83];
    var changed = false;
    if (transposeCheck.includes(dir)) {
        grid = transpose();
    }
    grid.forEach(function (entry) {
        if (reverseCheck.includes(dir)) {
            entry = entry.reverse();
        }
        var filtered = entry.filter(function (value, index, arr) {
            return value > 0;
        });
        for (let i = 0; i < filtered.length - 1; i++) {
            if (filtered[i] === filtered[i + 1]) {
                filtered[i] = filtered[i] * 2;
                score += filtered[i];
                document.getElementById('score').innerHTML = `Score: ${score}`;
                filtered.splice(i + 1, 1);
            }
        }
        while (filtered.length < 4) {
            filtered = filtered.concat([0]);
        }
        if (JSON.stringify(grid[counter]) !== JSON.stringify(filtered)) {
            changed = true;

        }
        if (reverseCheck.includes(dir)) {
            grid[counter] = filtered.reverse();
        }
        else {
            grid[counter] = filtered;
        }
        counter += 1;
    });
    if (transposeCheck.includes(dir)) {
        grid = transpose();
    }
    return changed;
}

function getMove(event) {
    const KEYS = [87, 37, 68, 39, 65, 38, 40, 83];
    const keyPressed = event.keyCode;
    console.log(keyPressed)
    if (KEYS.includes(keyPressed)) {
        changed = move(keyPressed)
    }
    else {
        return;
    }
    if (changed) {
        newNumPostMove();
        drawBoard();
        if (checkGameOver()) {
            document.getElementById("overlay").style.display = "block";
        }
    }
}

function newNumPostMove() {
    var newNum = [genRandomNum(4), genRandomNum(4)];
    while (grid[newNum[0]][newNum[1]] !== 0) {
        var newNum = [genRandomNum(4), genRandomNum(4)];
    }
    grid[newNum[0]][newNum[1]] = genRandomNumWithProbs();
}

function transpose() {
    return grid[0].map((col, c) => grid.map((row, r) => grid[r][c]))
}

function makeMove() {
    var filtered = entry.filter(function (value, index, arr) {
        return value > 0;
    });
    while (filtered.length < 4) {
        filtered = filtered.concat([0]);
    }
    return filtered
    //console.log(entry)
}