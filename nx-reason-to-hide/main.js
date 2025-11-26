document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const stageVoid = document.getElementById('stage-void');
    const stageHub = document.getElementById('stage-hub');
    const planet = document.getElementById('purple-planet');
    const voidHint = document.querySelector('.void-hint');

    // Menu Elements
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-link');

    // TRANSITION: Void -> Hub
    if (planet) {
        planet.addEventListener('click', () => {
            // Zoom into the planet
            planet.style.transform = 'scale(20)';
            planet.style.opacity = '0';
            planet.style.transition = 'all 1.5s ease-in';

            setTimeout(() => {
                stageVoid.classList.remove('active');
                stageVoid.style.display = 'none';

                stageHub.classList.add('active');
                // Reset body overflow to allow scrolling in Hub
                document.body.style.overflow = 'auto';
            }, 1200);
        });
    }

    // Make void hint clickable (Basic version)
    if (voidHint) {
        voidHint.addEventListener('click', () => {
            planet.click();
        });
        voidHint.style.cursor = 'pointer';
    }

    // --- Immersive Navigation Logic ---
    const stageWarp = document.getElementById('stage-warp');
    const warpMessage = document.querySelector('.warp-message');

    function triggerWarp(targetId) {
        // 1. Close Menu if open
        if (menuOverlay && menuOverlay.classList.contains('active')) {
            menuOverlay.classList.remove('active');
        }

        // 2. Activate Warp Stage
        stageWarp.classList.add('active');
        stageWarp.classList.add('warp-active'); // Triggers CSS animations

        // Optional: Change message based on destination
        if (warpMessage) {
            warpMessage.style.opacity = '1';
            setTimeout(() => { warpMessage.style.opacity = '0'; }, 1500);
        }

        // 3. Wait for "Travel" (2 seconds)
        setTimeout(() => {
            // 4. Hide all stages
            document.querySelectorAll('.stage').forEach(el => {
                if (el.id !== 'stage-warp') {
                    el.classList.remove('active');
                    el.style.display = 'none';
                }
            });

            // 5. Show Target Stage
            const targetStage = document.getElementById(targetId);
            if (targetStage) {
                targetStage.style.display = 'block';

                // Small delay to allow display:block to apply before adding active class for fade-in
                setTimeout(() => {
                    targetStage.classList.add('active');
                }, 50);
            }

            // 6. Fade out Warp
            stageWarp.classList.remove('warp-active');
            setTimeout(() => {
                stageWarp.classList.remove('active');
            }, 500); // Wait for warp fade out

        }, 2000); // Duration of warp travel
    }

    // Menu Link Click Handlers
    const navLinks = document.querySelectorAll('.menu-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            if (targetId) {
                triggerWarp(targetId);
            }
        });
    });

    // Back Button Handlers
    const backBtns = document.querySelectorAll('.back-btn');
    backBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = btn.getAttribute('data-target');
            if (targetId) {
                triggerWarp(targetId);
            }
        });
    });

    // Menu Toggle Logic (Existing)
    function toggleMenu() {
        if (menuOverlay) {
            menuOverlay.classList.toggle('active');
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    if (menuClose) {
        menuClose.addEventListener('click', toggleMenu);
    }

    // META Immersive Experience
    const metaPanel = document.getElementById('meta-artist-panel');
    if (metaPanel) {
        metaPanel.addEventListener('click', () => {
            triggerWarp('stage-meta-planet');
        });
    }

    console.log("Nx Reason Immersive Experience Loaded");
});
