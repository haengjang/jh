// Global Toggle Function for robustness
window.toggleAudioPlayer = function () {
    const audioPlayer = document.getElementById('audioPlayer');
    const btn = document.getElementById('togglePlayerBtn');
    if (audioPlayer && btn) {
        audioPlayer.classList.toggle('minimized');
        if (audioPlayer.classList.contains('minimized')) {
            btn.textContent = '🎵';
        } else {
            btn.textContent = '🔽';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentPage = 0;

    function showPage(index) {
        pages.forEach((page, i) => {
            if (i === index) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });

        // Button state
        // Button state
        if (index === 0) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'block';
            nextBtn.textContent = '시작하기 ❤️';
        } else if (index === pages.length - 1) {
            nextBtn.style.display = 'block'; // Ensure it's shown
            prevBtn.style.display = 'block';
            prevBtn.textContent = '이전';
            nextBtn.textContent = '처음으로 🔄'; // Change text to Restart
        } else {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
            nextBtn.textContent = '다음 >';
            prevBtn.textContent = '< 이전';
        }

        currentPage = index;
    }

    // Start button logic (Handles Audio + Navigation)
    nextBtn.addEventListener('click', () => {
        // 1. Play Audio on first click
        if (!audioStarted && audio) {
            // Check if audio context is allowed
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    playerPlayBtn.textContent = '❚❚';
                }).catch(e => console.log("Audio play prevented:", e));
            }
            audioStarted = true;
        }

        // 2. Navigation Logic
        if (currentPage < pages.length - 1) {
            showPage(currentPage + 1);
        } else {
            // On last page, go back to first page
            showPage(0);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            showPage(currentPage - 1);
        }
    });

    // Initialize
    showPage(0);

    // Audio Control
    const audio = document.getElementById('bgMusic');
    const playerPlayBtn = document.getElementById('playerPlayBtn');
    const progressBar = document.getElementById('progressBar');
    const volumeBar = document.getElementById('volumeBar');
    let audioStarted = false;

    // Player Play/Pause
    playerPlayBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playerPlayBtn.textContent = '❚❚';
            audioStarted = true;
        } else {
            audio.pause();
            playerPlayBtn.textContent = '▶';
        }
    });

    // Progress Bar
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressBar.value = percent;
        }
    });

    progressBar.addEventListener('input', () => {
        if (audio.duration) {
            audio.currentTime = (progressBar.value / 100) * audio.duration;
        }
    });

    // Volume
    volumeBar.addEventListener('input', () => {
        audio.volume = volumeBar.value;
    });

    // Confetti Effect
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti';
    document.getElementById('app').appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    const colors = ['#ff9a9e', '#fecfef', '#a18cd1', '#fbc2eb', '#fad0c4'];

    function resizeCanvas() {
        const app = document.getElementById('app');
        if (app) {
            canvas.width = app.offsetWidth;
            canvas.height = app.offsetHeight;
        } else {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: -20,
            size: Math.random() * 8 + 4,
            speedY: Math.random() * 2 + 1,
            speedX: Math.random() * 2 - 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360
        };
    }

    function updateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (particles.length < 50) {
            particles.push(createParticle());
        }

        particles.forEach((p, index) => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += 2;

            ctx.fillStyle = p.color;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();

            if (p.y > canvas.height) {
                particles[index] = createParticle();
            }
        });
        requestAnimationFrame(updateConfetti);
    }

    updateConfetti();

    // Album Art Slideshow (Cross-Dissolve)
    const slideImg1 = document.getElementById('slideImg1');
    const slideImg2 = document.getElementById('slideImg2');
    let currentSlideIndex = 1;
    let activeSlide = 1; // 1 or 2

    if (slideImg1 && slideImg2) {
        setInterval(() => {
            currentSlideIndex = (currentSlideIndex % 24) + 1;
            const nextSrc = `img/${currentSlideIndex}.jpg`;

            if (activeSlide === 1) {
                slideImg2.src = nextSrc;
                slideImg2.onload = () => {
                    slideImg2.classList.add('active');
                    slideImg1.classList.remove('active');
                    activeSlide = 2;
                };
            } else {
                slideImg1.src = nextSrc;
                slideImg1.onload = () => {
                    slideImg1.classList.add('active');
                    slideImg2.classList.remove('active');
                    activeSlide = 1;
                };
            }
        }, 3000);
    }

    // Scattered Collage Logic
    const collageContainer = document.getElementById('collageContainer');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const closeModal = document.querySelector('.close-modal');

    if (collageContainer) {
        for (let i = 1; i <= 24; i++) {
            const img = document.createElement('img');
            img.src = `img/${i}.jpg`;
            img.className = 'collage-photo';

            // Random Position & Rotation
            // We use % to keep it responsive, keeping within roughly 80% bounds to avoid overflow
            const randomX = Math.random() * 80 + 5;
            const randomY = Math.random() * 80 + 5;
            const randomRot = Math.random() * 40 - 20; // -20 to 20 deg

            img.style.left = `${randomX}%`;
            img.style.top = `${randomY}%`;
            img.style.transform = `rotate(${randomRot}deg)`;
            img.style.zIndex = Math.floor(Math.random() * 20);

            // Modal Click
            img.addEventListener('click', () => {
                modal.style.display = 'block';
                modalImg.src = img.src;
            });

            collageContainer.appendChild(img);
        }
    }

    // Modal Close
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    }

});
