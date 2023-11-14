const NEXT_PAGE_PATH = "../html/replay.html"

function fileSelect() {
    let fileIDs = [DocElemID.STATES_FILE, DocElemID.ACTIONS_FILE]
    let files = fileIDs.map(id => document.getElementById(id))
    let isSelecteds = new Array(fileIDs.length).fill(false)

    let event = function(i) {
        return function(ev) {
            const file = files[i].files[0]
            const reader =  new FileReader()
            reader.readAsText(file)
            reader.onload = function(ev) {
                let key = fileIDs[i].replace("File", "")
                sessionStorage.setItem(key, reader.result)
                isSelecteds[i] = true
                if (isSelecteds.every(ele => ele)) {
                    window.location.href = NEXT_PAGE_PATH
                }
            }    
        }
    }

    for (let i = 0; i < fileIDs.length; i++) {
        files[i].addEventListener("change", event(i))
    }
}

class DocElemID {
    static BOARD = "board"
    static P2_DECK = "p2-deck"
    static STATES_FILE = "statesFile"
    static ACTIONS_FILE = "actionsFile"
}

class CardImg {
    static VERITCAL_HEIGHT = 106
    static VERITCAL_WIDTH = 72
    static HORIZONTAL_HEIGHT = this.VERITCAL_WIDTH
    static HORIZONTAL_WIDTH = this.VERITCAL_HEIGHT
}

class CardImgFileName {
    static EMPTY = "空白.png"
    static FACE_DOWN = "裏側.png"

    static get(card) {
        if (card.Name == "") {
            return this.EMPTY
        } else if (card.BattlePosition == "裏側守備表示") {
            return this.FACE_DOWN
        } else {
            return card.Name + ".png"
        }
    }
}

class CardImgDir {
    static ROOT = "image/"
    static P1 = "p1/"
    static P2 = "p2/"
    static VERITCAL = "vertical/"
    static HORIZONTAL = "horizontal/"
}

class CardImgPath {
    static EMPTY = CardImgDir.ROOT + CardImgFileName.EMPTY

    static P1 = CardImgDir.ROOT + CardImgDir.P1
    static P2 = CardImgDir.ROOT + CardImgDir.P2

    static P1_VERITCAL = this.P1 + CardImgDir.VERITCAL
    static P1_HORIZONTAL = this.P1 + CardImgDir.HORIZONTAL
    static P2_VERITCAL = this.P2 + CardImgDir.VERITCAL
    static P2_HORIZONTAL = this.P2 + CardImgDir.HORIZONTAL

    static getVertical(isP1) {
        if (isP1) {
            return this.P1_VERITCAL
        } else {
            return this.P2_VERITCAL
        }
    }

    static getHorizontal(isP1) {
        if (isP1) {
            return this.P1_HORIZONTAL
        } else {
            return this.P2_HORIZONTAL
        }
    }

    static get(isVertical, isP1) {
        if (isVertical) {
            return this.getVertical(isP1)
        } else {
            return this.getHorizontal(isP1)
        }
    }
}

const MONSTER_ZONE_LENGTH = 5

class MonsterZoneIndex {
    static MAX = MONSTER_ZONE_LENGTH - 1
    static toBoardColumn(idx, isP1) {
        if (isP1) {
            return idx + 2
        } else {
            return Board.COLUMN - idx - 3
        }
    }
}

class BoardRow {
    static P2_HAND = 0
    static P2_SPELL_TRAP_ZONE = this.P2_HAND + 1
    static P2_MONSTER_ZONE = this.P2_SPELL_TRAP_ZONE + 1
    static P1_MONSTER_ZONE = this.P2_MONSTER_ZONE + 1
    static P1_SPELL_TRAP_ZONE = this.P1_MONSTER_ZONE + 1
    static P1_HAND = this.P1_SPELL_TRAP_ZONE + 1

    static P2_DECK = this.P2_SPELL_TRAP_ZONE
    static P1_DECK = this.P1_SPELL_TRAP_ZONE

    static getDeck(isP1) {
        if (isP1) {
            return this.P1_DECK
        } else {
            return this.P2_DECK
        }
    }

    static getHand(isP1) {
        if (isP1) {
            return this.P1_HAND
        } else {
            return this.P2_HAND
        }
    }

    static getMonsterZone(isP1) {
        if (isP1) {
            return this.P1_MONSTER_ZONE
        } else {
            return this.P2_MONSTER_ZONE
        }
    }
}

class BoardColumn {
    static P2_DECK = 1
    static P1_DECK = 7

