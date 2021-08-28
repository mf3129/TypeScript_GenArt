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
var Particle = /** @class */ (function () {
    function Particle(w, h) {
        this.w = w;
        this.h = h;
        this.x = 0;
        this.y = 0; // location of the particle
        this.speed = 0;
        this.theta = 0; //describes the velocity
        this.radius = 1.0; // size of the particle
        this.ttl = 500; // time to liv
        this.duration = 500; //lifetime
        this.color = 'black';
        this.x = GetRandomFloat(0, w);
        this.y = GetRandomFloat(0, h);
        this.speed = GetRandomFloat(0, 3.0);
        this.theta = GetRandomFloat(0, 2 * Math.PI);
        this.radius = GetRandomFloat(0.05, MaxParticleSize);
    }
    Particle.prototype.Update = function () {
        // TODO Implement this
    };
    Particle.prototype.Draw = function (ctx) {
        // TODO Implement this
    };
    return Particle;
}());
// Simulation Constants
var ParticleCount = 200;
var Simulation = /** @class */ (function () {
    function Simulation(width, height) {
        this.width = width;
        this.height = height;
        particles: Particle[] = [];
        for (var i = 0; i < ParticleCount; i++) {
            this.particles.push(new Particle(this.width, this.height));
        }
    }
    Simulation.prototype.Update = function () {
        //TODO Implement this
    };
    Simulation.prototype.Draw = function (ctx) {
        //TODO Implement this
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, this.width, this.height);
    };
    return Simulation;
}());
function bootstrapper() {
    var width = 400;
    var height = 400;
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
