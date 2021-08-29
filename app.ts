
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

function ToLuma(r:number, g:number, b:number):number {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// Clamp makes sure the values stays within the min/max range
function Clamp(min: number, max:number, value: number):number {
    return value > max ? max: (value < min ? min: value)
}




/////////////////////////
// All Objects including the simulation behaviour is described
// by this interface
interface ISimObject {
    // Updates the state of the object
    Update(imageData: ImageData):void
    // Renders the object to the canvas
    Draw(ctx:CanvasRenderingContext2D):void
}




// Particle Constants
const MaxParticleSize = 6

//////////////////////////////////////////////////
class Particle implements ISimObject {
    x = 0; y = 0; // location of the particle
    speed = 0; theta  = 0 //describes the velocity

    radius = 1.0 // size of the particle
    ttl = 500 // How much time is left to live
    lifetime = 500 //How long the particle will live

    alpha = 1.0
    color = 'black'
    constructor(private w:number, private h:number, private palette:string[]){
        this.reset()
    }

    reset() {
        this.x = GetRandomFloat(0, this.w)
        this.y = GetRandomFloat(0, this.h)

        this.speed = GetRandomFloat(0, 3.0)
        this.theta = GetRandomFloat(0, 2 * Math.PI)

        this.radius = GetRandomFloat(0.05, 1.0)
        this.lifetime = this.ttl = GetRandomFloat(25, 50)

        this.color = this.palette[GetRandomInt(0, this.palette.length)]

        this.ttl = this.lifetime = GetRandomInt(25, 50)
    }

    imageComplementLuma(imageData:ImageData):number {
        const p = Math.floor(this.x) + Math.floor(this.y) * imageData.width
        // ImageData contains RGBA values
        const i = Math.floor(p * 4)
        const r = imageData.data[i + 0]
        const g = imageData.data[i + 1]
        const b = imageData.data[i + 2]

        const luma = ToLuma(r,g,b) // 0 -> 255
        // luma is higher for lighter pixel
        const ln = 1 - luma / 255.0 // complement; higher ln means darker
        return ln
    }

    Update(imageData: ImageData){
        // Randomly move the particles
        const ln = this.imageComplementLuma(imageData)
        const lt = (this.lifetime - this.ttl) / this.lifetime

        this.alpha = lt
        // compute the delta change
        let dRadius = GetRandomFloat(-MaxParticleSize/5, MaxParticleSize/5)
        const dSpeed = GetRandomFloat(-0.2, 0.2)
        const dTheta = GetRandomFloat(-Math.PI/8, Math.PI/8)

        //compute new values
        this.speed += dSpeed
        this.theta += dTheta

        const [dx, dy] = FromPolar(this.speed * ln, this.theta * ln)

        this.x += dx
        this.y += dy
        this.x = Clamp(0, this.w, this.x)
        this.y = Clamp(0, this.h, this.y)

        this.radius += dRadius
        //radius has to be positive
        this.radius = Clamp(0, MaxParticleSize, this.radius) * ln

        //manage particle lifetime
        this.ttl += -1
        if(this.ttl == 0) {
            this.reset()
        }
    }

    Draw(ctx:CanvasRenderingContext2D){
        // TODO Implement this
        ctx.save()
        this.experiment1(ctx)
        ctx.restore()
    }

    experiment1(ctx:CanvasRenderingContext2D){
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.alpha
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

    Update(imageData:ImageData){
        // Update Particles

        this.particles.forEach( p => p.Update(imageData) )
    }
    init = false
    Draw(ctx:CanvasRenderingContext2D){
        //Draw Background
        if (!this.init){
            ctx.fillStyle = this.palette[3]
            ctx.fillRect(0,0, this.width, this.height)
            this.init = true
        }

        // Draw Particles
        this.particles.forEach( p => p.Draw(ctx))
    }

}





function createDrawCanvas(imageCtx:CanvasRenderingContext2D, width:number, height:number){
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
    const imageData = imageCtx.getImageData(0,0,width, height)
    setInterval(
        () => { sim.Update(imageData)},
        1000/updateFrameRate
    )

    setInterval(
        ()=>{ sim.Draw(ctx),
        1000/renderFrameRate}
    )
}





function bootstrapper(w:number, h:number) {
    const width = w
    const height = h


    const imageCanvas = document.createElement('canvas')
    document.body.appendChild(imageCanvas)
    imageCanvas.width = width
    imageCanvas.height = height
    const ctx = imageCanvas.getContext('2d')
    if(!ctx) return

    // create an image element to load the jpg to 
    var image = new window.Image()
    if(!image) return
    image.crossOrigin = 'Anonymous'
    image.onload = (e)=> {
        ctx.drawImage(image, 0,0,width,height)
        createDrawCanvas(ctx, width, height)
    }

    const images = ['elon.jpeg']
    // image.src = images[GetRandomInt(0,images.length)]
    image.src = images[0]
    


    // createDrawCanvas(width, height)
}

bootstrapper(425, 475)