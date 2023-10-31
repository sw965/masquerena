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

const IMAGE_PATH = "image/reduced/"
const EMPTY_IMG_PATH = IMAGE_PATH + "空白.png"
const FACE_DOWN_IMG_DIR = "裏側.png"
const P1_ATK_BATTLE_POSITION_DIR = "0/"
const P1_DEF_BATTLE_POSITION_DIR = "90/"
const P2_ATK_BATTLE_POSITION_DIR = "180/"
const P2_DEF_BATTLE_POSITION_DIR = "270/"

function getAtkBattlePositionPath(isP1) {
    if (isP1) {
        return IMAGE_PATH + P1_ATK_BATTLE_POSITION_DIR
    } else {
        return IMAGE_PATH + P2_ATK_BATTLE_POSITION_DIR 
    }
}

function getDefBattlePositionPath(isP1) {
    if (isP1) {
        return IMAGE_PATH + P1_DEF_BATTLE_POSITION_DIR
    } else {
        return IMAGE_PATH + P2_DEF_BATTLE_POSITION_DIR
    }
}

function cardToImgPath(card, isP1) {
    const pos = card.BattlePosition
    if (card.Name == "") {
        return EMPTY_IMG_PATH
    } else if (pos == "攻撃表示") {
        return getAtkBattlePositionPath(isP1) + card.Name + ".png"
    } else if (pos == "表側守備表示") {
        return getDefBattlePositionPath(isP1) + card.Name + ".png"
    } else {
        return getDefBattlePositionPath(isP1) + FACE_DOWN_IMG_DIR
    }
}

const VERTICAL_CARD_IMG_HEIGHT = 106
const VERTICAL_CARD_IMG_WIDTH = 72
const HORIZONTAL_CARD_IMG_HEIGHT = VERTICAL_CARD_IMG_WIDTH
const HORIZONTAL_CARD_IMG_WIDTH = VERTICAL_CARD_IMG_HEIGHT

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
const VERTICAL_CARD_Y_PX_VALS = makePxVals(BOARD_ROW, 122+(TH_BORDER_PX_VAL-1), CARD_SPACE_PX_VAL)
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
const HAND_RIGHT_X_PX_VAL = VERTICAL_CARD_X_PX_VALS[VERTICAL_CARD_X_PX_VALS.length-1] + VERTICAL_CARD_IMG_WIDTH
const HAND_WIDTH_PX_VAL = HAND_RIGHT_X_PX_VAL - HAND_LEFT_X_PX_VAL
const HAND_MID_X_PX_VAL = (HAND_RIGHT_X_PX_VAL + HAND_LEFT_X_PX_VAL) / 2.0

const PHASE_IMG_TOP = VERTICAL_CARD_Y_PXS[2]
const PHASE_IMG_LEFT = HORIZONTAL_CARD_X_PXS[7]

function initPhaseImg() {
    const img = document.getElementById("phase-img")
    img.style.top = PHASE_IMG_TOP
    img.style.left = PHASE_IMG_LEFT
}

function appendChildCardImg(card) {
    let img = document.createElement("img")
    img.id = card.ID
    img.className = "card-img"
    document.body.appendChild(img)
    img.style.display = "block"
}

function normalSummon(state, action) {
    const handIdx = action.Indices1[0]
    const mZoneIdx = action.Indices2[0]

    let card
    if (state.IsP1Turn) {
        card = state.P1.Hand[handIdx]
        row = 2
    } else {
        card = state.P2.Hand[handIdx]
        row = 1
    }

    const img = document.getElementById(card.ID)

    if (action.BattlePosition == "攻撃表示") {
        xy = makeVerticalCardTranslateXYpx(row, mZoneIdx+2)
    } else {
        xy = makeHorizontalCardTranslateXYpx(row, mZoneIdx+2)
    }


    img.animate(
        [
            {transform:xy, offset:1.0},
        ],
        {
            fill:"forwards",
            duration:100,
        },
    )

    if (state.IsP1Turn) {
        if (action.BattlePosition == "攻撃表示") {
            img.src = IMAGE_PATH + P1_ATK_BATTLE_POSITION_DIR + card.Name + ".png"
        } else if (action.BattlePosition == "表側守備表示") {
            img.src = IMAGE_PATH + P1_DEF_BATTLE_POSITION_DIR + card.Name + ".png"
        } else {
            img.src = IMAGE_PATH + P1_DEF_BATTLE_POSITION_DIR + FACE_DOWN_IMG_DIR
        }
    } else {
        if (action.BattlePosition == "攻撃表示") {
            img.src = IMAGE_PATH + P2_ATK_BATTLE_POSITION_DIR + card.Name + ".png"
        } else if (action.BattlePosition == "表側守備表示") {
            img.src = IMAGE_PATH + P2_DEF_BATTLE_POSITION_DIR + card.Name + ".png"
        } else {
            img.src = IMAGE_PATH + P2_DEF_BATTLE_POSITION_DIR + FACE_DOWN_IMG_DIR
        }
    }
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

    const n = 40
    const vals = makeHandPxVals(n, 5)

    for (let i=0; i<n; i++) {
        let img = document.getElementById(i+1)
        setTimeout(
            () => {
                img.src = IMAGE_PATH + P2_ATK_BATTLE_POSITION_DIR + "サファイアドラゴン.png"
                img.style.zIndex = i
                img.animate(
                    [
                        {transform:"translateX("+vals[i] + "px) translateY(12px)"},
                    ],
                    {
                        fill:"forwards",
                        duration:0,
                    },
                )
            }, 1000*i,
        )
    }

    // for (let i= 0; i < states.length; i++) {
    //     let state = states[i]
    //     let action = actions[i]
    //     if (action.Type == "通常召喚") {
    //         normalSummon(state, action)
    //     }
    // }
}