// Sand colours: #c2b280 #edc9af #F2D16B #E7E4DE #EED6AF #EDC9AF
var viscocity = 100; // PB 1, 40
var decay = 0.0; // PB .002
var numColours = 5;
var colourSet = 1;
var backCol = [0.66, 0.57, 0.38];
var material1 = [0.52, 0.81, 0.70];
var material2 = [0.0, 0.70, 0.63];
var material3 = [0.925, 0., 0.55];
var material4 = [.0, 0.7, 0.07];
var material5 = [1.0, 0.7, 0.07];
var firstPress = true;
var sandSize = 0.04;
var sandOpacity = .5;
var sandColour = 0xF0F0F3;
var setNo = 1;
var hueNumber = 0;

var width, height;
var actualWidth, actualHeight;
var body;
var scale = 1;

var lastMouseCoordinates = [0, 0];
var mouseCoordinates = [0, 0];
var mouseEnable = false;
var mouseout = false;
var particles;
var paused = false; //while window is resizing
var mute = true;

var dt = 1;
var dx = 1;
var nu = 1;
var rho = 1;

var GPU;

var threeView;
var geo;
var numParticles = 50625; //perfect sq was 16000
var particlesTextureDim = 225; //sqrt(numParticles)
var particleData = new Float32Array(numParticles * 4); //[position.x, position.y, velocity.x, velocity.y]
var particles = null;;
var particlesVertices;
var vectorLength = 4; //num floats to parse
var canvas;

window.onload = init;

var anim;

var colSet = 0;

function isOdd(num) {
    return num % 2;
}

var button;
var button1;
var button2;


function ClearScreen() {
    decay = .5;
    PlaySound("clear.mp3");
    setTimeout(function () {
        decay = 0.;
    }, 500);
}

function ChangeForeground() {
    PlaySound("fore.mp3");
    if (colSet > 12)
        colSet = 0;
    localStorage.setItem("SandBox.foreground", colSet);
    switch (colSet % 13) {
        case 0:
            material1 = [0.96, 0.87, 0.68];
            material2 = [0.0, 0.0, 0.0];
            material3 = [0.66, 0.57, 0.38];
            material4 = [.6, 0.6, 0.6];
            material5 = [0.96, 0.87, 0.68];
            break;
        case 1:
            material1 = [0.96, 0.87, 0.68];
            material2 = [.6, .6, .6];
            material3 = [0.66, 0.57, 0.38];
            material4 = [.3, .3, .3];
            material5 = [0.96, 0.87, 0.68];
            break;
        case 2:
            material1 = [0.66, 0.57, 0.38];
            material2 = [0.0, 0.0, 0.0];
            material3 = [0.66, 0.57, 0.38];
            material4 = [1., 1., 1.];
            material5 = [0.96, 0.87, 0.68];
            break;
        case 3:
            material1 = [0.66, 0.57, 0.38];
            material2 = [1., 1., 1.];
            material3 = [0.66, 0.57, 0.38];
            material4 = [.6, 0.6, 0.6];
            material5 = [0.96, 0.87, 0.68];
            break;
        case 4:
            material1 = [0., 0., 0.];
            material2 = [1., 1., 1.];
            material3 = [0., 0., 0.];
            material4 = [1., 1., 1.];
            material5 = [0., 0., 0.];
            break;
        case 5:
            material1 = [1., 1., 1.];
            material2 = [0., 0., 0.];
            material3 = [1., 1., 1.];
            material4 = [0., 0., 0.];
            material5 = [1., 1., 1.];
            break;
        case 6:
            material1 = [1., 1., 1.];
            material2 = [0., 0., 0.];
            material3 = [1., 1., 1.];
            material4 = [.3, .3, .3];
            material5 = [.6, .3, .3];
            break;
        case 7:
            material1 = [1., 0., 0.];
            material2 = [0., 1., 0.];
            material3 = [0., 0., 1.];
            material4 = [.0, .0, .0];
            material5 = [1., 1., 1.];
            break;
        case 8:
            material1 = [1., 0., 0.];
            material2 = [0., 1., 0.];
            material3 = [0., 0., 1.];
            material4 = [1., 1., 1.];
            material5 = [.0, .0, .0];
            break;
        case 9:
            material1 = [1., 0., 0.];
            material2 = [0., 1., 0.];
            material3 = [0., 0., 1.];
            material4 = [.3, .3, .3];
            material5 = [.6, .6, .6];
            break;
        case 10:
            material1 = [1., 1., 0.];
            material2 = [0., 1., 1.];
            material3 = [1., 0., 1.];
            material4 = [0., 0., 0.];
            material5 = [1., 1., 1.];
            break;
        case 11:
            material1 = [1., 1., 0.];
            material2 = [0., 1., 1.];
            material3 = [1., 0., 1.];
            material4 = [1., 1., 1.];
            material5 = [.0, .0, .0];
            break;
        case 12:
            material1 = [1., 1., 0.];
            material2 = [0., 1., 1.];
            material3 = [1., 0., 1.];
            material4 = [.3, 3., 3.];
            material5 = [.6, .6, .6];
            break;
    }
}

