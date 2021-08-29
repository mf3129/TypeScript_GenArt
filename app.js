"use strict";
//Utility Functions
// GetRandomFloat returns a random floating point number
// in a given range
function GetRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}
// GetRandomFloat returns a random Integer point number
// in a given range
function GetRandomInt(min, max) {
    return Math.floor(GetRandomFloat(min, max));
}
// FromPolar returns the catesian coordinates for a 
// given polar coordinate
function FromPolar(v, theta) {
    return [v * Math.cos(theta), v * Math.sin(theta)];
}
function ToLuma(r, g, b) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
// Clamp makes sure the values stays within the min/max range
function Clamp(min, max, value) {
    return value > max ? max : (value < min ? min : value);
}
// Particle Constants
var MaxParticleSize = 6;
//////////////////////////////////////////////////
var Particle = /** @class */ (function () {
    function Particle(w, h, palette) {
        this.w = w;
        this.h = h;
        this.palette = palette;
        this.x = 0;
        this.y = 0; // location of the particle
        this.speed = 0;
        this.theta = 0; //describes the velocity
        this.radius = 1.0; // size of the particle
        this.ttl = 500; // How much time is left to live
        this.lifetime = 500; //How long the particle will live
        this.alpha = 1.0;
        this.color = 'black';
        this.reset();
    }
    Particle.prototype.reset = function () {
        this.x = GetRandomFloat(0, this.w);
        this.y = GetRandomFloat(0, this.h);
        this.speed = GetRandomFloat(0, 3.0);
        this.theta = GetRandomFloat(0, 2 * Math.PI);
        this.radius = GetRandomFloat(0.05, 1.0);
        this.lifetime = this.ttl = GetRandomFloat(25, 50);
        this.color = this.palette[GetRandomInt(0, this.palette.length)];
        this.ttl = this.lifetime = GetRandomInt(25, 50);
    };
    Particle.prototype.imageComplementLuma = function (imageData) {
        var p = Math.floor(this.x) + Math.floor(this.y) * imageData.width;
        // ImageData contains RGBA values
        var i = Math.floor(p * 4);
        var r = imageData.data[i + 0];
        var g = imageData.data[i + 1];
        var b = imageData.data[i + 2];
        var luma = ToLuma(r, g, b); // 0 -> 255
        // luma is higher for lighter pixel
        var ln = 1 - luma / 255.0; // complement; higher ln means darker
        return ln;
    };
    Particle.prototype.Update = function (imageData) {
        // Randomly move the particles
        var ln = this.imageComplementLuma(imageData);
        var lt = (this.lifetime - this.ttl) / this.lifetime;
        this.alpha = lt;
        // compute the delta change
        var dRadius = GetRandomFloat(-MaxParticleSize / 5, MaxParticleSize / 5);
        var dSpeed = GetRandomFloat(-0.2, 0.2);
        var dTheta = GetRandomFloat(-Math.PI / 8, Math.PI / 8);
        //compute new values
        this.speed += dSpeed;
        this.theta += dTheta;
        var _a = FromPolar(this.speed * ln, this.theta * ln), dx = _a[0], dy = _a[1];
        this.x += dx;
        this.y += dy;
        this.x = Clamp(0, this.w, this.x);
        this.y = Clamp(0, this.h, this.y);
        this.radius += dRadius;
        //radius has to be positive
        this.radius = Clamp(0, MaxParticleSize, this.radius) * ln;
        //manage particle lifetime
        this.ttl += -1;
        if (this.ttl == 0) {
            this.reset();
        }
    };
    Particle.prototype.Draw = function (ctx) {
        // TODO Implement this
        ctx.save();
        this.experiment1(ctx);
        ctx.restore();
    };
    Particle.prototype.experiment1 = function (ctx) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        var circle = new Path2D();
        circle.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill(circle);
    };
    return Particle;
}());
// Simulation Constants
var ParticleCount = 200;
var ColorPalletes = [
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
var Simulation = /** @class */ (function () {
    function Simulation(width, height) {
        this.width = width;
        this.height = height;
        this.particles = [];
        this.palette = [];
        this.init = false;
        // select a random palette
        this.palette = ColorPalletes[GetRandomInt(0, ColorPalletes.length)];
        //create particles
        for (var i = 0; i < ParticleCount; i++) {
            this.particles.push(new Particle(this.width, this.height, this.palette));
        }
    }
    Simulation.prototype.Update = function (imageData) {
        // Update Particles
        this.particles.forEach(function (p) { return p.Update(imageData); });
    };
    Simulation.prototype.Draw = function (ctx) {
        //Draw Background
        if (!this.init) {
            ctx.fillStyle = this.palette[3];
            ctx.fillRect(0, 0, this.width, this.height);
            this.init = true;
        }
        // Draw Particles
        this.particles.forEach(function (p) { return p.Draw(ctx); });
    };
    return Simulation;
}());
function createDrawCanvas(imageCtx, width, height) {
    var updateFrameRate = 50;
    var renderFrameRate = 50;
    var canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    if (!canvas)
        return;
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    if (!ctx)
        return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    var sim = new Simulation(width, height);
    var imageData = imageCtx.getImageData(0, 0, width, height);
    setInterval(function () { sim.Update(imageData); }, 1000 / updateFrameRate);
    setInterval(function () {
        sim.Draw(ctx),
            1000 / renderFrameRate;
    });
}
function bootstrapper(w, h) {
    var width = w;
    var height = h;
    var imageCanvas = document.createElement('canvas');
    document.body.appendChild(imageCanvas);
    imageCanvas.width = width;
    imageCanvas.height = height;
    var ctx = imageCanvas.getContext('2d');
    if (!ctx)
        return;
    // create an image element to load the jpg to 
    var image = new window.Image();
    if (!image)
        return;
    image.crossOrigin = 'Anonymous';
    image.onload = function (e) {
        ctx.drawImage(image, 0, 0, width, height);
        createDrawCanvas(ctx, width, height);
    };
    var images = ['elon.jpeg'];
    // image.src = images[GetRandomInt(0,images.length)]
    image.src = images[0];
    // createDrawCanvas(width, height)
}
bootstrapper(425, 475);
