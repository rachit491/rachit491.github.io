///<reference path="lib/pixi.js.d.ts" />

//considering 3x3 grid with 200px x 200px images for scratch cards
var size = [600, 600];
var ratio = size[0]/size[1];
var scratchPad = new PIXI.Application(600, 600);
document.body.appendChild(scratchPad.view);
var stage = scratchPad.stage;

var brush = new PIXI.Graphics();
brush.beginFill(0xffffff);
brush.drawCircle(0, 0, 15);
brush.endFill();

//function to change resoltion as per device
resize();

PIXI.loader.add("foreground", "assets/Starbucks-New-Logo.png");
PIXI.loader.add("background-1", "assets/mortal-kombat-logo.png");
PIXI.loader.add("background-2", "assets/BomberMario-icon.jpg");
PIXI.loader.add("background-3", "assets/shield2.jpg");
PIXI.loader.load(setup);

function setup(loader, resources) {
    var foreground = [];
    var imageToReveal = [];
    var renderTexture = [];
    var renderTextureSprite = [];

    for(var i=0; i<9; i++) {
        //foreground image as a cover for actual image
        foreground.push(new PIXI.Sprite(resources["foreground"].texture));
        stage.addChild(foreground[i]);
        foreground[i].position.x = (i%3)*200;
        foreground[i].position.y = Math.floor(i/3)*200;
        foreground[i].width = scratchPad.screen.width/3;
        foreground[i].height = scratchPad.screen.height/3;

        imageToReveal.push(new PIXI.Sprite(resources["background-"+ (Math.floor(Math.random()*3)+1)].texture));
        stage.addChild(imageToReveal[i]);
        imageToReveal[i].position.x = (i%3)*200;
        imageToReveal[i].position.y = Math.floor(i/3)*200;
        imageToReveal[i].width = scratchPad.screen.width/3;
        imageToReveal[i].height = scratchPad.screen.height/3;

        //renderer for the texture
        renderTexture.push(PIXI.RenderTexture.create(scratchPad.screen.width, scratchPad.screen.height));

        renderTextureSprite.push(new PIXI.Sprite(renderTexture[i]));
        stage.addChild(renderTextureSprite[i]);
        imageToReveal[i].mask = renderTextureSprite[i];
    }

    scratchPad.stage.interactive = true;
    scratchPad.stage.on('pointerdown', down);
    scratchPad.stage.on('pointerup', up);
    scratchPad.stage.on('pointermove', move);

    var dragging = false;

    //function to check for mouse drag
    function move(event) {
        if (dragging) {
            brush.position.copy(event.data.global);
            var index = getIndex(event.data.global);
            scratchPad.renderer.render(brush, renderTexture[index], false, null, false);
        }
    }

    function down(event) {
        dragging = true;
        move(event);
    }

    function up(event) {
        dragging = false;
    }

    //get the localized coordinates in the 3x3 grid system
    function getIndex(position) {
        var index = [[0, 1, 2],
                     [3, 4, 5],
                     [6, 7, 8]];
        var x = Math.floor(position.x/200);
        var y = Math.floor(position.y/200);
        console.log(index[y][x]);
        return index[y][x];
    }
}

function resize() {
    if (window.innerWidth / window.innerHeight >= ratio) {
        var w = window.innerHeight * ratio;
        var h = window.innerHeight;
    } else {
        var w = window.innerWidth;
        var h = window.innerWidth / ratio;
    }
    scratchPad.view.style.width = w + 'px';
    scratchPad.view.style.height = h + 'px';
}
window.onresize = resize;