function ChangeBackground() {
    PlaySound("back.mp3");
    if (setNo > 32)
        setNo = 1;
    localStorage.setItem("SandBox.background", setNo);

    if (isOdd(setNo))
        backCol = [0.66, 0.57, 0.38];
    else
        backCol = [0.96, 0.87, 0.68];
    switch (setNo) {
        case 1:
        case 2:
            canvas.style.filter = "hue-rotate(0deg)";
            break;
        case 3:
        case 4:
            canvas.style.filter = "hue-rotate(45deg)";
            break;
        case 5:
        case 6:
            canvas.style.filter = "hue-rotate(90deg)";
            break;
        case 7:
        case 8:
            canvas.style.filter = "hue-rotate(135deg)";
            break;
        case 9:
        case 10:
            canvas.style.filter = "hue-rotate(180deg)";
            break;
        case 11:
        case 12:
            canvas.style.filter = "hue-rotate(225deg)";
            break;
        case 13:
        case 14:
            canvas.style.filter = "hue-rotate(270deg)";
            break;
        case 15:
        case 16:
            canvas.style.filter = "hue-rotate(315deg)";
            break;
        case 17:
        case 18:
            canvas.style.filter = "hue-rotate(0deg) invert(100%)";
            break;
        case 19:
        case 20:
            canvas.style.filter = "hue-rotate(45deg) invert(100%)";
            break;
        case 21:
        case 22:
            canvas.style.filter = "hue-rotate(90deg) invert(100%)";
            break;
        case 23:
        case 24:
            canvas.style.filter = "hue-rotate(135deg) invert(100%)";
            break;
        case 25:
        case 26:
            canvas.style.filter = "hue-rotate(180deg) invert(100%)";
            break;
        case 27:
        case 28:
            canvas.style.filter = "hue-rotate(225deg) invert(100%)";
            break;
        case 29:
        case 30:
            canvas.style.filter = "hue-rotate(270deg) invert(100%)";
            break;
        case 31:
        case 32:
            canvas.style.filter = "hue-rotate(315deg) invert(100%)";
            break;

    }
}

