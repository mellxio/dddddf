// ===== HIỆU ỨNG VŨ TRỤ =====
(function() {
    'use strict';

    const canvas = document.getElementById('universe-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let stars = [];
    let comets = [];
    let planets = [];
    let galaxies = [];
    let animationId = null;
    let lastTime = 0;

    // Số lượng đối tượng
    const NUM_STARS = 300;
    const NUM_COMETS = 5;
    const NUM_PLANETS = 8;
    const NUM_GALAXIES = 3;

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
            for (const planet of planets) {
                planet.centerX = width / 2 + (Math.random() - 0.5) * width * 0.3;
                planet.centerY = height / 2 + (Math.random() - 0.5) * height * 0.3;
            }
        }, 150);
    });

    // ---- Tạo đối tượng ----
    function createStar() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.8 + 0.3,
            brightness: Math.random() * 0.7 + 0.3,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinklePhase: Math.random() * Math.PI * 2,
            color: Math.random() > 0.7 ? `hsl(${Math.random() * 60 + 200}, 80%, 70%)` : '#ffffff'
        };
    }

    function createPlanet() {
        const types = [
            { radius: 20, color: '#e74c3c' },
            { radius: 35, color: '#f39c12' },
            { radius: 25, color: '#2ecc71' },
            { radius: 30, color: '#3498db' },
            { radius: 18, color: '#95a5a6' },
            { radius: 28, color: '#e67e22' },
            { radius: 22, color: '#1abc9c' },
            { radius: 32, color: '#9b59b6' }
        ];
        const type = types[Math.floor(Math.random() * types.length)];
        const orbitRadius = Math.random() * Math.min(width, height) * 0.35 + 100;
        const orbitSpeed = (Math.random() * 0.001 + 0.0005) * (Math.random() > 0.5 ? 1 : -1);
        const angle = Math.random() * Math.PI * 2;
        const centerX = width / 2 + (Math.random() - 0.5) * width * 0.3;
        const centerY = height / 2 + (Math.random() - 0.5) * height * 0.3;

        return {
            x: centerX + Math.cos(angle) * orbitRadius,
            y: centerY + Math.sin(angle) * orbitRadius,
            radius: type.radius,
            color: type.color,
            orbitRadius: orbitRadius,
            orbitSpeed: orbitSpeed,
            angle: angle,
            centerX: centerX,
            centerY: centerY,
            glow: Math.random() * 0.3 + 0.1,
            ring: Math.random() > 0.6,
        };
    }

    function createGalaxy() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 120 + 80,
            arms: Math.floor(Math.random() * 3) + 2,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() * 0.0003 + 0.0001) * (Math.random() > 0.5 ? 1 : -1),
            starCount: Math.floor(Math.random() * 200) + 100,
            color1: `hsl(${Math.random() * 60 + 220}, 80%, 60%)`,
            color2: `hsl(${Math.random() * 60 + 260}, 70%, 50%)`,
            opacity: Math.random() * 0.2 + 0.1,
        };
    }

    function createComet() {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1.5;
        return {
            x: Math.random() * width,
            y: Math.random() * height * 0.2,
            vx: Math.cos(angle) * speed * 0.8,
            vy: Math.sin(angle) * speed * 0.8 + 0.3,
            length: Math.random() * 60 + 30,
            radius: Math.random() * 2 + 1.5,
            brightness: Math.random() * 0.6 + 0.4,
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

        planets = [];
        for (let i = 0; i < NUM_PLANETS; i++) {
            planets.push(createPlanet());
        }

        galaxies = [];
        for (let i = 0; i < NUM_GALAXIES; i++) {
            galaxies.push(createGalaxy());
        }
    }

    // ---- Vẽ thiên hà ----
    function drawGalaxy(galaxy, time) {
        const { x, y, radius, arms, rotation, starCount, color1, color2, opacity } = galaxy;
        const rot = rotation + time * galaxy.rotationSpeed;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.globalAlpha = opacity;

        for (let arm = 0; arm < arms; arm++) {
            const armAngle = (arm / arms) * Math.PI * 2;
            for (let i = 0; i < starCount; i++) {
                const t = i / starCount;
                const dist = t * radius;
                const angle = t * 4 * Math.PI + armAngle;
                const starX = Math.cos(angle) * dist;
                const starY = Math.sin(angle) * dist;

                const size = (1 - t) * 2 + 0.5;

                const gradient = ctx.createRadialGradient(
                    starX, starY, 0,
                    starX, starY, size * 2
                );
                gradient.addColorStop(0, color1);
                gradient.addColorStop(0.5, color2);
                gradient.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.arc(starX, starY, size * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.shadowColor = color1;
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        // Trung tâm thiên hà
        const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.2);
        centerGradient.addColorStop(0, 'rgba(255,255,255,0.3)');
        centerGradient.addColorStop(0.5, color1);
        centerGradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = centerGradient;
        ctx.shadowColor = color1;
        ctx.shadowBlur = 40;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
        ctx.globalAlpha = 1;
    }

    // ---- Vẽ hành tinh ----
    function drawPlanet(planet, time) {
        const { x, y, radius, color, ring, glow } = planet;

        // Hiệu ứng phát sáng
        const glowRadius = radius * 1.5;
        const glowGradient = ctx.createRadialGradient(x, y, radius * 0.5, x, y, glowRadius);
        glowGradient.addColorStop(0, `rgba(255,255,255,${glow * 0.2})`);
        glowGradient.addColorStop(0.5, `${color}${Math.floor(glow * 30).toString(16).padStart(2, '0')}`);
        glowGradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.shadowColor = color;
        ctx.shadowBlur = 30;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Vành đai
        if (ring) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(0.3);
            ctx.strokeStyle = `rgba(255,255,255,0.2)`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(0, 0, radius * 1.8, radius * 0.4, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.strokeStyle = `rgba(200,200,200,0.1)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(0, 0, radius * 2, radius * 0.5, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // Thân hành tinh
        const gradient = ctx.createRadialGradient(
            x - radius * 0.3,
            y - radius * 0.3,
            radius * 0.1,
            x,
            y,
            radius
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.2, color);
        gradient.addColorStop(0.8, color);
        gradient.addColorStop(1, 'rgba(0,0,0,0.3)');

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Chi tiết bề mặt
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * radius * 0.7;
            const spotX = x + Math.cos(angle) * dist;
            const spotY = y + Math.sin(angle) * dist;
            const spotRadius = Math.random() * radius * 0.2 + 1;

            ctx.beginPath();
            ctx.arc(spotX, spotY, spotRadius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.1})`;
            ctx.fill();
        }
    }

    // ---- Vẽ ngôi sao ----
    function drawStar(star, time) {
        const twinkle = 0.6 + 0.4 * Math.sin(time * star.twinkleSpeed + star.twinklePhase);
        const alpha = star.brightness * twinkle;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color || `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowColor = `rgba(200, 200, 255, ${alpha * 0.2})`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // ---- Vẽ sao chổi ----
    function drawComet(comet, time) {
        const alpha = comet.brightness * (0.7 + 0.3 * Math.sin(time * 0.001 + comet.x));

        const tailLength = comet.length;
        const gradient = ctx.createRadialGradient(
            comet.x, comet.y, 0,
            comet.x - comet.vx * 0.5, comet.y - comet.vy * 0.5, tailLength
        );

        const hue = comet.hue;
        gradient.addColorStop(0, `hsla(${hue}, 100%, 90%, ${alpha})`);
        gradient.addColorStop(0.2, `hsla(${hue - 20}, 100%, 70%, ${alpha * 0.6})`);
        gradient.addColorStop(0.5, `hsla(${hue - 40}, 80%, 50%, ${alpha * 0.3})`);
        gradient.addColorStop(1, `hsla(${hue - 60}, 60%, 30%, 0)`);

        ctx.beginPath();
        const tailX = comet.x - comet.vx * 0.8;
        const tailY = comet.y - comet.vy * 0.8;
        ctx.moveTo(comet.x, comet.y);
        ctx.lineTo(tailX - comet.vy * 0.4, tailY + comet.vx * 0.4);
        ctx.lineTo(tailX - comet.vx * 0.5, tailY - comet.vy * 0.5);
        ctx.lineTo(tailX + comet.vy * 0.4, tailY - comet.vx * 0.4);
        ctx.closePath();

        ctx.fillStyle = gradient;
        ctx.shadowColor = `hsla(${hue}, 100%, 70%, ${alpha * 0.3})`;
        ctx.shadowBlur = 30;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Đầu sao chổi
        const headGradient = ctx.createRadialGradient(
            comet.x, comet.y, 0,
            comet.x, comet.y, comet.radius * 3
        );
        headGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.9})`);
        headGradient.addColorStop(0.3, `hsla(${hue}, 100%, 85%, ${alpha * 0.5})`);
        headGradient.addColorStop(1, `hsla(${hue}, 100%, 70%, 0)`);

        ctx.beginPath();
        ctx.arc(comet.x, comet.y, comet.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = headGradient;
        ctx.shadowColor = `hsla(${hue}, 100%, 80%, ${alpha * 0.4})`;
        ctx.shadowBlur = 40;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Hạt nhân
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, comet.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
        ctx.shadowColor = `rgba(255, 255, 255, ${alpha * 0.5})`;
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // ---- Cập nhật vị trí ----
    function updateComet(comet) {
        comet.x += comet.vx;
        comet.y += comet.vy;

        comet.vx += Math.sin(comet.y * 0.01) * 0.005;
        comet.vy += Math.cos(comet.x * 0.01) * 0.005;

        const speed = Math.sqrt(comet.vx * comet.vx + comet.vy * comet.vy);
        if (speed > 4) {
            comet.vx = (comet.vx / speed) * 3.5;
            comet.vy = (comet.vy / speed) * 3.5;
        }

        const margin = 100;
        if (comet.x < -margin || comet.x > width + margin ||
            comet.y < -margin || comet.y > height + margin) {
            Object.assign(comet, createComet());
            comet.x = Math.random() * width;
            comet.y = Math.random() * height * 0.2;
        }
    }

    function updatePlanet(planet, time) {
        planet.angle += planet.orbitSpeed;
        planet.x = planet.centerX + Math.cos(planet.angle) * planet.orbitRadius;
        planet.y = planet.centerY + Math.sin(planet.angle) * planet.orbitRadius;
    }

    // ---- Animation chính ----
    function animate(time) {
        if (time - lastTime < 16) {
            animationId = requestAnimationFrame(animate);
            return;
        }
        lastTime = time;

        ctx.clearRect(0, 0, width, height);

        // Vẽ thiên hà
        for (const galaxy of galaxies) {
            drawGalaxy(galaxy, time);
        }

        // Vẽ ngôi sao
        for (const star of stars) {
            drawStar(star, time);
        }

        // Vẽ hành tinh
        for (const planet of planets) {
            updatePlanet(planet, time);
            drawPlanet(planet, time);
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