    static getDeck(isP1) {
        if (isP1) {
            return this.P1_DECK
        } else {
            return this.P2_DECK
        }
    }
}

class Board {
    static ELEMENT = document.getElementById(DocElemID.BOARD)
    static ROW = this.ELEMENT.rows.length
    static COLUMN = this.ELEMENT.rows[BoardRow.P2_SPELL_TRAP_ZONE].cells.length
}

class PxVal {
    static TH_BORDER = function() {
        const th = document.getElementById(DocElemID.P2_DECK)
        const style = window.getComputedStyle(th)
        const property = style.getPropertyValue("border")
        const px = property.split(" ")[0]
        const val = parseInt(px.replace("px", ""))
        return val
    }()

    static CARD_SPACE = 112+((this.TH_BORDER-1)*2)

    static toPx(val) {
        return val + "px"
    }

    static toTranslateX(val) {
        return Px.toTranslateX(PxVal.toPx(val))
    }

    static toTranslateY(val) {
        return Px.toTranslateY(PxVal.toPx(val))
    }

    static makeCardPoss(rowColumn, init) {
        let vals = []
        for (let i=0; i<rowColumn; i++) {
            let val = init + (this.CARD_SPACE*i)
            vals.push(val)
        }
        return vals
    }

    static VERTICAL_CARD_XS = this.makeCardPoss(Board.COLUMN, 28+(this.TH_BORDER-1))
    static VERTICAL_CARD_YS = this.makeCardPoss(Board.ROW, 122+(this.TH_BORDER-1)-this.CARD_SPACE)
    static HORIZONTAL_CARD_XS = this.makeCardPoss(Board.COLUMN, 12+(this.TH_BORDER-1))
    static HORIZONTAL_CARD_YS = this.makeCardPoss(Board.ROW, 139+(this.TH_BORDER-1)-this.CARD_SPACE)

    static BOARD_CELL_CENTER_XS = function() {
        return PxVal.VERTICAL_CARD_XS.map(x => x + (CardImg.VERITCAL_WIDTH / 2.0))
    }()

    static BOARD_CELL_CENTER_YS = function() {
        return PxVal.VERTICAL_CARD_YS.map(y => y + (CardImg.VERITCAL_HEIGHT / 2.0))
    }()
}

class HandPxVal {
    static SPACE_X = 5
    static LEFT_EDGE = PxVal.VERTICAL_CARD_XS[0]
    static RIGHT_EDGE = PxVal.VERTICAL_CARD_XS[PxVal.VERTICAL_CARD_XS.length-1] + CardImg.VERITCAL_WIDTH
    static WIDTH = this.RIGHT_EDGE - this.LEFT_EDGE
    static MID_X = (this.LEFT_EDGE + this.RIGHT_EDGE) / 2.0

    static makeXs(n) {
        let vals = []
        let spaceX = this.SPACE_X
        let width = 0
    
        while (true) {
            width = (CardImg.VERITCAL_WIDTH * n) + (spaceX * (n-1))
            if (width <= this.WIDTH) {
                break
            }
    
            spaceX -= 1
            if (spaceX < 0) {
                if (-spaceX >= CardImg.VERITCAL_WIDTH) {
                    break
                }
            }
        }
    
        let leftEdge = this.MID_X - (width / 2.0)
        for (let i=0; i<n; i++) {
            let val = leftEdge + (i * (CardImg.VERITCAL_WIDTH + spaceX))
            vals.push(val)
        }
        return vals
    }
}

class HandPx {
    static makeXs(n) {
        let vals = HandPxVal.makeXs(n)
        return vals.map(PxVal.toPx)
    }
}

class Px {
    static VERTICAL_CARD_XS = PxVal.VERTICAL_CARD_XS.map(PxVal.toPx)
    static VERTICAL_CARD_YS = PxVal.VERTICAL_CARD_YS.map(PxVal.toPx)
    static HORIZONTAL_CARD_XS = PxVal.HORIZONTAL_CARD_XS.map(PxVal.toPx)
    static HORIZONTAL_CARD_YS = PxVal.HORIZONTAL_CARD_YS.map(PxVal.toPx)
    static BOARD_CELL_CENTER_XS = PxVal.VERTICAL_CARD_XS.map(PxVal.toPx)
    static BOARD_CELL_CENTER_YS = PxVal.VERTICAL_CARD_YS.map(PxVal.toPx)

    static toTranslateX(px) {
        return "translateX(" + px + ")"
    }

    static toTranslateY(px) {
        return "translateY(" + px + ")"
    }
}

class HandTranslatePx {
    static makeXs(n) {
        let xs = HandPx.makeXs(n)
        return xs.map(Px.toTranslateX)
    }
}

