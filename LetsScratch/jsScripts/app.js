///<reference path="lib/pixi.js.d.ts" />
var size = [600, 600];
var ratio = size[0] / size[1];
var app = new PIXI.Application(600, 600);
document.body.appendChild(app.view);
var stage = app.stage;
var brush = new PIXI.Graphics();
brush.beginFill(0xffffff);
brush.drawCircle(0, 0, 15);
brush.endFill();
resize();
PIXI.loader.add("foreground", "assets/Starbucks-New-Logo.png");
PIXI.loader.add("background-1", "assets/mortal-kombat-logo.png");
PIXI.loader.add("background-2", "assets/BomberMario-icon.jpg");
PIXI.loader.add("background-3", "assets/shield2.jpg");
PIXI.loader.load(setup);
function setup(loader, resources) {
    var background = [];
    var imageToReveal = [];
    var renderTexture = [];
    var renderTextureSprite = [];
    for (var i = 0; i < 9; i++) {
        background.push(new PIXI.Sprite(resources["foreground"].texture));
        stage.addChild(background[i]);
        background[i].position.x = (i % 3) * 200;
        background[i].position.y = Math.floor(i / 3) * 200;
        background[i].width = app.screen.width / 3;
        background[i].height = app.screen.height / 3;
        imageToReveal.push(new PIXI.Sprite(resources["background-" + (Math.floor(Math.random() * 3) + 1)].texture));
        stage.addChild(imageToReveal[i]);
        imageToReveal[i].position.x = (i % 3) * 200;
        imageToReveal[i].position.y = Math.floor(i / 3) * 200;
        imageToReveal[i].width = app.screen.width / 3;
        imageToReveal[i].height = app.screen.height / 3;
        renderTexture.push(PIXI.RenderTexture.create(app.screen.width, app.screen.height));
        renderTextureSprite.push(new PIXI.Sprite(renderTexture[i]));
        stage.addChild(renderTextureSprite[i]);
        imageToReveal[i].mask = renderTextureSprite[i];
    }
    app.stage.interactive = true;
    app.stage.on('pointerdown', pointerDown);
    app.stage.on('pointerup', pointerUp);
    app.stage.on('pointermove', pointerMove);
    var dragging = false;
    function pointerMove(event) {
        if (dragging) {
            brush.position.copy(event.data.global);
            var index = getIndex(event.data.global);
            app.renderer.render(brush, renderTexture[index], false, null, false);
        }
    }
    function pointerDown(event) {
        dragging = true;
        pointerMove(event);
    }
    function pointerUp(event) {
        dragging = false;
    }
    function getIndex(position) {
        var index = [[0, 1, 2],
            [3, 4, 5],
            [6, 7, 8]];
        var x = Math.floor(position.x / 200);
        var y = Math.floor(position.y / 200);
        console.log(index[y][x]);
        return index[y][x];
    }
}
function resize() {
    if (window.innerWidth / window.innerHeight >= ratio) {
        var w = window.innerHeight * ratio;
        var h = window.innerHeight;
    }
    else {
        var w = window.innerWidth;
        var h = window.innerWidth / ratio;
    }
    app.view.style.width = w + 'px';
    app.view.style.height = h + 'px';
}
window.onresize = resize;
//# sourceMappingURL=app.js.map