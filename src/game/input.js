import { emit } from '/src/eventBus.js';

export function setupInput() {
    window.addEventListener('keydown', (e) => {
        switch (e.code) {
        case 'ArrowLeft':
            emit('move', { direction: 'left' });
            break;
        case 'ArrowRight':
            emit('move', { direction: 'right' });
            break;
        case 'ArrowDown':
            emit('move', { direction: 'down' });
            break;
        case 'KeyZ':
            emit('rotate', { direction: 'left' });
            break;
        case 'KeyX':
            emit('rotate', { direction: 'right' });
            break;
        case 'ArrowUp':
            emit('hardDrop');
            break;
        case 'ShiftLeft':
            emit('hold');
            break;
        case 'Enter':
            emit('togglePause');
            break;
        case 'KeyR':
            emit('resetGame');
            break;
        default:
            break;
        }
    });
}
