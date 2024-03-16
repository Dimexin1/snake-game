let isSpeedMode = false;
let areWallsEnabled = true;

const gameContainer = document.createElement('div');
gameContainer.id = 'game-container';
document.body.appendChild(gameContainer);


const canvas = document.createElement('canvas');
canvas.id = 'game';
canvas.className = 'board';
canvas.width = 400;
canvas.height = 400;
gameContainer.appendChild(canvas);

const controlsContainer = document.createElement('div');
controlsContainer.id = 'controls-container';
gameContainer.appendChild(controlsContainer);

    const right = document.createElement('div');
    right.id = 'right';
    right.className = 'desno';
    controlsContainer.appendChild(right);

    let mute = document.createElement('input');
    mute.type = 'checkbox';
    mute.id = 'mute';
    mute.className = 'mute';
    
    let labelMute = document.createElement('label');
    labelMute.innerHTML = "MUTE";
    labelMute.setAttribute('for', 'mute');

    let restart = document.createElement('button');
    restart.id = 'restart';
    restart.className = 'restart';
    restart.textContent = 'RESTART';
    controlsContainer.appendChild(restart);
    restart.addEventListener('click', function () {
        
        location.reload();  
    });
    

    const titleContainer = document.createElement('div');
    titleContainer.id = 'title-container';
    titleContainer.innerHTML = '<h1 id="game-title">Snake Game</h1>';
    
    document.body.insertBefore(titleContainer, gameContainer);

    const gameTitle = document.getElementById('game-title');

    let gameMode = document.createElement('select');
    gameMode.id = 'game-mode';
    gameMode.className = 'game-mode';
    
    controlsContainer.appendChild(gameMode);

    let normalMode = document.createElement('option');
    normalMode.value = 'NormalMode';
    normalMode.text = 'Normal Mode';

    let reverseMode = document.createElement('option');
    reverseMode.value = 'ReverseMode';
    reverseMode.text = 'Reverse Mode';

    let speedMode = document.createElement('option');
    speedMode.value = 'SpeedMode';
    speedMode.text = 'Speed Mode';

    gameMode.add(normalMode);
    gameMode.add(reverseMode);
    gameMode.add(speedMode);

    gameMode.addEventListener('change', function () {
          
        let Opcija = gameMode.options[gameMode.selectedIndex].value;

        switch (Opcija) {
            case 'NormalMode':
                setNormalMode();
                break;
            case 'ReverseMode':
                setReverseMode();
                break;
            case 'SpeedMode':
                setSpeedMode();
                break;
            default:
               
        }
    });

    function setNormalMode() {
        speed = 7;
    }

    function setReverseMode() {
        speed = 7;
          
        document.body.removeEventListener('keydown', keyDown);
        document.body.addEventListener('keydown', reverseKeyDown);
    }

    function setSpeedMode() {
        speed = 21;
        isSpeedMode = true;
    }

    const gameSound = new Audio("music.mp3");

    mute.addEventListener('change', function () {
        if (mute.checked) {
            gameSound.pause();
        } else {
            gameSound.play();
        }
    });

    gameSound.play();

    document.body.appendChild(labelMute);
    document.body.appendChild(mute);

    class SnakePart {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    let speed = 7;

    let tileCount = 20;
    let tileSize = canvas.width / tileCount;

    let headX = 10;
    let headY = 10;
    const snakeParts = [];
    let tailLength = 2;

    let appleX = 5;
    let appleY = 5;

    let inputsXVelocity = 0;
    let inputsYVelocity = 0;

    let xVelocity = 0;
    let yVelocity = 0;

    let score = 0;

    const gulpSound = new Audio("gulp.mp3");

    const ctx = canvas.getContext("2d");

    let snakeBodyColor = 'lime';
    let snakeHeadColor = 'lime';

    function createColorDropdown(labelText, id, defaultColor) {
        let colorDropdown = document.createElement('div');

        let label = document.createElement('label');
        label.textContent = labelText;
        colorDropdown.appendChild(label);

        let select = document.createElement('select');
        select.id = id;
        select.className = 'color-dropdown';

        let colors = ['lime', 'blue', 'red', 'yellow', 'purple'];
        colors.forEach(color => {
            let option = document.createElement('option');
            option.value = color;
            option.text = color.charAt(0).toUpperCase() + color.slice(1);
            select.add(option);
        });
  
        select.value = defaultColor;
        colorDropdown.appendChild(select);
 
        select.addEventListener('change', function () {
            if (id === 'body-color') {
                snakeBodyColor = select.value;
            } else if (id === 'head-color') {
                snakeHeadColor = select.value;
            }
        });

        return colorDropdown;
    }

    const headColorDropdown = createColorDropdown('Head Color:', 'head-color', snakeHeadColor);
    const bodyColorDropdown = createColorDropdown('Body Color:', 'body-color', snakeBodyColor);

    controlsContainer.appendChild(headColorDropdown);
    controlsContainer.appendChild(bodyColorDropdown);

    let wallCheckbox = document.createElement('input');
    wallCheckbox.type = 'checkbox';
    wallCheckbox.id = 'walls';
    wallCheckbox.className = 'walls';
    let labelWalls = document.createElement('label');
    labelWalls.innerHTML = "Walls";
    labelWalls.setAttribute('for', 'walls');
    controlsContainer.appendChild(wallCheckbox);
    controlsContainer.appendChild(labelWalls);

    wallCheckbox.addEventListener('change', function () {
        areWallsEnabled = !wallCheckbox.checked;
    });

    function isWallCollision() {
        if (areWallsEnabled) {
            
            return headX < 0 || headX === tileCount || headY < 0 || headY === tileCount;
        } else {
            
            if (headX < 0) {
                headX = tileCount - 1;
            } else if (headX === tileCount) {
                headX = 0;
            }
    
            if (headY < 0) {
                headY = tileCount - 1;
            } else if (headY === tileCount) {
                headY = 0;
            }
    
            
            return false;
        }
    }

    function isGameOver() {
        let gameOver = false;
 
        if (yVelocity === 0 && xVelocity === 0) {
            return false;
        }

        if (isWallCollision()) {
            gameOver = true;
        }

        for (let i = 0; i < snakeParts.length; i++) {
            let part = snakeParts[i];
            if (part.x === headX && part.y === headY) {
                gameOver = true;
                break;
            }
        }

        if (gameOver) {
            ctx.fillStyle = "white";
            ctx.font = "50px Verdana";

            var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop("0", " magenta");
            gradient.addColorStop("0.5", "blue");
            gradient.addColorStop("1.0", "red");
            ctx.fillStyle = gradient;

            ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
        }

        return gameOver;
    }

    function drawScore() {
        ctx.fillStyle = "white";
        ctx.font = "10px Verdana";
        ctx.fillText("Score " + score, canvas.width - 50, 10);
    }

    function clearScreen() {
      
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
       
      if (areWallsEnabled) {
          drawWalls();
      }
  }

  function drawWalls() {
    
    ctx.fillStyle = "gray"; 
    ctx.fillRect(0, 0, canvas.width, tileSize); // Gornji zid
    ctx.fillRect(0, canvas.height - tileSize, canvas.width, tileSize); // Donji zid
    ctx.fillRect(0, 0, tileSize, canvas.height); // Levi zid
    ctx.fillRect(canvas.width - tileSize, 0, tileSize, canvas.height); // Desni zid
}
  

    function drawSnake() {
        for (let i = 0; i < snakeParts.length; i++) {
            let part = snakeParts[i];
            ctx.fillStyle = i === snakeParts.length - 1 ? snakeHeadColor : snakeBodyColor;
            ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
        }

        snakeParts.push(new SnakePart(headX, headY));
        while (snakeParts.length > tailLength) {
            snakeParts.shift();
        }
    }

    function changeSnakePosition() {
        headX = headX + xVelocity;
        headY = headY + yVelocity;
    }

    function drawApple() {
        ctx.fillStyle = "red";
        ctx.fillRect(appleX * tileSize, appleY * tileSize, tileSize, tileSize);
    }

    function checkAppleCollision() {
        if (!areWallsEnabled) {
            // Ponašanje prelaska preko ivica za glavu zmije
            if (headX < 0) {
                headX = tileCount - 1;
            } else if (headX === tileCount) {
                headX = 0;
            }
    
            if (headY < 0) {
                headY = tileCount - 1;
            } else if (headY === tileCount) {
                headY = 0;
            }
        }
        if (headX === appleX && headY === appleY) {
            
            appleX = Math.floor(Math.random() * tileCount);
            appleY = Math.floor(Math.random() * tileCount);
    
            
            tailLength++;
            score++;
    
            
            gulpSound.play();
        }
        for (let i = 0; i < snakeParts.length; i++) {
            let part = snakeParts[i];
            if (appleX === part.x && appleY === part.y) {
                
                appleX = Math.floor(Math.random() * tileCount);
                appleY = Math.floor(Math.random() * tileCount);
    
                
                i = -1; 
            }
        }
    }


    document.body.addEventListener("keydown", keyDown);

    function keyDown(event) {
        if (event.keyCode == 38 || event.keyCode == 87) {
            if (inputsYVelocity == 1) return;
            inputsYVelocity = -1;
            inputsXVelocity = 0;
        }

        if (event.keyCode == 40 || event.keyCode == 83) {
            if (inputsYVelocity == -1) return;
            inputsYVelocity = 1;
            inputsXVelocity = 0;
        }

        if (event.keyCode == 37 || event.keyCode == 65) {
            if (inputsXVelocity == 1) return;
            inputsYVelocity = 0;
            inputsXVelocity = -1;
        }

        if (event.keyCode == 39 || event.keyCode == 68) {
            if (inputsXVelocity == -1) return;
            inputsYVelocity = 0;
            inputsXVelocity = 1;
        }
    }

    function reverseKeyDown(event) {
        if (event.keyCode == 40 || event.keyCode == 83) {
            if (inputsYVelocity == 1) return;
            inputsYVelocity = -1;
            inputsXVelocity = 0;
        }

        if (event.keyCode == 38 || event.keyCode == 87) {
            if (inputsYVelocity == -1) return;
            inputsYVelocity = 1;
            inputsXVelocity = 0;
        }

        if (event.keyCode == 39 || event.keyCode == 68) {
            if (inputsXVelocity == 1) return;
            inputsYVelocity = 0;
            inputsXVelocity = -1;
        }

        if (event.keyCode == 37 || event.keyCode == 65) {
            if (inputsXVelocity == -1) return;
            inputsYVelocity = 0;
            inputsXVelocity = 1;
        }
    }

    
    function drawGame() {
        xVelocity = inputsXVelocity;
        yVelocity = inputsYVelocity;
     
        changeSnakePosition();
    
        //prelazak preko ivica
        if (!areWallsEnabled) {
            if (headX < 0) {
                headX = tileCount - 1;
            } else if (headX === tileCount) {
                headX = 0;
            }
    
            if (headY < 0) {
                headY = tileCount - 1;
            } else if (headY === tileCount) {
                headY = 0;
            }
        }
     
        let result = isGameOver();
        if (result) {
            return;
        }
     
        clearScreen();
    
        
        if (areWallsEnabled) {
            
            checkAppleCollision();
            drawApple();
            drawSnake();
        } else {
            
            checkAppleCollision();
            drawApple();
            drawSnake();
        }
     
        drawScore();
    
        if (isSpeedMode === true) {
            if (score > 5) {
                speed = 27;
            }
            if (score > 10) {
                speed = 33;
            }
        } else {
            if (score > 5) {
                speed = 9;
            }
            if (score > 10) {
                speed = 11;
            }
        }
    
        setTimeout(drawGame, 1000 / speed);
    }
    
    drawGame();