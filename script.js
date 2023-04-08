const board = document.getElementById("board");
const resetButton = document.getElementById("reset-button");

const sizeBoard = 10
const numMines = 10
let revealed = 0

let firstClick = true

// Cria as células
for (let i = 0; i < sizeBoard ** 2; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.cellId = i
    board.appendChild(cell);
}

//Ajeita a grid para que fique do tamanho certo
board.style.gridTemplateColumns = `repeat(${sizeBoard}, 1fr)`
board.style.gridTemplateRows = `repeat(${sizeBoard}, 1fr)`

//Cria a array onde haverá todas as informações
const boardArray = new Array()
for (let row = 0; row < sizeBoard; row++) {
    boardArray.push([])
    for (let columns = 0; columns < sizeBoard; columns++) {
        boardArray[row].push(0)
    }
}

//Faz com que cada célula tenho um evento de click (esquerdo e direito)
const cells = document.querySelectorAll('.cell')
cells.forEach(cell => {
    cell.addEventListener('click', function () {
        if (firstClick) {
            setMines(numMines, cell.dataset.cellId)
            firstClick = false
        }
        revealCell(cell.dataset.cellId)
    })
    cell.addEventListener('contextmenu', e => {
        e.preventDefault()
        if (cell.classList.contains('flag')) {
            cell.classList.remove('flag')
        } else {
            cell.classList.add('flag')
        }
    })
});

//Cria as minas em lugares aleatórios
function setMines(mines, safeSpot) {
    for (let m = 0; m < mines; m++) {
        let bombR = random(sizeBoard)
        let bombC = random(sizeBoard)
        if (boardArray[bombR][bombC] !== 'B' && bombR * sizeBoard + bombC != safeSpot) {
            boardArray[bombR][bombC] = 'B'
            cells[bombR * sizeBoard + bombC].classList.add('mine')
            aroundMine(bombR, bombC)
        } else {
            m--
        }
    }
}

function aroundMine(mineR, mineC) {
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            let newR = mineR + r
            let newC = mineC + c
            if (newR >= 0 && newR < sizeBoard) {
                if (newC >= 0 && newC < sizeBoard) {
                    if (boardArray[newR][newC] !== 'B') {
                        boardArray[newR][newC] = boardArray[newR][newC] + 1
                        cells[newR * sizeBoard + newC].classList.add('num')
                        cells[newR * sizeBoard + newC].textContent = boardArray[newR][newC]
                    }
                }
            }
        }
    }
}

function revealCell(cellId) {
    let numId = Number(cellId)
    let revealC = numId % sizeBoard
    let revealR = (numId - revealC) / sizeBoard
    if (cells[numId].classList.contains('flag')) return
    else if (boardArray[revealR][revealC] == 'B') {
        youLoose()
        return
    }
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            let newR = revealR + r
            let newC = revealC + c
            if (newR >= 0 && newR < sizeBoard) {
                if (newC >= 0 && newC < sizeBoard) {
                    if (!cells[newR * sizeBoard + newC].classList.contains('reveal') && boardArray[newR][newC] !== 'B') {
                        cells[newR * sizeBoard + newC].classList.add('reveal')
                        revealed++
                        if (boardArray[newR][newC] == 0) {
                            revealCell(cells[newR * sizeBoard + newC].dataset.cellId)
                        }
                    }
                }
            }
        }
    }
    if (revealed == sizeBoard ** 2 - numMines){
        youWin()
    }
}

function random(max) {
    return Math.round(Math.random() * (max - 1))
}

function reset() {

}

function youLoose() {
    cells.forEach(cell => {
        if (!cell.classList.contains('flag')) {
            cell.classList.add('reveal')
        }
    });
    setTimeout(() => {
        alert('Perdeu otário hahahahha')
    }, 1);
}

function youWin() {
    alert('Você ganhou uhuuu')
}