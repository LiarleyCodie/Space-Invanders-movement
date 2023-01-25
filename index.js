const startBtn = document.querySelector("#start")
const stopBtn = document.querySelector("#stop")
const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext('2d')
const fps = 30
var frame = 0
var running = false
var interval

const CONFIGS = function() {
    canvas.width = 256
    canvas.height = 224
    ctx.imageSmoothingEnabled = false
}()
const FLUXCONTROLS = function() {
    startBtn.onclick = () => {
        create()
        if (!running) {
            interval = setInterval(update, 1000/fps)
        }
        running = true
    }

    // Stop game loop
    stopBtn.onclick = () => {
        clearInterval(interval)
        running = false
}
}()

//#region Objects
function drawBackground() {
    ctx.fillStyle = "black"
    ctx.fillRect(0,0,canvas.width,canvas.height)
}

const bullet = {
    position: { x: 0, y: 0 },
    size: { width: 1, height: 4 },
    movement: { acceleration: 0.25, vspeed: 0 },
    color: "white",
    draw: function() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    },
    update: function() {
        this.position.y -= this.movement.vspeed
        
        if (player.shootCount > 0) this.movement.vspeed += this.movement.acceleration

        if (this.movement.vspeed >= 5) this.movement.vspeed = 5
        
        if (this.position.y < 0 - (this.size.height * 2)) {
            this.movement.vspeed = 0
            player.shootCount = 0
        }
    }
}

const player = {
    position: { x: 0, y: 0 },
    size: { width: 16, height: 8 },
    keys: { arrowLeft: false, arrowRight: false, space: false },
    movement: { acceleration: 0.25, hspeed: 0 },
    color: "white",
    shootCount: 0,
    draw: function() {
        // draw the body
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)

        // draw the head-gun
        ctx.fillStyle = this.color
        ctx.fillRect(
            this.position.x + this.size.width / 2 - 1,
            this.position.y - 3,
            3, 3)
    },
    update: function() {
        if (this.movement.hspeed >= 5) this.movement.hspeed = 5
        
        // when these keys are pressed
        if (this.keys.arrowLeft) {
            this.movement.hspeed += this.movement.acceleration
            this.position.x -= this.movement.hspeed
        }

        if (this.keys.arrowRight) {
            this.movement.hspeed += this.movement.acceleration
            this.position.x += this.movement.hspeed
        }

        if (this.shootCount < 1) {
            if (this.keys.space) {
                this.shootCount += 1
                bullet.position.x = this.position.x + this.size.width / 2
                bullet.position.y = this.position.y
            }
        }

        if (this.shootCount > 0) {
            bullet.draw()
            bullet.update()
        }
    }
}

//#endregion

//#region Debug Functions
function drawCurrentFrame(string, color) {
    ctx.fillStyle = color
    ctx.font = "12px Arial"
    ctx.fillText(`f: ${string}`, 10, 20)
}
//#endregion

//#region Main Functions
// create() will run only once time
function create() {
    player.position.y = canvas.height - player.size.height
}

// update() will run every time
function update() {
    drawBackground()

    player.update()
    player.draw()

    drawCurrentFrame(frame, "white")
    frame++
}
//#endregion

//#region Inputs
// key pressed and hold
window.addEventListener("keydown", ({ keyCode }) => {
    switch (keyCode) {
        case 39:
            player.keys["arrowRight"] = true
            break;
        case 37:
            player.keys["arrowLeft"] = true
            break;
        case 32:
            player.keys["space"] = true
            break;
    }
    // console.log(player.keys)
})

// key released
window.addEventListener("keyup", ({ keyCode }) => {
    switch (keyCode) {
        case 39: 
            player.keys["arrowRight"] = false
            player.movement.hspeed = 0
            break
        case 37:
            player.keys["arrowLeft"] = false
            player.movement.hspeed = 0 
            break
        case 32:
            player.keys["space"] = false
            break;
    }
    // console.log(player.keys)
})
//#endregion