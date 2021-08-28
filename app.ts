
//Utility Functions
// GetRandomFloat returns a random floating point number
// in a given range
function GetRandomFloat(min:number, max:number):number {
    return Math.random() * (max-min) + min
}

// GetRandomFloat returns a random Integer point number
// in a given range
function GetRandomInt(min:number, max:number):number {
    return Math.floor(GetRandomFloat(min, max))
}

// FromPolar returns the catesian coordinates for a 
// given polar coordinate
function FromPolar(v:number, theta:number) {
    return [v * Math.cos(theta), v * Math.sin(theta)]
}

/////////////////////////
// All Objects including the simulation behaviour is described
// by this interface
interface ISimObject {
    // Updates the state of the object
    Update():void
    // Renders the object to the canvas
    Draw(ctx:CanvasRenderingContext2D):void
}

// Particle Constants
class Particle implements ISimObject {
    x = 0; y = 0; // location of the particle
    speed = 0; theta  = 0 //describes the velocity

    radius = 1.0 // size of the particle
    ttl = 500 // time to liv
    duration = 500 //lifetime

    color = 'black'
    constructor(private w:number, private h:number){
        this.x = GetRandomFloat(0, w)
        this.y = GetRandomFloat(0,h)

        this.speed = GetRandomFloat(0, 3.0)
        this.theta = GetRandomFloat(0, 2 * Math.PI)

        this.radius = GetRandomFloat(0.05, MaxParticleSize)
    }

    Update(){
        // TODO Implement this
    }

    Draw(ctx:CanvasRenderingContext2D){
        // TODO Implement this
    }
}

// Simulation Constants
const ParticleCount = 200

class Simulation implements ISimObject {
    constructor(private width: number, private height:number){
        particles:Particle[] = []
        for(let i = 0;  i < ParticleCount; i++){
            this.particles.push(
                new Particle(this.width, this.height)
            )
        }
    }

    Update(){
        //TODO Implement this
    }

    Draw(ctx:CanvasRenderingContext2D){
        //TODO Implement this
        ctx.fillStyle = 'green'
        ctx.fillRect(0,0, this.width, this.height)
    }
}

function bootstrapper() {
    const width = 400
    const height = 400

    const updateFrameRate = 50
    const renderFrameRate = 50
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    if(!canvas) return
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if(!ctx)return
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    const sim = new Simulation(width, height)

    setInterval(
        () => { sim.Update()},
        1000/updateFrameRate
    )

    setInterval(
        ()=>{ sim.Draw(ctx),
        1000/renderFrameRate}
    )
}

bootstrapper()