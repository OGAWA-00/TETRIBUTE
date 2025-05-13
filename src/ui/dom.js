export function getBackgroundContext() {
    return document.getElementById('background').getContext('2d');
}

export function getFieldContext() {
    return document.getElementById('field-canvas');
}
  
export function getNextContext() {
    return document.getElementById('next-canvas');
}
  
export function getHoldContext() {
    return document.getElementById('hold-canvas');
}

export function getScoreContext() {
    return document.getElementById('score-canvas');
}

export function getSlotContext() {
    return document.getElementById('slot-canvas');
}