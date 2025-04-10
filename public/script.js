let BOARD_SIZE = 15
let board; //kenttä tallennetaan tähän

const cellSize = calculateCellSize();

let player;
let playerX;
let playerY;

let ghosts = [];



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
      }
     event.preventDefault(); // Prevent default scrolling behaviour
     });

    function startGame(){
    console.log("Peli aloitettu");

    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    board = generateRandomBoard();
    console.log(board);

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

    setCell(newBoard, 5, 5, "B")
    
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
}
