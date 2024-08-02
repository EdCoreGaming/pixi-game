const app = new PIXI.Application();
let sprites = [];
 
// Asynchronous IIFE
(async () => {
    
       await setup();
       await preload();

       let knightFrameKeys = [
        "frame0000.png",
        "frame0001.png",
        "frame0002.png",
        "frame0003.png",
        "frame0004.png",
        "frame0005.png",
        "frame0006.png",
        "frame0007.png",
        "frame0008.png",
        "frame0009.png"
    ];
       let fireFrameKeys = [
        "sprite_00.png",
        "sprite_01.png",
        "sprite_02.png",
        "sprite_03.png",
        "sprite_04.png",
        "sprite_05.png",
        "sprite_06.png",
        "sprite_07.png",
        "sprite_08.png",
        "sprite_09.png"
    ];

    //    let knight;
    //    let fire;
    
        let knight = addSprite(app, 'knight.json', knightFrameKeys, false, 400, 400);
        setInterval(async () => {
            let fire = await addSprite(app, 'fire.json', fireFrameKeys, true, 50, 50);
            // let knight = await addSprite(app, 'knight.json', knightFrameKeys, false, 400, 400);
            moveFireSprite(app, knight);
            moveFireSprite(app, fire);
            console.log(knight.x, knight.y);
        }, 5000); 

       animateBackground(app);

})();

function moveSpriteUp(sprite) {
    const moveDistance = 10;
    sprite.y -= moveDistance;
    console.log(sprite.y);
}

function moveFireSprite(app, sprite) {
    app.ticker.add(() => {
        sprite.x -= 2; 
        if (sprite.x < -sprite.width) {
            app.stage.removeChild(sprite); 
        }
    });
}

async function addSprite(app, jsonFile, frameKeys, isRandomPosition = false, spriteWidth = 50, spriteHeight = 50) {
    try {
        const resources = await PIXI.Assets.load(jsonFile);
        const sheet = resources.textures;
        if (!sheet) {
            throw new Error("Spritesheet not found in resources");
        }

        const frames = [];

        for (const frameKey of frameKeys) {
            const texture = sheet[frameKey];
            if (texture) {
                frames.push(texture);
            } else {
                console.warn(`Texture ${frameKey} not found in spritesheet`);
            }
        }

        const animatedSprite = new PIXI.AnimatedSprite(frames);

        animatedSprite.animationSpeed = 0.30; 
        animatedSprite.loop = true; 
        animatedSprite.play();

        animatedSprite.anchor.set(0.5, 0.5); 

        animatedSprite.width = spriteWidth;
        animatedSprite.height = spriteHeight;

        if (isRandomPosition) {
            animatedSprite.x = app.renderer.width + animatedSprite.width;
            animatedSprite.y = app.renderer.height - 50;
        } else {
            animatedSprite.x = app.renderer.width / 2;
            animatedSprite.y = app.screen.height / 2 + 200;
            console.log(animatedSprite.x, animatedSprite.y, animatedSprite.width, animatedSprite.height);
        }

        app.stage.addChild(animatedSprite);

        sprites.push(animatedSprite);
        return animatedSprite;
    } catch (error) {
        console.error('Error loading assets:', error);
        return null;
    }
}

function addBackground(app) {
    const background = PIXI.Sprite.from('background');

    if (app.screen.width > app.screen.height) {
        background.width = app.screen.width * 1.2;
        background.scale.y = background.scale.x;
    } else {
        background.height = app.screen.height * 1.2;
        background.scale.x = background.scale.y;
    }
    
    return background;
}

function animateBackground(app) {
    const background1 = addBackground(app);
    const background2 = addBackground(app);

    background1.width = app.renderer.width;
    background1.height = app.renderer.height;
    background2.width = app.renderer.width;
    background2.height = app.renderer.height;
   
    background1.x = 0;
    background2.x = background1.width;

    app.stage.addChild(background1, background2);

    app.ticker.add(() => {
        
        background1.x -= 1; 
        background2.x -= 1; 

        if (background1.x <= -background1.width) {
            background1.x = background2.x + background2.width;
        }

        if (background2.x <= -background2.width) {
            background2.x = background1.x + background1.width;
        }
    });
}

async function setup() {
    await app.init({ background: '#1099bb', resizeTo: window });
    document.body.appendChild(app.canvas);
}

async function preload() {
    const assets = [
        { alias: 'background', src: 'Background.png' },
        { alias: 'frame', src: 'frame0000.png'}
    ];

    await PIXI.Assets.load(assets);
}
 