class TranslatePx {
    static VERTICAL_CARD_XS = Px.VERTICAL_CARD_XS.map(Px.toTranslateX) 
    static VERTICAL_CARD_YS = Px.VERTICAL_CARD_YS.map(Px.toTranslateY)
    static HORIZONTAL_CARD_XS = Px.HORIZONTAL_CARD_XS.map(Px.toTranslateX)
    static HORIZONTAL_CARD_YS = Px.HORIZONTAL_CARD_YS.map(Px.toTranslateY)
    static BOARD_CELL_CENTER_XS = Px.BOARD_CELL_CENTER_XS.map(Px.toTranslateX)
    static BOARD_CELL_CENTER_YS = Px.BOARD_CELL_CENTER_YS.map(Px.toTranslateY)
}

class TranslateXYpx {
    static makeVeritcalCard(row, column) {
        return TranslatePx.VERTICAL_CARD_XS[column] + " " + TranslatePx.VERTICAL_CARD_YS[row]
    }

    static makeHorizontalCard(row, column) {
        return TranslatePx.HORIZONTAL_CARD_XS[column] + " " + TranslatePx.HORIZONTAL_CARD_YS[row]
    }

    static makeCard(row, column, isVertical) {
        if (isVertical) {
            return this.makeVeritcalCard(row, column)
        } else {
            return this.makeHorizontalCard(row, column)
        }
    }

    static makeDeck(isP1) {
        let row = BoardRow.getDeck(isP1)
        let column = BoardColumn.getDeck(isP1)
        return this.makeVeritcalCard(row, column)
    }

    static makeHandCards(n, isP1) {
        let row = BoardRow.getHand(isP1)
        let xs = HandTranslatePx.makeXs(n)
        return xs.map(function(x) {return x + " " + TranslatePx.VERTICAL_CARD_YS[row]})
    }

    static makeAttackOnMonster(defenderMonsterZoneIdx, isP1) {
        let row = BoardRow.getMonsterZone(!isP1)
        let column = MonsterZoneIndex.toBoardColumn(defenderMonsterZoneIdx, isP1)
        return Px.toTranslateX(Px.BOARD_CELL_CENTER_XS[column]) + " " + Px.toTranslateY(Px.BOARD_CELL_CENTER_YS[row]) 
    }

    static makeDirectAttack(isP1) {
        let xPxVal = MID_X
        let xPx = PxVal.toPx(xPxVal)
        let row = BoardRow.getHand(!isP1)
        let y = TranslatePx.BOARD_CELL_CENTER_YS[row]
        return Px.toTranslateX(xPx) + " " + y
    }
}

class AttackDeclareCanvas {
    static ELEMENT = document.getElementById("attack-declare")
    static ELEMENT_2D = this.ELEMENT.getContext("2d")

    constructor() {
        AttackDeclareCanvas.ELEMENT.style.zIndex = 999
        AttackDeclareCanvas.ELEMENT.style.position = "absolute";
        AttackDeclareCanvas.ELEMENT.style.top = "0px"
        AttackDeclareCanvas.ELEMENT.style.left = "0px"
        AttackDeclareCanvas.ELEMENT.height = PxVal.VERTICAL_CARD_YS[BoardRow.P1_SPELL_TRAP_ZONE]
        AttackDeclareCanvas.ELEMENT.width = PxVal.VERTICAL_CARD_XS[MonsterZoneIndex.toBoardColumn(MonsterZoneIndex.MAX, true)]
    }

    static animate(attackerIdx, defenderIdx, isP1, num, delay, i=0) {
        return new Promise((resolve) => {
            let startX = PxVal.BOARD_CELL_CENTER_XS[MonsterZoneIndex.toBoardColumn(attackerIdx, isP1)]
            let startY = PxVal.BOARD_CELL_CENTER_YS[BoardRow.getMonsterZone(isP1)]
            let endX = PxVal.BOARD_CELL_CENTER_XS[MonsterZoneIndex.toBoardColumn(defenderIdx, !isP1)]
            let endY = PxVal.BOARD_CELL_CENTER_YS[BoardRow.getMonsterZone(!isP1)]

            let addX = (endX - startX) / num
            let addY = (endY - startY) / num

            AttackDeclareCanvas.ELEMENT_2D.strokeStyle = "red"
            AttackDeclareCanvas.ELEMENT_2D.beginPath()
            AttackDeclareCanvas.ELEMENT_2D.moveTo(startX, startY)
            AttackDeclareCanvas.ELEMENT_2D.lineTo(startX + (addX * i), startY + (addY * i))
            AttackDeclareCanvas.ELEMENT_2D.stroke()
            AttackDeclareCanvas.ELEMENT_2D.closePath()

            setTimeout(() => {
                resolve()
            }, delay)
        }).then(() => {
            if (i == num) {
                return Promise.resolve()
            } else {
                return this.animate(attackerIdx, defenderIdx, isP1, num, delay, i+1)
            }
        })
    }
}

