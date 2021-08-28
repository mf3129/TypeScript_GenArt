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
// Particle Constants
var MaxParticleSize = 3;
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
        this.ttl = 500; // Houm much time is left to live
        this.lifetime = 500; //How long the particle will live
        this.color = 'black';
        this.x = GetRandomFloat(0, w);
        this.y = GetRandomFloat(0, h);
        this.speed = GetRandomFloat(0, 3.0);
        this.theta = GetRandomFloat(0, 2 * Math.PI);
        this.radius = GetRandomFloat(0.05, MaxParticleSize);
        this.lifetime = this.ttl = GetRandomFloat(25, 50);
        this.color = palette[GetRandomInt(0, palette.length)];
    }
    Particle.prototype.Update = function () {
        // Randomly move the particles
        // compute the delta change
        var dRadius = GetRandomFloat(-MaxParticleSize / 10, MaxParticleSize / 10);
        var dSpeed = GetRandomFloat(-0.01, 0.01);
        var dTheta = GetRandomFloat(-Math.PI / 8, Math.PI / 8);
        //compute new values
        this.speed += dSpeed;
        this.theta += dTheta;
        var _a = FromPolar(this.speed, this.theta), dx = _a[0], dy = _a[1];
        this.x += dx;
        this.y += dy;
        this.radius += dRadius;
        //radius has to be positive
        this.radius += (this.radius < 0) ? this.radius - 2 * dRadius : 0;
    };
    Particle.prototype.Draw = function (ctx) {
        // TODO Implement this
        ctx.save();
        this.experiment1(ctx);
        ctx.restore();
    };
    Particle.prototype.experiment1 = function (ctx) {
        ctx.fillStyle = this.color;
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
    Simulation.prototype.Update = function () {
        // Update Particles
        this.particles.forEach(function (p) { return p.Update(); });
    };
    Simulation.prototype.Draw = function (ctx) {
        //Draw Background
        if (!this.init) {
            ctx.fillStyle = this.palette[0];
            ctx.fillRect(0, 0, this.width, this.height);
            this.init = true;
        }
        // Draw Particles
        this.particles.forEach(function (p) { return p.Draw(ctx); });
    };
    return Simulation;
}());
function bootstrapper() {
    var width = 800;
    var height = 800;
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
    setInterval(function () { sim.Update(); }, 1000 / updateFrameRate);
    setInterval(function () {
        sim.Draw(ctx),
            1000 / renderFrameRate;
    });
}
bootstrapper();
