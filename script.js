const board = document.getElementById("board");
const resetButton = document.querySelector(".reset-button");

const sizeBoard = 10
const widthBoard = 10
const heightBoard = 10
const numMines = 15

let revealed = 0
let firstClick = true
let isLocked = false

function createTable(w, h, b = []) {
    b = Array.from({length: h})
        .map(r => Array.from({length: w})
            .map(c => 0))

    return b
}

function setTable(table) {
    return table.map((cards, r) => {
        return cards.map((card, c) => {
            return (
                `<div class="cell" data-row='${r}' data-column='${c}'>
                    <div class="cell-front"></div>
                    <div class="cell-back"></div>
                </div>`
            )
        }).join('')
    }).join('')
}

// Cria a array onde haverá todas as informações
const boardArray = createTable(widthBoard, heightBoard)

// Cria as células
board.innerHTML = setTable(boardArray)

// Ajeita a grid para que fique do tamanho certo
board.style.gridTemplateColumns = `repeat(${widthBoard}, 1fr)`
board.style.gridTemplateRows = `repeat(${heightBoard}, 1fr)`


// Faz com que cada célula tenho um evento de click (esquerdo e direito)
const cells = [...document.querySelectorAll('.cell')]
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        if (isLocked) return

        const [row, column] = Object.values(cell.dataset).map(value => Number(value))

        if (firstClick) isFirstClick(row, column)
        else revealCell(row, column)
    })
    cell.addEventListener('contextmenu', e => {
        e.preventDefault()

        if (isLocked) return

        if (!cell.classList.contains('reveal')) {
            if (cell.classList.contains('flag')) {
                cell.classList.remove('flag')
            } else {
                cell.classList.add('flag')
            }
        }
    })
});

board.addEventListener('contextmenu', e => {
    e.preventDefault()
})

async function isFirstClick(r, c) {
    firstClick = false

    await setMines(numMines, r, c)
    revealCell(r, c)

}

//Cria as minas em lugares aleatórios
function setMines(mines, safeR = 0, safeC = 0) {
    while (mines > widthBoard * heightBoard - 1) {
        mines--
    }

    while (mines > 0) {
        let bombR = random(heightBoard - 1)
        let bombC = random(widthBoard - 1)

        if (boardArray[bombR][bombC] !== 'B') {
            let aroundSafe = []
    
            for (let r = -1; r <= 1; r++) {
                for (let c = -1; c <= 1; c++) {
                    if (safeR + r >= 0 && safeR + r < heightBoard) {
                        if (safeC + c >= 0 && safeC + c < widthBoard) {
                            aroundSafe.push([safeR + r, safeC + c])
                        }
                    }
                }
            }

            const isFound = aroundSafe.find(coords => {
                [r, c] = coords
                if (bombR === r && bombC === c) {
                    return coords
                }
            })
    
            if (!isFound) {
                boardArray[bombR][bombC] = 'B'
                aroundMine(bombR, bombC)
                mines--
            }
        }
    }
}

function aroundMine(mineR, mineC) {
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            let newR = mineR + r
            let newC = mineC + c
            if (newR >= 0 && newR < heightBoard) {
                if (newC >= 0 && newC < widthBoard) {
                    if (boardArray[newR][newC] !== 'B') {
                        boardArray[newR][newC]++
                    }
                }
            }
        }
    }
}

function revealCell(revealR, revealC) {
    revealC = Number(revealC)
    revealR = Number(revealR)

    let numId = revealR * heightBoard + revealC

    if (cells[numId].classList.contains('flag')) return
    if (cells[numId].classList.contains('reveal')) return

    if (boardArray[revealR][revealC] == 'B') {
        cells[numId].classList.add('reveal')
        cells[numId].querySelector('.cell-back').classList.add('mine')

        if (!isLocked) youLoose()

        return
    }

    if (boardArray[revealR][revealC] !== 0) {
        cells[numId].classList.add('reveal')
        revealed++

        cells[numId].dataset['num'] = boardArray[revealR][revealC]
        cells[numId].querySelector('.cell-back').textContent = boardArray[revealR][revealC]

        return
    }

    cells[numId].classList.add('reveal')
    revealed++

    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            let newR = revealR + r
            let newC = revealC + c
            let newId = newR * heightBoard + newC

            if (newR >= 0 && newR < heightBoard) {
                if (newC >= 0 && newC < widthBoard) {
                    if (!cells[newId].classList.contains('reveal') && boardArray[newR][newC] !== 'B') {

                        if (boardArray[newR][newC] !== 'B') {
                            setTimeout(() => {
                                const [row, column] = Object.values(cells[newId].dataset).map(value => Number(value))
                                revealCell(row, column)
                            }, 50);
                        }
                    }
                }
            }
        }
    }
}

function random(max) {
    return Math.floor(Math.random() * (max + 1))
}

function reset() {

}

function youLoose() {
    isLocked = true

    for (r in boardArray) {
        for (c in boardArray[r]) {
            if (boardArray[r][c] === 'B') {
                revealCell(r, c)
            }
        }
    }

    // setTimeout(() => {
    //     alert('Perdeu otário hahahahha')
    // }, 1);
}

function youWin() {
    alert('Você ganhou uhuuu')
}