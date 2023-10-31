const NEXT_PAGE_PATH = "../html/replay.html"

function fileSelect() {
    const statesFile = document.getElementById("statesFile")
    const actionsFile = document.getElementById("actionsFile")

    let isStateFileLoaded = false
    let isActionFileLoaded = false

    statesFile.addEventListener("change", function(event) {
        const file = statesFile.files[0]
        const reader =  new FileReader()
        reader.readAsText(file)
        reader.onload = function(ev) {
            sessionStorage.setItem("states", reader.result)
            isStateFileLoaded = true
            if (isActionFileLoaded) {
                window.location.href = NEXT_PAGE_PATH
            }
        }
    })

    actionsFile.addEventListener("change", function(event) {
        const file = actionsFile.files[0]
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = function(ev) {
            sessionStorage.setItem("actions", reader.result)
            isActionFileLoaded = true
            if (isStateFileLoaded) {
                window.location.href = NEXT_PAGE_PATH
            }
        }
    })
}

const IMG_DIR = "image/"
const EMPTY_IMG_PATH = IMG_DIR + "空白.png"
const FACE_DOWN_IMG_DIR = "裏側.png"
const VERTICAL_DIR = "vertical/"
const HORIZONTAL_DIR = "horizontal/"

const VERTICAL_CARD_HEIGHT = 106
const VERTICAL_CARD_WIDTH = 72
const HORIZONTAL_CARD_IMG_HEIGHT = VERTICAL_CARD_WIDTH
const HORIZONTAL_CARD_IMG_WIDTH = VERTICAL_CARD_HEIGHT

const P2_SPELL_TRAP_ZONE_LINE_INDEX = 1
const P2_MONSTER_ZONE_LINE_INDEX = P2_SPELL_TRAP_ZONE_LINE_INDEX + 1
const P1_MONSTER_ZONE_LINE_INDEX = P2_MONSTER_ZONE_LINE_INDEX + 1
const P1_SPELL_TRAP_ZONE_LINE_INDEX = P1_MONSTER_ZONE_LINE_INDEX

const BOARD = document.getElementById("board")
const BOARD_ROW = BOARD.rows.length
const BOARD_CELL = BOARD.rows[P2_SPELL_TRAP_ZONE_LINE_INDEX].cells.length

const TH_BORDER_PX_VAL = function() {
    const th = document.getElementById("p2-deck")
    const style = window.getComputedStyle(th)
    const property = style.getPropertyValue("border")
    const px = property.split(" ")[0]
    const val = parseInt(px.replace("px", ""))
    return val
}()

const CARD_SPACE_PX_VAL = 112 + ((TH_BORDER_PX_VAL-1)*2)

function makeHandPxVals(n, space) {
    let vals = []
    let width
    while (true) {
        width = (VERTICAL_CARD_IMG_WIDTH * n) + (space * (n-1))
        if (width <= HAND_WIDTH_PX_VAL) {
            break
        }

        space -= 1
        if (space < 0) {
            if (-space >= VERTICAL_CARD_IMG_WIDTH) {
                break
            }
        }
    }

    xPxVal = HAND_MID_X_PX_VAL - (width / 2.0)
    for (let i=0; i<n; i++) {
        let val = xPxVal + (i * (VERTICAL_CARD_IMG_WIDTH + space))
        vals.push(val)
    }
    return vals
}

function makePxVals(rc, init, space) {
    let result = []
    for (let i=0; i<rc; i++) {
        px = init + (space*i)
        result.push(px)
    }
    return result
}

const VERTICAL_CARD_X_PX_VALS = makePxVals(BOARD_CELL, 28+(TH_BORDER_PX_VAL-1), CARD_SPACE_PX_VAL)
const VERTICAL_CARD_Y_PX_VALS = makePxVals(BOARD_ROW, 122+(TH_BORDER_PX_VAL-1)-CARD_SPACE_PX_VAL, CARD_SPACE_PX_VAL)
const HORIZONTAL_CARD_X_PX_VALS = makePxVals(BOARD_CELL, 12+(TH_BORDER_PX_VAL-1), CARD_SPACE_PX_VAL)
const HORIZONTAL_CARD_Y_PX_VALS = makePxVals(BOARD_ROW, 139+(TH_BORDER_PX_VAL-1), CARD_SPACE_PX_VAL)