function init() {
    if ('serviceWorker ' in navigator) {
        navigator.serviceWorker
            .register('./sw.js');
    }
    var splash = document.querySelector('splash');
    var crosshairs = document.querySelector('crosshairs');
    crosshairs.hidden = true;
    button = document.querySelector('button');
    button1 = document.querySelector('button1');
    button2 = document.querySelector('button2');

    window.requestAnimFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 300);
        };
    var tmr = window.setTimeout(function () {
        //        if (document.body.requestFullscreen) {
        //            document.body.requestFullscreen();
        //        } else if (document.body.msRequestFullscreen) {
        //            document.body.msRequestFullscreen();
        //        } else if (document.body.mozRequestFullScreen) {
        //            document.body.mozRequestFullScreen();
        //        } else if (document.body.webkitRequestFullscreen) {
        //            document.body.webkitRequestFullscreen();
        //        }
        splash.hidden = true;
    }, 5000); // hide Splash screen after 2.5 seconds
    splash.onclick = function (e) {
        clearTimeout(tmr);
        //        if (document.body.requestFullscreen) {
        //            document.body.requestFullscreen();
        //        } else if (document.body.msRequestFullscreen) {
        //            document.body.msRequestFullscreen();
        //        } else if (document.body.mozRequestFullScreen) {
        //            document.body.mozRequestFullScreen();
        //        } else if (document.body.webkitRequestFullscreen) {
        //            document.body.webkitRequestFullscreen();
        //        }
        splash.hidden = true;
    }

    button.onmousedown = function (e) {
        event.preventDefault();
        colSet++;
        ChangeForeground();
    }
    button1.onmousedown = function (e) {
        event.preventDefault();
        setNo++;
        ChangeBackground();
    }
    button2.onmousedown = function (e) {
        event.preventDefault();
        ClearScreen();
    }

    canvas = document.getElementById("glcanvas");
    body = document.getElementsByTagName("body")[0];

    window.onmousemove = onMouseMove;
    window.onmousedown = onMouseDown;
    window.onmouseup = onMouseUp;
    //    canvas.onmouseout = function () {
    //        mouseout = true;
    //    };
    //    canvas.onmouseenter = function () {
    //        mouseout = false;
    //    };
    window.onkeydown = onKeyDown;
    window.onkeyup = onKeyUp;

    window.onresize = onResize;

    parseInt(localStorage.getItem("SandBox.foreground")) || 0;
    ChangeForeground();
    setNo = parseInt(localStorage.getItem("SandBox.background")) || 0;
    if (setNo < 1)
        setNo = 1;
    ChangeBackground();
    mute = false;

    GPU = initGPUMath();

    // setup a GLSL programs
    GPU.createProgram("advect", "2d-vertex-shader", "advectShader");
    GPU.setUniformForProgram("advect", "u_dt", dt, "1f");
    GPU.setUniformForProgram("advect", "u_velocity", 0, "1i");
    GPU.setUniformForProgram("advect", "u_material", 1, "1i");

    GPU.createProgram("gradientSubtraction", "2d-vertex-shader", "gradientSubtractionShader");
    GPU.setUniformForProgram("gradientSubtraction", "u_const", 0.5 / dx, "1f"); //dt/(2*rho*dx)
    GPU.setUniformForProgram("gradientSubtraction", "u_velocity", 0, "1i");
    GPU.setUniformForProgram("gradientSubtraction", "u_pressure", 1, "1i");

    GPU.createProgram("diverge", "2d-vertex-shader", "divergenceShader");
    GPU.setUniformForProgram("diverge", "u_const", .5 / dx, "1f"); //-2*dx*rho/dt
    GPU.setUniformForProgram("diverge", "u_velocity", 0, "1i");

    GPU.createProgram("force", "2d-vertex-shader", "forceShader");
    GPU.setUniformForProgram("force", "u_dt", dt, "1f");
    GPU.setUniformForProgram("force", "u_velocity", 0, "1i");
    GPU.setUniformForProgram("force", "u_viscocity", 1, "1f");

    GPU.createProgram("addMaterial", "2d-vertex-shader", "addMaterialShader");
    GPU.setUniformForProgram("force", "u_material", 0, "1i");

    GPU.createProgram("jacobi", "2d-vertex-shader", "jacobiShader");
    GPU.setUniformForProgram("jacobi", "u_b", 0, "1i");
    GPU.setUniformForProgram("jacobi", "u_x", 1, "1i");

    GPU.createProgram("render", "2d-vertex-shader", "2d-render-shader");
    GPU.setUniformForProgram("render", "u_material", 0, "1i");
    GPU.setUniformForProgram("render", "u_cols", numColours, "1f");
    GPU.setUniformForProgram("render", "u_backCol", backCol, "3f");
    GPU.setUniformForProgram("render", "u_m1", material1, "3f");
    GPU.setUniformForProgram("render", "u_m2", material2, "3f");
    GPU.setUniformForProgram("render", "u_m3", material3, "3f");
    GPU.setUniformForProgram("render", "u_m4", material4, "3f");
    GPU.setUniformForProgram("render", "u_m5", material5, "3f");
    GPU.createProgram("boundary", "2d-vertex-shader", "boundaryShader");
    GPU.setUniformForProgram("boundary", "u_texture", 0, "1i");

    GPU.createProgram("packToBytes", "2d-vertex-shader", "packToBytesShader");
    GPU.setUniformForProgram("packToBytes", "u_floatTextureDim", [particlesTextureDim, particlesTextureDim], "2f");

    GPU.createProgram("moveParticles", "2d-vertex-shader", "moveParticlesShader");
    GPU.setUniformForProgram("moveParticles", "u_particles", 0, "1i");
    GPU.setUniformForProgram("moveParticles", "u_velocity", 1, "1i");
    GPU.setUniformForProgram("moveParticles", "u_textureSize", [particlesTextureDim, particlesTextureDim], "2f");
    GPU.setUniformForProgram("moveParticles", "u_dt", 0.5, "1f");

    threeView = initThreeView();

    geo = new THREE.BufferGeometry();
    geo.dynamic = true;
    particlesVertices = new Float32Array(numParticles * 3);
    geo.addAttribute('position', new THREE.BufferAttribute(particlesVertices, 3));
    particles = new THREE.Points(geo, new THREE.PointsMaterial({
        size: 0.04, // PB sand size .04, .1, .004
        opacity: 0.5, // PB .5, .1
        transparent: false,
        depthTest: false,
        color: 0x000033 // PB colour of sand
    }));
    threeView.scene.add(particles);

    GPU.initTextureFromData("outputParticleBytes", particlesTextureDim * vectorLength, particlesTextureDim, "UNSIGNED_BYTE", null); //2 comp vector [x,y]
    GPU.initFrameBufferForTexture("outputParticleBytes", true);

    resetWindow();

    render();
}

