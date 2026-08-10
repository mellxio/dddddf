// ===== XỬ LÝ SOCIAL LINKS =====
(function() {
    'use strict';

    const defaultLinks = {
        'YouTube': 'https://www.youtube.com/@yourchannel',
        'X': 'https://x.com/yourhandle',
        'Instagram': 'https://www.instagram.com/yourprofile',
        'GitHub': 'https://github.com/yourusername',
        'TikTok': 'https://www.tiktok.com/@yourhandle'
    };

    // Cập nhật link
    document.querySelectorAll('.social-btn').forEach(btn => {
        const text = btn.textContent.trim();
        let platform = '';
        if (text.includes('YouTube')) platform = 'YouTube';
        else if (text.includes('X')) platform = 'X';
        else if (text.includes('Instagram')) platform = 'Instagram';
        else if (text.includes('GitHub')) platform = 'GitHub';
        else if (text.includes('TikTok')) platform = 'TikTok';

        if (platform && defaultLinks[platform]) {
            if (btn.getAttribute('href') === '#' || btn.getAttribute('href') === '') {
                btn.setAttribute('href', defaultLinks[platform]);
            }
        }
    });

    // ===== HIỆU ỨNG RIPPLE =====
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.className = 'ripple';

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

})();