function pxValToPx(v) {
    return v + "px"
}

const VERTICAL_CARD_X_PXS = VERTICAL_CARD_X_PX_VALS.map(pxValToPx)
const VERTICAL_CARD_Y_PXS = VERTICAL_CARD_Y_PX_VALS.map(pxValToPx)
const HORIZONTAL_CARD_X_PXS = HORIZONTAL_CARD_X_PX_VALS.map(pxValToPx)
const HORIZONTAL_CARD_Y_PXS = HORIZONTAL_CARD_Y_PX_VALS.map(pxValToPx)

function pxToTranslateXpx(px) {
    return "translateX(" + px + ")"
}

function pxToTranslateYpx(px) {
    return "translateY(" + px + ")"
}

const VERTICAL_CARD_TRANSLATE_X_PXS = VERTICAL_CARD_X_PXS.map(pxToTranslateXpx) 
const VERTICAL_CARD_TRANSLATE_Y_PXS = VERTICAL_CARD_Y_PXS.map(pxToTranslateYpx)
const HORIZONTAL_CARD_TRANSLATE_X_PXS = HORIZONTAL_CARD_X_PXS.map(pxToTranslateXpx)
const HORIZONTAL_CARD_TRANSLATE_Y_PXS = HORIZONTAL_CARD_Y_PXS.map(pxToTranslateYpx)

function makeVerticalCardTranslateXYpx(row, cell) {
    return VERTICAL_CARD_TRANSLATE_Y_PXS[row] + " " + VERTICAL_CARD_TRANSLATE_X_PXS[cell]
}

function makeHorizontalCardTranslateXYpx(row, cell) {
    return HORIZONTAL_CARD_TRANSLATE_Y_PXS[row] + " " + HORIZONTAL_CARD_TRANSLATE_X_PXS[cell]
}

const HAND_LEFT_X_PX_VAL = VERTICAL_CARD_X_PX_VALS[0]
const HAND_RIGHT_X_PX_VAL = VERTICAL_CARD_X_PX_VALS[VERTICAL_CARD_X_PX_VALS.length-1] + VERTICAL_CARD_WIDTH
const HAND_WIDTH_PX_VAL = HAND_RIGHT_X_PX_VAL - HAND_LEFT_X_PX_VAL
const HAND_MID_X_PX_VAL = (HAND_RIGHT_X_PX_VAL + HAND_LEFT_X_PX_VAL) / 2.0

function appendChildCardImg(card) {
    let img = document.createElement("img")
    img.id = card.ID
    img.className = "card-img"
    document.body.appendChild(img)
}

function Test() {
    for (let i=0; i < BOARD.rows.length; i++) {
        let cells = BOARD.rows[i].cells
        for (let j=0; j < cells.length; j++) {
            BOARD.rows[i].cells[j].firstChild.src = EMPTY_IMG_PATH
        }
    }

    //initPhaseImg()

    const states = JSON.parse(sessionStorage.getItem("states"))
    const actions = JSON.parse(sessionStorage.getItem("actions"))
    const initState = states[0]

    initState.P1.Deck.map(appendChildCardImg)
    initState.P1.Hand.map(appendChildCardImg)
    initState.P2.Deck.map(appendChildCardImg)
    initState.P2.Hand.map(appendChildCardImg)

    let img = document.getElementById("10")
    img.style.top = VERTICAL_CARD_Y_PXS[0]
    img.style.left = VERTICAL_CARD_X_PXS[0]
    img.style.display = "block"
    console.log(VERTICAL_CARD_X_PXS[0])
    img.src = IMG_DIR + VERTICAL_DIR + "p1/" + "サファイアドラゴン.png"
    console.log(IMG_DIR + VERTICAL_DIR + "p1/" + "サファイアドラゴン.png" )
}