function setThree() {
    for (var i = 0; i < numParticles; i++) {
        var vertex = new THREE.Vector3(Math.random() * actualWidth, Math.random() * actualHeight, 0);
        particleData[i * 4] = vertex.x;
        particleData[i * 4 + 1] = vertex.y;
        particlesVertices[3 * i] = vertex.x;
        particlesVertices[3 * i + 1] = vertex.y;
    }
    particles.position.set(-actualWidth / 2, -actualHeight / 2, 0);
    threeView.render();

    GPU.initTextureFromData("particles", particlesTextureDim, particlesTextureDim, "FLOAT", particleData, true);
    GPU.initFrameBufferForTexture("particles", true);
    GPU.initTextureFromData("nextParticles", particlesTextureDim, particlesTextureDim, "FLOAT", particleData, true);
    GPU.initFrameBufferForTexture("nextParticles", true);
}

function render() {

    if (!paused) {

        // //advect velocity
        GPU.setSize(width, height);
        GPU.setProgram("advect");
        GPU.setUniformForProgram("advect", "u_textureSize", [width, height], "2f");
        GPU.setUniformForProgram("advect", "u_scale", 1, "1f");
        GPU.step("advect", ["velocity", "velocity"], "nextVelocity");

        GPU.setProgram("boundary");
        GPU.setUniformForProgram("boundary", "u_scale", -1, "1f");
        GPU.step("boundary", ["nextVelocity"], "velocity");
        // GPU.swapTextures("velocity", "nextVelocity");

        //diffuse velocity
        GPU.setProgram("jacobi");
        var alpha = dx * dx / (nu * dt);
        GPU.setUniformForProgram("jacobi", "u_alpha", alpha, "1f");
        GPU.setUniformForProgram("jacobi", "u_reciprocalBeta", 1 / (4 + alpha), "1f");
        for (var i = 0; i < 1; i++) {
            GPU.step("jacobi", ["velocity", "velocity"], "nextVelocity");
            GPU.step("jacobi", ["nextVelocity", "nextVelocity"], "velocity");
        }

        //apply force
        GPU.setProgram("force");
        if (!mouseout && mouseEnable) {
            GPU.setUniformForProgram("force", "u_mouseEnable", 1.0, "1f");
            GPU.setUniformForProgram("force", "u_mouseCoord", [mouseCoordinates[0] * scale, mouseCoordinates[1] * scale], "2f");
            GPU.setUniformForProgram("force", "u_mouseDir", [3 * (mouseCoordinates[0] - lastMouseCoordinates[0]) * scale,
                3 * (mouseCoordinates[1] - lastMouseCoordinates[1]) * scale], "2f");
        } else {
            GPU.setUniformForProgram("force", "u_mouseEnable", 0.0, "1f");
        }
        GPU.setUniformForProgram("force", "u_reciprocalRadius", viscocity * 0.03 / scale, "1f");
        GPU.step("force", ["velocity"], "nextVelocity");

        // GPU.swapTextures("velocity", "nextVelocity");
        GPU.step("boundary", ["nextVelocity"], "velocity");

        // compute pressure
        GPU.step("diverge", ["velocity"], "velocityDivergence"); //calc velocity divergence
        GPU.setProgram("jacobi");
        GPU.setUniformForProgram("jacobi", "u_alpha", -dx * dx, "1f");
        GPU.setUniformForProgram("jacobi", "u_reciprocalBeta", 1 / 4, "1f");
        for (var i = 0; i < 10; i++) {
            GPU.step("jacobi", ["velocityDivergence", "pressure"], "nextPressure");
            GPU.step("jacobi", ["velocityDivergence", "nextPressure"], "pressure");
        }
        GPU.setProgram("boundary");
        GPU.setUniformForProgram("boundary", "u_scale", 1, "1f");
        GPU.step("boundary", ["pressure"], "nextPressure");
        GPU.swapTextures("pressure", "nextPressure");

        // subtract pressure gradient
        GPU.step("gradientSubtraction", ["velocity", "pressure"], "nextVelocity");
        GPU.setProgram("boundary");
        GPU.setUniformForProgram("boundary", "u_scale", -1, "1f");
        GPU.step("boundary", ["nextVelocity"], "velocity");

        // move material
        GPU.setSize(actualWidth, actualHeight);

        //add material
        GPU.setProgram("addMaterial");
        if (!mouseout && mouseEnable) {
            GPU.setUniformForProgram("addMaterial", "u_mouseEnable", 1.0, "1f");
            GPU.setUniformForProgram("addMaterial", "u_decay", decay, "1f"); // PB decay 0.002
            GPU.setUniformForProgram("addMaterial", "u_mouseCoord", mouseCoordinates, "2f");
            GPU.setUniformForProgram("addMaterial", "u_mouseLength", Math.sqrt(Math.pow(3 * (mouseCoordinates[0] - lastMouseCoordinates[0]), 2) +
                Math.pow(3 * (mouseCoordinates[1] - lastMouseCoordinates[1]), 2)), "1f");
        } else {
            GPU.setUniformForProgram("addMaterial", "u_mouseEnable", 0.0, "1f");
            GPU.setUniformForProgram("addMaterial", "u_decay", decay, "1f"); // PB decay 0.002
        }
        GPU.step("addMaterial", ["material"], "nextMaterial");

        GPU.setProgram("advect");
        GPU.setUniformForProgram("advect", "u_textureSize", [actualWidth, actualHeight], "2f");
        GPU.setUniformForProgram("advect", "u_scale", scale, "1f");
        GPU.step("advect", ["velocity", "nextMaterial"], "material");
        GPU.step("render", ["material"]);

        GPU.setUniformForProgram("render", "u_cols", numColours, "1f"); // PB
        GPU.setUniformForProgram("render", "u_backCol", backCol, "3f");
        GPU.setUniformForProgram("render", "u_m1", material1, "3f");
        GPU.setUniformForProgram("render", "u_m2", material2, "3f");
        GPU.setUniformForProgram("render", "u_m3", material3, "3f");
        GPU.setUniformForProgram("render", "u_m4", material4, "3f");
        GPU.setUniformForProgram("render", "u_m5", material5, "3f");
        GPU.setUniformForProgram("force", "u_viscocity", 1, "1f");
    } else resetWindow();

    //move particles
    //http://voxelent.com/html/beginners-guide/chapter_10/ch10_PointSprites.html
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    //http://stackoverflow.com/questions/5497722/how-can-i-animate-an-object-in-webgl-modify-specific-vertices-not-full-transfor
    GPU.setSize(particlesTextureDim, particlesTextureDim);
    GPU.step("moveParticles", ["particles", "velocity"], "nextParticles");
    GPU.step("moveParticles", ["nextParticles", "velocity"], "particles");

    GPU.setSize(particlesTextureDim * vectorLength, particlesTextureDim);
    GPU.setProgram("packToBytes");
    GPU.setUniformForProgram("packToBytes", "u_vectorLength", vectorLength, "1f");
    GPU.step("packToBytes", ["particles"], "outputParticleBytes");
    var pixels = new Uint8Array(numParticles * 4 * vectorLength);
    if (GPU.readyToRead()) {
        GPU.readPixels(0, 0, particlesTextureDim * vectorLength, particlesTextureDim, pixels);
        var parsedPixels = new Float32Array(pixels.buffer);
        for (var i = 0; i < numParticles; i++) {
            particlesVertices[3 * i] = parsedPixels[vectorLength * i];
            particlesVertices[3 * i + 1] = parsedPixels[vectorLength * i + 1];
        }
        particles.geometry.attributes.position.needsUpdate = true;
        threeView.render();
    }

    window.requestAnimationFrame(render);
}

