
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
const MaxParticleSize = 3
//////////////////////////////////////////////////
class Particle implements ISimObject {
    x = 0; y = 0; // location of the particle
    speed = 0; theta  = 0 //describes the velocity

    radius = 1.0 // size of the particle
    ttl = 500 // Houm much time is left to live
    lifetime = 500 //How long the particle will live

    color = 'black'
    constructor(private w:number, private h:number, private palette:string[]){
        this.x = GetRandomFloat(0, w)
        this.y = GetRandomFloat(0,h)

        this.speed = GetRandomFloat(0, 3.0)
        this.theta = GetRandomFloat(0, 2 * Math.PI)

        this.radius = GetRandomFloat(0.05, MaxParticleSize)
        this.lifetime = this.ttl = GetRandomFloat(25, 50)

        this.color = palette[GetRandomInt(0, palette.length)]
    }

    Update(){
        // Randomly move the particles

        // compute the delta change
        let dRadius = GetRandomFloat(-MaxParticleSize/10, MaxParticleSize/10)
        const dSpeed = GetRandomFloat(-0.01, 0.01)
        const dTheta = GetRandomFloat(-Math.PI/8, Math.PI/8)

        //compute new values
        this.speed += dSpeed
        this.theta += dTheta

        const [dx, dy] = FromPolar(this.speed, this.theta)

        this.x += dx
        this.y += dy
        this.radius += dRadius
        //radius has to be positive
        this.radius += (this.radius < 0) ? this.radius - 2*dRadius : 0
    }

    Draw(ctx:CanvasRenderingContext2D){
        // TODO Implement this
        ctx.save()
        this.experiment1(ctx)
        ctx.restore()
    }

    experiment1(ctx:CanvasRenderingContext2D){
        ctx.fillStyle = this.color
        let circle = new Path2D()
        circle.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        ctx.fill(circle)
    }
}

// Simulation Constants
const ParticleCount = 200
const ColorPalletes =  [
    ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6'], 
    ['#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D'],
    ['#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A'], 
    ['#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC'],
    ['#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC'], 
    ['#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399'],
    ['#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680'], 
    ['#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933'],
    ['#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3'], 
    ['#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF']
];
class Simulation implements ISimObject {
    particles:Particle[] = []
    palette:string[] = []
    constructor(private width: number, private height:number){
        // select a random palette
        this.palette = ColorPalletes[GetRandomInt(0,ColorPalletes.length)]
        //create particles
        for(let i = 0;  i < ParticleCount; i++){
            this.particles.push(
                new Particle(this.width, this.height, this.palette)
            )
        }
    }

    Update(){
        // Update Particles

        this.particles.forEach( p => p.Update() )
    }
    init = false
    Draw(ctx:CanvasRenderingContext2D){
        //Draw Background
        if (!this.init){
            ctx.fillStyle = this.palette[0]
            ctx.fillRect(0,0, this.width, this.height)
            this.init = true
        }

        // Draw Particles
        this.particles.forEach( p => p.Draw(ctx))
    }

}

function bootstrapper() {
    const width = 800
    const height = 800

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