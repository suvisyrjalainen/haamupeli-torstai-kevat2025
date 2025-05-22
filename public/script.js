let BOARD_SIZE = 15
let board; //kenttä tallennetaan tähän

const cellSize = calculateCellSize();

let player;
let playerX;
let playerY;

let ghosts = [];

let ghostInterval;

let score = 0;



document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowUp':
      player.move(0, -1); // Liikuta ylös
      break;
      case 'ArrowDown':
      player.move(0, 1); // Liikuta alas
      break;
      case 'ArrowLeft':
      player.move(-1, 0); // Liikuta vasemmalle
      break;
      case 'ArrowRight':
      player.move(1, 0); // Liikuta oikealle
      break;
      case 'w':
        shootAt(player.X, player.Y - 1);
      break;
      case 's':
        shootAt(player.X, player.Y + 1);
      break;
      case 'a':
        shootAt(player.X - 1, player.Y);
      break;
      case 'd':
        shootAt(player.X + 1, player.Y);
      break;
      

      
      }

     event.preventDefault(); // Prevent default scrolling behaviour
     });

    function startGame(){
    console.log("Peli aloitettu");

    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    board = generateRandomBoard();
    console.log(board);

    score = 0;
    updateScoreBoard(0);

    ghostInterval = setInterval(function() {
        moveGhosts();
    }, 2000);

    drawBoard(board);
    }



function generateRandomBoard() {
    
    //luodaan uusi kenttä, jossa on BOARD_SIZE x BOARD_SIZE ruutua
    const newBoard = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(' '));

    
    //set walls in edges
    for (let y = 0; y < BOARD_SIZE; y++) {
     for (let x = 0; x < BOARD_SIZE; x++) {
      if (y === 0 || y === BOARD_SIZE - 1 || x === 0 || x === BOARD_SIZE - 1) {
          newBoard[y][x] = 'W'; //W is wall
      }
     }
    }

    ghosts = [];

    for(let i=0; i < 8; i++){
        const [ghostX, ghostY] = randomEmptyPosition(newBoard);
        setCell(newBoard, ghostX, ghostY, 'H');
        ghosts.push(new Ghost(ghostX,ghostY)) // lisää haamut lisalle 
    }
    
    console.log(ghosts);

    generateObstacles(newBoard);

    [playerX, playerY] = randomEmptyPosition(newBoard);

    player = new Player(playerX, playerY);

    newBoard[player.Y][player.X] = "P";

    
    
    return newBoard;
}

function drawBoard(board){
    const gameBoard = document.getElementById('game-board');
    // Tämä luo CSS Grid -ruudukon, jossa on BOARD_SIZE saraketta. 
    // Jokainen sarake saa saman leveyden (1fr).
    gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;

    gameBoard.innerHTML = ' ';

    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.height = cellSize + "px";
            cell.style.width = cellSize + "px";

            if (getCell(board, x, y) === 'W') {
                cell.classList.add('wall'); // 'W' on seinä
            }
            else if (getCell(board, x, y) === 'P') {
                cell.classList.add('player'); // 'P' on pelaaja
            }
            else if (getCell(board, x, y) === 'H') {
                cell.classList.add('ghost'); // 'H' on haamu
            }
            else if (getCell(board, x, y) === 'B') {
                cell.classList.add('bullet'); // 'B´on bullet
                setTimeout(() => {
                    setCell(board, x, y, ' ')
                    drawBoard(board);
                }, 500); // Ammus näkyy 500 ms
            }


            gameBoard.appendChild(cell);
        }
        
    }
}

function getCell(board, x, y) {
    return board[y][x];
}

function setCell(board, x, y, value){
    board[y][x] = value; 
}


function calculateCellSize() {
    // Otetaan talteen pienempi luku ikkunan leveydestä ja korkeudesta
    const screenSize = Math.min(window.innerWidth, window.innerHeight);
    // Tehdään pelilaudasta hieman tätä pienempi, jotta jää pienet reunat
    const gameBoardSize = 0.95 * screenSize;
    // Laudan koko jaetaan ruutujen määrällä, jolloin saadaan yhden ruudun koko
    return gameBoardSize / BOARD_SIZE;
}


function generateObstacles(board){

    const obstacles =[
     [[0,0],[0,1],[1,0],[1,1]],//Neliö
     [[0,0],[0,1],[0,2],[0,3]],//I
     [[0,0],[1,0],[2,0],[1,1]]//T
    ];

    const positions =[
        {startX: 2, startY: 2},
        {startX: 8, startY: 2},
        {startX: 4, startY: 8}
    ]

    positions.forEach(pos=>{
        const randomObstacle = obstacles[Math.floor(Math.random() * obstacles.length)];
        placeObstacle(board,randomObstacle,pos.startX,pos.startY);
    })
}