function onResize() {
    paused = true;
    threeView.onWindowResize();
}

function resetWindow() {
    firstPress = true;

    actualWidth = Math.round(body.clientWidth);
    actualHeight = Math.round(body.clientHeight);

    var maxDim = Math.max(actualHeight, actualWidth);
    var _scale = Math.ceil(maxDim / 150);
    if (_scale < 1) _scale = 1;

    width = Math.floor(actualWidth / _scale);
    height = Math.floor(actualHeight / _scale);

    scale = 1 / _scale;

    canvas.width = actualWidth;
    canvas.height = actualHeight;
    canvas.clientWidth = body.clientWidth;
    canvas.clientHeight = body.clientHeight;

    // GPU.setSize(width, height);

    GPU.setProgram("gradientSubtraction");
    GPU.setUniformForProgram("gradientSubtraction", "u_textureSize", [width, height], "2f");
    GPU.setProgram("diverge");
    GPU.setUniformForProgram("diverge", "u_textureSize", [width, height], "2f");
    GPU.setProgram("force");
    GPU.setUniformForProgram("force", "u_reciprocalRadius", viscocity * 0.03 / scale, "1f");
    GPU.setUniformForProgram("force", "u_textureSize", [width, height], "2f");
    GPU.setProgram("addMaterial");
    GPU.setUniformForProgram("addMaterial", "u_reciprocalRadius", 0.03, "1f");
    GPU.setUniformForProgram("addMaterial", "u_textureSize", [actualWidth, actualHeight], "2f");
    GPU.setProgram("jacobi");
    GPU.setUniformForProgram("jacobi", "u_textureSize", [width, height], "2f");
    GPU.setProgram("render");
    GPU.setUniformForProgram("render", "u_textureSize", [actualWidth, actualHeight], "2f");
    GPU.setUniformForProgram("render", "u_cols", numColours, "1f"); // PB number of colours
    GPU.setUniformForProgram("render", "u_backCol", backCol, "3f");
    //    material1 = [0., 0., 0.];
    GPU.setUniformForProgram("render", "u_m1", material1, "3f");
    GPU.setUniformForProgram("render", "u_m2", material2, "3f");
    GPU.setUniformForProgram("render", "u_m3", material3, "3f");
    GPU.setUniformForProgram("render", "u_m4", material4, "3f");
    GPU.setUniformForProgram("render", "u_m5", material5, "3f");
    GPU.setProgram("boundary");
    GPU.setUniformForProgram("boundary", "u_textureSize", [width, height], "2f");
    GPU.setProgram("moveParticles");
    GPU.setUniformForProgram("moveParticles", "u_velocityTextureSize", [width, height], "2f");
    GPU.setUniformForProgram("moveParticles", "u_screenSize", [actualWidth, actualHeight], "2f");
    GPU.setUniformForProgram("moveParticles", "u_scale", scale, "1f");

    var velocity = new Float32Array(width * height * 4);
    // for (var i=0;i<height;i++){
    //     for (var j=0;j<width;j++){
    //         var index = 4*(i*width+j);
    //         velocity[index] = Math.sin(2*Math.PI*i/200)/10;
    //         velocity[index+1] = Math.sin(2*Math.PI*j/200)/10;
    //     }
    // }
    GPU.initTextureFromData("velocity", width, height, "FLOAT", velocity, true);
    GPU.initFrameBufferForTexture("velocity", true);
    GPU.initTextureFromData("nextVelocity", width, height, "FLOAT", new Float32Array(width * height * 4), true);
    GPU.initFrameBufferForTexture("nextVelocity", true);

    GPU.initTextureFromData("velocityDivergence", width, height, "FLOAT", new Float32Array(width * height * 4), true);
    GPU.initFrameBufferForTexture("velocityDivergence", true);
    GPU.initTextureFromData("pressure", width, height, "FLOAT", new Float32Array(width * height * 4), true);
    GPU.initFrameBufferForTexture("pressure", true);
    GPU.initTextureFromData("nextPressure", width, height, "FLOAT", new Float32Array(width * height * 4), true);
    GPU.initFrameBufferForTexture("nextPressure", true);

    var material = new Float32Array(actualWidth * actualHeight * 4);
    // for (var i=0;i<actualHeight;i++){
    //     for (var j=0;j<actualWidth;j++){
    //         var index = 4*(i*actualWidth+j);
    //         if (((Math.floor(i/50))%2 && (Math.floor(j/50))%2)
    //             || ((Math.floor(i/50))%2 == 0 && (Math.floor(j/50))%2 == 0)) material[index] = 1.0;
    //     }
    // }
    GPU.initTextureFromData("material", actualWidth, actualHeight, "FLOAT", material, true);
    GPU.initFrameBufferForTexture("material", true);
    GPU.initTextureFromData("nextMaterial", actualWidth, actualHeight, "FLOAT", material, true);
    GPU.initFrameBufferForTexture("nextMaterial", true);

    setThree();

    paused = false;
}