class Card {
    static getID(card) {
        return card.ID
    }

    static getBattlePosition(card) {
        return card.BattlePosition
    }
}

class Cards {
    static ids(cards) {
        return cards.map(Card.getID)
    }

    static battlePositions(cards) {
        return cards.map(Card.getBattlePosition)
    }

    static equal(cards1, cards2) {
        let pos1 = Cards.battlePositions(cards1)
        let pos2 = Cards.battlePositions(cards2)
        let ids1 = Cards.ids(cards1)
        let ids2 = Cards.ids(cards2)
        let posEq = pos1.map((pos, i) => pos2[i] == pos).every(b => b)
        let idEq = ids1.map((id, i) => ids2[i] == id).every(b => b)
        return posEq && idEq && (cards1.length == cards2.length)

    }
}

class BattlePosition {
    static isVertical(pos) {
        if (pos == "攻撃表示") {
            return true
        }  else {
            return false
        }       
    }
}

class State {
    static getTurnPlayer(state) {
        if (state.IsP1Turn) {
            return state.P1
        } else {
            return state.P2
        }
    }

    static getNotTurnPlayer(state) {
        if (state.IsP1Turn) {
            return state.P2
        } else {
            return state.P1
        }
    }
}

function initCardImg(card) {
    return new Promise((resolve) => {
        let img = document.createElement("img")
        img.id = card.ID
        img.className = "card-img"
        document.body.appendChild(img)

        let isP1 = card.IsP1
        let src = CardImgPath.getVertical(isP1) + CardImgFileName.FACE_DOWN

        img.onload = () => {
            let animation = img.animate(
                [
                    {transform:TranslateXYpx.makeDeck(isP1)}
                ],
                {
                    fill:"forwards",
                    duration:0,
                },
            )
            animation.finished.then(() => {
                img.style.display = "block"
                resolve()
            })
        }
        img.src = src
    })
}

function updateHandXYpx(prevHand, nextHand, duration) {
    if (nextHand.length == 0) {
        return Promise.resolve()
    }
    let prevHandIDs = Cards.ids(prevHand)
    let isP1 = nextHand[0].IsP1
    if (!isP1) {
        nextHand = nextHand.reverse()
    }
    let xys = TranslateXYpx.makeHandCards(nextHand.length, isP1)

    let f = function(card, i) {
        return new Promise((resolve) => {
            let img = document.getElementById(card.ID)
            img.zIndex = i
            let xy = xys[i]
            let animation = img.animate(
                [
                    {transform:xy}
                ],
                {
                    fill:"forwards",
                    duration:duration,
                },
            )
            animation.finished.then(() => {
                if (!prevHandIDs.includes(card.ID)) {
                    img.onload = () => {
                        resolve()
                    }
                    console.log(CardImgPath.getVertical(isP1) + card.Name + ".png")
                    img.src = CardImgPath.getVertical(isP1) + card.Name + ".png"
                } else {
                    resolve()
                }
            })
        })
    }

    return Promise.all(nextHand.map(f))
}

function updateMonsterZone(prevZone, nextZone, duration) {
    for (let i=0; i<MONSTER_ZONE_LENGTH; i++) {
        let nextCard = nextZone[i]
        let nextID = nextZone[i].ID
        if (nextID == 0) {
            continue
        }
        let prevCard = prevZone[i]
        let isP1 = nextCard.IsP1
        let row = BoardRow.getMonsterZone(isP1)
        let column = MonsterZoneIndex.toBoardColumn(i, isP1)
        let isVertical = BattlePosition.isVertical(nextCard.BattlePosition)
        let xy = TranslateXYpx.makeCard(row, column, isVertical)

        if (nextCard.BattlePosition != prevCard.BattlePosition) {
            let img = document.getElementById(nextID)
            img.src = CardImgPath.get(isVertical, isP1) + CardImgFileName.get(nextCard)
        }

        if (prevZone[i].ID != nextID) {
            let img = document.getElementById(nextID)
            img.animate(
                [
                    {transform:xy},
                ],
                {
                    fill:"forwards",
                    duration:duration,
                }
            )
        }
    }
}

