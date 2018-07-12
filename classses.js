class point {
    constructor(){
        this.value = Math.random() * 100 < 90 ? 2 : 4;
    }
    valueOf(){
        return this.value;
    }
}

class Vector2{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }
}

class Game {
    constructor(o, x = 4, y = 4){
        this.Canvas = o.get(0) || typeof o == "string" ? $(o)[0] : o;
        this.ctx = this.Canvas.getContext('2d');
        this.x = x;
        this.y = y;
        this.gameField = Array.apply(0,Array(this.y)).map(() => Array.apply(0,Array(this.x)));
        this.directions = {
            Up: new Vector2(0, -1),
            Down: new Vector2(0, 1),
            Left: new Vector2(-1, 0),
            Right: new Vector2(1, 0),
            All: [[1, 0],[0, 1],[-1, 0],[0, -1]]
        }
        this.init();
    }
    init(){
        this.resize();
        onresize = this.resize.bind(this);
        onkeydown = this.key.bind(this);
        Array.apply(0,Array(2)).forEach(() => {
            this.spawnRandom();
        })
        this.draw();
    }
    spawnRandom(){
        let x = this.x * Math.random() | 0;
        let y = this.y * Math.random() | 0;
        while(this.gameField[y][x]){
            x = this.x * Math.random() | 0;
            y = this.y * Math.random() | 0;
        }
        this.gameField[y][x] = new point()
    }
    key(e){
        let Evt = e || event;
        switch(Evt.key){
            case "w":
            case "ArrowUp":
                this.move(this.directions.Up)
            break;
            case "a":
            case "ArrowLeft":
                this.move(this.directions.Left)
            break;
            case "d":
            case "ArrowRight":
                this.move(this.directions.Right)
            break;
            case "s":
            case "ArrowDown":
                this.move(this.directions.Down)
            break;
        }
    }
    move(d){
        if(this.CheckFull()){
            let m = false;
            for(let x = 0; x < this.x; x++){
                for(let y = 0; y < this.y; y++){
                    if(this.CheckSquares(x, y, true).one){
                        m = true;
                    }
                }
            }
            if(!m){
                if(confirm("you Have Lost")){
                    location.reload();
                }
            }
        }
        let x = d.x;
        let y = d.y;
        let moved = false;
        if(x != 0){
            for(let Xi = x > 0 ? this.x : 0; x > 0 ? Xi >= 0 : Xi < this.x;Xi += -x){
                for(let Yi = 0; Yi < this.y; Yi++){
                    if(!this.MoveSquare(Xi, Yi, d))
                    moved = true;
                }
            }
        }else if(y != 0){
            for(let Yi = y > 0 ? this.y : 0; y > 0 ? Yi >= 0 : Yi < this.y;Yi += -y){
                for(let Xi = 0; Xi < this.x; Xi++){
                    if(!this.MoveSquare(Xi, Yi, d))
                    moved = true;
                }
            }
        }
        if(moved && !this.CheckFull())
        this.spawnRandom();
        this.draw();
    }
    CheckFull(){
        let full = true;
        this.gameField.forEach(t => {
            t.forEach(p => {
                if(!p)
                full = false;
            })
        })
        return full;
    }
    CheckSquares(x, y, n = false){
        
        let r = n ? {} : false;
        let left = x != 0;
        let right = x != this.x - 1;
        let top = y != 0;
        let bottom = y != this.y - 1
        if(top){
            if(this.gameField[y - 1][x]){
                if(n){
                    if(this.gameField[y][x].value == this.gameField[y - 1][x]){
                        r.left = true
                    }
                }else{
                    r = true;
                }
            }
        }
        if(bottom){
            if(this.gameField[y + 1][x]){
                if(n){
                    if(this.gameField[y][x].value == this.gameField[y + 1][x]){
                        r.bottom = true
                    }
                }else{
                    r = true;
                }
            }
        }
        if(right){
            if(this.gameField[y][x + 1]){
                if(n){
                    if(this.gameField[y][x].value == this.gameField[y][x + 1]){
                        r.right = true
                    }
                }else{
                    r = true;
                }
            }
        }
        if(left){
            if(this.gameField[y][x - 1]){
                if(n){
                    if(this.gameField[y][x].value == this.gameField[y][x - 1]){
                        r.left = true
                    }
                }else{
                    r = true;
                }
            }
        }
        if(!n)return !r;
        r.one = r["top"] || r["bottom"] || r["left"] || r["right"] || false;
        return r;
    }
    MoveSquare(x, y, d){
        if(y + d.y <= -1 || x + d.x <= -1 || y + d.y >= this.y || x + d.x >= this.x || !this.gameField[y][x])return true;
        if(this.gameField[y + d.y][x + d.x]){
            if(this.gameField[y][x].value == this.gameField[y + d.y][x + d.x]){
                this.gameField[y + d.y][x + d.x].value *= 2;
                this.gameField[y][x] = null;
            }
        }else{
            this.gameField[y + d.y][x + d.x] = this.gameField[y][x];
            this.gameField[y][x] = null;
            console.log(x + d.x, y + d.y, d)
            this.MoveSquare(x + d.x, y + d.y, d);
        }
        console.log("Moved Square");
    }
    resize(){
        this.Canvas.width = innerWidth;
        this.Canvas.height = innerHeight;
        this.draw();
    }
    toColor(n) {
        let l = Math.log2(n);
        let c = l * 22.5 | 0;
        return `hsl(${c}, 100%, 50%)`
    }
    draw(){
        this.ctx.clearRect(0, 0, innerWidth, innerHeight);
        let DD = innerHeight > innerWidth ? "y" : "x";
        let S = Math.min(innerHeight, innerWidth);
        let s = (S - (0.005 * (this.x + this.y) / 2)) / 4;
        let o = DD == "x" ? innerWidth - S : innerHeight - S;
        let Ys = DD == "y" ? o / 2 : 0;
        let Xs = DD == "x" ? o / 2 : 0;
        this.gameField.forEach((y, Yi) => {
            y.forEach((x, Xi) => {
                this.ctx.globalAlpha = 0.3;
                if(!x){
                    this.ctx.fillStyle = "#000000"
                    // this.ctx.fillStyle = "#4d4c4c";
                }else{
                    this.ctx.fillStyle = this.toColor(x.value);
                    this.ctx.globalAlpha = 0.9;
                }
                this.ctx.fillRect(Xs + Xi * s, Ys + s * Yi, s - 5, s - 5);
                if(x){
                    this.ctx.fillStyle = "#000000"
                    let fontsize = 300;
                    do {
                        fontsize--;
                        this.ctx.font = fontsize + "px verdana";
                    } while(this.ctx.measureText(x.value.toString()).width > s)
                    fontsize = fontsize > s ? s : fontsize;
                    this.ctx.font = fontsize + "px verdana";
                    this.ctx.fillText(x.value.toString(), Xs + Xi * s + s / 2 - (this.ctx.measureText(x.value.toString()).width / 2), Ys + s * Yi + (s / 2) + (fontsize / 3))
                }
            })
        })
    }
}