var audio;

function PlaySound(s) {
    if (mute)
        return;
    if (audio != undefined)
        audio.pause();
    s = "Sounds/" + s;
    try {
        audio = new Audio(s);
        audio.play();
        console.log('Sound: ' + s);
    } catch (e) {};
}

function toggleButtons() {
    button.hidden = !button.hidden;
    button1.hidden = !button1.hidden;
    button2.hidden = !button2.hidden;
}

function onKeyDown(e) {
    event.preventDefault();
    if (!e) e = window.event;
    if (e.repeat)
        return;
    switch (e.keyCode) {
        case 32:
        case 49:
            setNo++;
            ChangeBackground();
            break;
        case 50:
        case 13:
            colSet++;
            ChangeForeground();
            break;
        case 51:
            ClearScreen();
            break;
        case 52:
            ClearScreen();
            break;
        case 53:
            toggleButtons();
            break;
        case 189:
            //buttonl
            break;
        case 187: // + 
            break;
        case 27:
            ClearScreen();
            break;

    }
    return false;
}

function onKeyUp(e) {}

function onMouseMove(e) {
    lastMouseCoordinates = mouseCoordinates;
    mouseCoordinates = [e.clientX, actualHeight - e.clientY];
}

function onMouseDown(e) {
    if (firstPress) {
        firstPress = false;
        lastMouseCoordinates = [e.clientX, actualHeight - e.clientY];
    }
    mouseCoordinates[e.clientX, actualHeight - e.clientY];
    mouseEnable = true;
}

function onMouseUp() {
    mouseEnable = false;
}