async function init(state) {
    let ps = []
    ps = ps.concat(state.P1.Deck.map(initCardImg))
    ps = ps.concat(state.P1.Hand.map(initCardImg))
    ps = ps.concat(state.P2.Deck.map(initCardImg))
    ps = ps.concat(state.P2.Hand.map(initCardImg))
    await Promise.all(ps)
    let p1 = updateHandXYpx([], state.P1.Hand, 1000)
    let p2 = updateHandXYpx([], state.P2.Hand, 1000)
    return Promise.all([p1, p2])
}

var mainI = 0

function next(states, actions) {
    let state = states[mainI]
    let nextState = states[mainI + 1]
    //let action = actions[mainI]
    let turnPlayerState = State.getTurnPlayer(state)
    let nextTurnPlayerState = State.getTurnPlayer(nextState)

    if (!Cards.equal(turnPlayerState.Hand, nextTurnPlayerState.Hand)) {
        updateHandXYpx(turnPlayerState.Hand, nextTurnPlayerState.Hand, 300)
    }

    if (!Cards.equal(turnPlayerState.MonsterZone, nextTurnPlayerState.MonsterZone)) {
        updateMonsterZone(turnPlayerState.MonsterZone, nextTurnPlayerState.MonsterZone, 300)
    }
    mainI += 1
}

async function Test() {
    for (let i=0; i < Board.ROW; i++) {
        for (let j=0; j < Board.COLUMN; j++) {
            Board.ELEMENT.rows[i].cells[j].firstChild.src = CardImgPath.EMPTY
        }
    }

    const states = JSON.parse(sessionStorage.getItem("states"))
    const actions = JSON.parse(sessionStorage.getItem("actions"))
    const initState = states[0]
    let promise = await init(initState)

    let nextButton = document.getElementById("next-button")
    nextButton.addEventListener("click", () => {
        next(states, actions)
    })

    new AttackDeclareCanvas()
    AttackDeclareCanvas.animate(3, 3, true, 10, 20)

    //nextButton.style.zIndex = AttackDeclareCanvas.ELEMENT.style.zIndex + 1000

    //AttackDeclareCanvas.ELEMENT.style.top = "1500px"
    //AttackDeclareCanvas.ELEMENT.style.left = "0px"
    //let img1 = document.getElementById("1")
    //img1.src = CardImgPath.getVertical(true) + "サファイアドラゴン.png"
    //let img2 = document.getElementById("2")
    //img2.src = IMG_DIR + VERTICAL_IMG_DIR + P2_IMG_DIR + "ブラッド・ヴォルス.png"
    // console.log(TranslateXYpx.make(0, 0))
    // let x = PxVal.BOARD_CELL_CENTER_XS[0]
    // let y = PxVal.BOARD_CELL_CENTER_YS[3]

    // img1.onload = () => {
    //         img1.animate(
    //     [
    //         {transform:"translateX(" + x + "px) translateY(" + y + "px)"},
    //     ],
    //     {
    //         fill:"forwards",
    //         duration:1000,
    //     }
    // )
    // }

    // let p1Cell = 2 + 4
    // let p2Cell = 2

    // let xypx1 = makeVerticalCardTranslateXYpx(getMonsterZoneRow(true), p1Cell)
    // let xypx2 = makeVerticalCardTranslateXYpx(getMonsterZoneRow(false), p2Cell)

    // let pos1 = makeVerticalCardXYpxVal(getMonsterZoneRow(true), p1Cell)
    // let pos2 = makeVerticalCardXYpxVal(getMonsterZoneRow(false), p2Cell)

    // console.log(xypx1)
    // console.log(xypx2)
    // console.log(pos1)
    // console.log(pos2) 

    // let deg = Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x)
    // deg *= (180 / Math.PI)
    // deg += (270 + 180)
    // console.log(deg)

    // img1.onload = () => {
    //         img1.animate(
    //         [
    //             {transform:xypx1 + " rotate(" + deg + "deg)", offset:0.05},
    //             {transform:xypx1 + " rotate(" + deg + "deg)", offset:0.5},
    //             {transform:xypx2 + " rotate(" + deg + "deg)", offset:1.0},
    //         ],
    //     {
    //         fill:"forwards",
    //         duration:3000,
    //     }
    // )
    // }

    // img2.onload = ()=> {
    //     img2.animate(
    //         [
    //             {transform:xypx2},
    //         ],
    //     {
    //         fill:"forwards",
    //         duration:0
    //     }
    // )
    // }

    //yd = 0 90 or 270
    //xd = 0 180 or 360

    //p1 = 0 p2 = 4 p2atk 80
}