import gsap from 'gsap';
import { onMounted, onUnmounted } from 'vue';

export function useSparkleTrail() {
    let container: HTMLElement;
    let lastX = 0;
    let lastDir = 0;
    let lastFlipTime = 0;
    let emitting = false;
    let cursorX = 0;
    let cursorY = 0;
    let emitFrame: number | null = null;

    const EMIT_DURATION = 1000; // ms

    function createSparkle(x: number, y: number) {
        const el = document.createElement('div');
        const size = Math.random() * 6 + 4;
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        gsap.set(el, {
            position: 'absolute',
            width: size,
            height: size,
            left: x,
            top: y,
            borderRadius: '50%',
            background: `hsl(${Math.random() * 360}, 100%, 70%)`,
            pointerEvents: 'none',
        });

        container.appendChild(el);

        gsap.to(el, {
            x: dx,
            y: dy,
            opacity: 0,
            scale: 0,
            duration: 0.6,
            ease: 'power1.out',
            onComplete: () => el.remove(),
        });
    }

    function loop() {
        createSparkle(cursorX, cursorY);
        emitFrame = requestAnimationFrame(loop);
    }

    function startEmitting() {
        if (emitting) return;
        emitting = true;
        loop();
        setTimeout(() => {
            if (emitFrame) cancelAnimationFrame(emitFrame);
            emitFrame = null;
            emitting = false;
        }, EMIT_DURATION);
    }

    function onMouseMove(e: MouseEvent) {
        cursorX = e.clientX;
        cursorY = e.clientY;

        const dx = cursorX - lastX;
        const dir = Math.sign(dx);
        const now = performance.now();

        const movedEnough = Math.abs(dx) > 20;
        const flippedDir = dir !== 0 && dir !== lastDir;
        const flippedRecently = now - lastFlipTime < 200;

        if (flippedDir && movedEnough && flippedRecently) {
            startEmitting();
        }

        if (flippedDir) {
            lastFlipTime = now;
        }

        lastDir = dir;
        lastX = cursorX;
    }

    onMounted(() => {
        container = document.createElement('div');
        Object.assign(container.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: '9999',
        });
        document.body.appendChild(container);
        window.addEventListener('mousemove', onMouseMove);
    });

    onUnmounted(() => {
        window.removeEventListener('mousemove', onMouseMove);
        if (emitFrame) cancelAnimationFrame(emitFrame);
        container.remove();
    });
}
