// ===== HIỆU ỨNG SAO CHỔI & NGÔI SAO (NHẸ) =====
(function() {
    'use strict';

    const canvas = document.getElementById('universe-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let stars = [];
    let comets = [];
    let animationId = null;
    let lastTime = 0;

    // Số lượng đối tượng - GIẢM ĐỂ TRÁNH LAG
    const NUM_STARS = 150;  // Giảm từ 300
    const NUM_COMETS = 4;   // Giảm từ 5

    // ---- Thiết lập kích thước canvas ----
    let resizeTimeout;

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
        }, 150);
    });

    // ---- Tạo đối tượng ----
    function createStar() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5 + 0.3,
            brightness: Math.random() * 0.7 + 0.3,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinklePhase: Math.random() * Math.PI * 2,
            color: Math.random() > 0.7 ? `hsl(${Math.random() * 60 + 200}, 80%, 70%)` : '#ffffff'
        };
    }

    function createComet() {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 1;
        return {
            x: Math.random() * width,
            y: Math.random() * height * 0.2,
            vx: Math.cos(angle) * speed * 0.7,
            vy: Math.sin(angle) * speed * 0.7 + 0.2,
            length: Math.random() * 50 + 20,
            radius: Math.random() * 1.5 + 1,
            brightness: Math.random() * 0.5 + 0.3,
            hue: Math.random() * 60 + 200,
        };
    }

    // ---- Khởi tạo ----
    function initUniverse() {
        stars = [];
        for (let i = 0; i < NUM_STARS; i++) {
            stars.push(createStar());
        }

        comets = [];
        for (let i = 0; i < NUM_COMETS; i++) {
            comets.push(createComet());
        }
    }

    // ---- Vẽ ngôi sao ----
    function drawStar(star, time) {
        const twinkle = 0.6 + 0.4 * Math.sin(time * star.twinkleSpeed + star.twinklePhase);
        const alpha = star.brightness * twinkle;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color || `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowColor = `rgba(200, 200, 255, ${alpha * 0.15})`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // ---- Vẽ sao chổi ----
    function drawComet(comet, time) {
        const alpha = comet.brightness * (0.7 + 0.3 * Math.sin(time * 0.001 + comet.x));

        // Vẽ đuôi sao chổi
        const tailLength = comet.length;
        const gradient = ctx.createRadialGradient(
            comet.x, comet.y, 0,
            comet.x - comet.vx * 0.5, comet.y - comet.vy * 0.5, tailLength
        );

        const hue = comet.hue;
        gradient.addColorStop(0, `hsla(${hue}, 100%, 90%, ${alpha})`);
        gradient.addColorStop(0.2, `hsla(${hue - 20}, 100%, 70%, ${alpha * 0.5})`);
        gradient.addColorStop(0.5, `hsla(${hue - 40}, 80%, 50%, ${alpha * 0.25})`);
        gradient.addColorStop(1, `hsla(${hue - 60}, 60%, 30%, 0)`);

        ctx.beginPath();
        const tailX = comet.x - comet.vx * 0.7;
        const tailY = comet.y - comet.vy * 0.7;
        ctx.moveTo(comet.x, comet.y);
        ctx.lineTo(tailX - comet.vy * 0.3, tailY + comet.vx * 0.3);
        ctx.lineTo(tailX - comet.vx * 0.4, tailY - comet.vy * 0.4);
        ctx.lineTo(tailX + comet.vy * 0.3, tailY - comet.vx * 0.3);
        ctx.closePath();

        ctx.fillStyle = gradient;
        ctx.shadowColor = `hsla(${hue}, 100%, 70%, ${alpha * 0.2})`;
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Vẽ đầu sao chổi
        const headGradient = ctx.createRadialGradient(
            comet.x, comet.y, 0,
            comet.x, comet.y, comet.radius * 2.5
        );
        headGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.8})`);
        headGradient.addColorStop(0.3, `hsla(${hue}, 100%, 85%, ${alpha * 0.4})`);
        headGradient.addColorStop(1, `hsla(${hue}, 100%, 70%, 0)`);

        ctx.beginPath();
        ctx.arc(comet.x, comet.y, comet.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = headGradient;
        ctx.shadowColor = `hsla(${hue}, 100%, 80%, ${alpha * 0.3})`;
        ctx.shadowBlur = 30;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Hạt nhân
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, comet.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        ctx.shadowColor = `rgba(255, 255, 255, ${alpha * 0.4})`;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // ---- Cập nhật vị trí ----
    function updateComet(comet) {
        comet.x += comet.vx;
        comet.y += comet.vy;

        comet.vx += Math.sin(comet.y * 0.01) * 0.004;
        comet.vy += Math.cos(comet.x * 0.01) * 0.004;

        const speed = Math.sqrt(comet.vx * comet.vx + comet.vy * comet.vy);
        if (speed > 3.5) {
            comet.vx = (comet.vx / speed) * 3;
            comet.vy = (comet.vy / speed) * 3;
        }

        const margin = 100;
        if (comet.x < -margin || comet.x > width + margin ||
            comet.y < -margin || comet.y > height + margin) {
            Object.assign(comet, createComet());
            comet.x = Math.random() * width;
            comet.y = Math.random() * height * 0.2;
        }
    }

    // ---- Animation chính ----
    function animate(time) {
        // Giới hạn frame rate để tiết kiệm CPU
        if (time - lastTime < 16) {
            animationId = requestAnimationFrame(animate);
            return;
        }
        lastTime = time;

        ctx.clearRect(0, 0, width, height);

        // Vẽ ngôi sao
        for (const star of stars) {
            drawStar(star, time);
        }

        // Vẽ sao chổi
        for (const comet of comets) {
            updateComet(comet);
            drawComet(comet, time);
        }

        animationId = requestAnimationFrame(animate);
    }

    // ---- Khởi động ----
    function startUniverse() {
        resizeCanvas();
        initUniverse();
        if (animationId) cancelAnimationFrame(animationId);
        lastTime = 0;
        animate(0);
    }

    // ---- Xử lý tab ẩn/hiện ----
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        } else {
            if (!animationId) {
                lastTime = 0;
                animate(0);
            }
        }
    });

    // ---- Khởi chạy ----
    if (document.readyState === 'complete') {
        startUniverse();
    } else {
        window.addEventListener('load', startUniverse);
    }

})();
