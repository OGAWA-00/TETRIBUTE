import { gameState } from "../game/state.js";

const SLOT_TABLE = {
    //1: "X",
    1: "LI",
    2: "F",
}

let result;

export function slotStart() {
    gameState.slotCount -= 1;

    const lottery = Math.floor(Math.random()+0.80); //80%
    if (!lottery){ //20%ではずれ
        return
    }
    result = SLOT_TABLE[1+Math.floor(Math.random()* Object.keys(SLOT_TABLE).length)];   
}

export function slotStop() {
    if (result) {
        gameState.nextQueue.unshift(result);
        result = null;
    }
}