function placeObstacle(board,obstacle,startX, startY){
    for(coordinatePair of obstacle){
        [x,y] = coordinatePair;
        board[startY + y][startX + x] = 'W';
    }
}



function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }



function randomEmptyPosition(board) {
  x = randomInt(1, BOARD_SIZE - 2);
  y = randomInt(1, BOARD_SIZE - 2);
  if (board[y][x] === ' ') {
      return [x, y];
  } else {
      return randomEmptyPosition(board);
  }
}


class Player{
    constructor(x,y){
        this.X = x;
        this.Y = y;
    }

    move(dx, dy){

        const currentX = this.X;
        const currentY = this.Y;
        

       // Laske uusi sijainti
       // const newX = currentX + deltaX;
       const newY = currentY + dy;
       const newX = currentX + dx;


    if (getCell(board, newX, newY)=== ' '){ 

     // Päivitä pelaajan sijainti
     this.X = newX;
     this.Y = newY;

    // Päivitä pelikenttä
    board[currentY][currentX] = ' '; // Tyhjennetään vanha paikka
    board[newY][newX] = 'P'; // Asetetaan uusi paikka

    }

    drawBoard(board);

    }
}

class Ghost {
    constructor(x,y){
        this.X = x;
        this.Y = y;
    }

    moveGhostTowardsPlayer(player,board, oldGhosts){
        let dx = player.X - this.X;
        let dy = player.Y - this.Y;

        console.log(dx, dy);

        let moves = [];

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) moves.push({ x: this.X + 1, y: this.Y }); // Move right
            else moves.push({ x: this.X - 1, y: this.Y }); // Move left
            if (dy > 0) moves.push({ x: this.X, y: this.Y + 1 }); // Move down
            else moves.push({ x: this.X, y: this.Y - 1 }); // Move up
        } else {
            if (dy > 0) moves.push({ x: this.X, y: this.Y + 1 }); // Move down
            else moves.push({ x: this.X, y: this.Y - 1 }); // Move up
            if (dx > 0) moves.push({ x: this.X + 1, y: this.Y }); // Move right
            else moves.push({ x: this.X - 1, y: this.Y }); //  Move left
        }

        console.log(moves);

        for (let move of moves) {
            if (board[move.y][move.x] === ' ' || board[move.y][move.x] === 'P' &&
              !oldGhosts.some(h => h.x === move.x && h.y === move.y) && board[move.y][move.x] !== 'H') // Tarkista, ettei haamu liiku toisen haamun päälle) 
              { 
                  return move;
              }
        }
        // Jos kaikki pelaajaan päin suunnat ovat esteitä, pysy paikallaan
        return { x: this.X, y: this.Y };       


    }
}


function shootAt(x, y){

    // Tarkistetaan, että ammus ei mene seinään
    if (getCell(board, x, y) === 'W') {
        return;
    }

    const ghostIndex = ghosts.findIndex(ghost => ghost.X === x && ghost.Y === y);
    

    if(ghostIndex !== -1){
        ghosts.splice(ghostIndex,1);
        updateScoreBoard(50);
        
    }


    setCell(board, x, y, 'B')
    drawBoard(board);

    if(ghosts.length === 0){
        alert('Kaikki kummitukset voitettu!');
    }
}

function moveGhosts() {

    // Säilytä haamujen vanhat paikat
    const oldGhosts = ghosts.map(ghost => ({ x: ghost.X, y: ghost.Y }));

    console.log(oldGhosts)
    
      ghosts.forEach(ghost => {
        
        const newPosition = ghost.moveGhostTowardsPlayer(player, board, oldGhosts);
          
          ghost.X = newPosition.x;
          ghost.Y = newPosition.y;
        
          board[ghost.Y][ghost.X] = 'H';

          // Check if ghost touches the player
          if (ghost.X === player.X && ghost.Y === player.Y) {
            endGame() // End the game
            return;
          }
    
        });
        
        console.log(ghosts)
    
        // Tyhjennä vanhat haamujen paikat laudalta
        oldGhosts.forEach(ghost => {
          board[ghost.y][ghost.x]= ' '; // Clear old ghost position
        });
    
        // Update the board with new ghost positions
        ghosts.forEach(ghost => {
            board[ghost.Y][ghost.X] = 'H';
        });
    
    // Redraw the board to reflect ghost movement
    drawBoard(board);
    }


function endGame() {
        alert('Game Over! The ghost caught you!');
         // Show intro-view ja hide game-view
        ghosts = []; // Tyhjennetään haamut
        clearInterval(ghostInterval);
        document.getElementById('intro-screen').style.display = 'block';
        document.getElementById('game-screen').style.display = 'none';
      
}

function updateScoreBoard(points) {
    const scoreBoard = document.getElementById('pisteet');
    score = score + points;
    scoreBoard.textContent = `Pisteet: ${score}`;
}
