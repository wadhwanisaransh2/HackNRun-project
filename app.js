// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Initialize Particles.js
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true
        }
    },
    retina_detect: true
});

// Initialize Typed.js
var typed = new Typed('#typed-text', {
    strings: [
        "Gamified STEM education designed specifically for rural students in grades 6-12.",
        "Learn anytime, anywhere - even offline!",
        "Making education engaging through game-based learning."
    ],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 2000,
    startDelay: 500,
    loop: true,
    showCursor: true,
    cursorChar: '|'
});

// Initialize Swiper
var swiper = new Swiper(".testimonialsSwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        640: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.getElementById('main-nav');

mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (mainNav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});
 document.addEventListener('DOMContentLoaded', function() {
            const profileTrigger = document.querySelector('.profile-trigger');
            const dropdownMenu = document.querySelector('.dropdown-menu');

            if (profileTrigger && dropdownMenu) {
                // Toggle dropdown on click
                profileTrigger.addEventListener('click', (event) => {
                    event.stopPropagation(); // Prevents the window click listener from firing immediately
                    const isExpanded = dropdownMenu.classList.toggle('show');
                    profileTrigger.setAttribute('aria-expanded', isExpanded);
                });

                // Close dropdown if clicked outside
                window.addEventListener('click', (event) => {
                    if (dropdownMenu.classList.contains('show') && !profileTrigger.contains(event.target)) {
                        dropdownMenu.classList.remove('show');
                        profileTrigger.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        });
// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
// Animate stats counter
function animateCounter(el, target, duration) {
    let startTime = null;
    const startValue = 0;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * (target - startValue) + startValue);
        
        el.textContent = value; // remove '%' unless needed
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    }
    
    window.requestAnimationFrame(step);
}

// Initialize counters when stats section is in view
const statsSection = document.querySelector('.stats');
let statsAnimated = false;

function checkStatsInView() {
    const rect = statsSection.getBoundingClientRect();
    const inView = (rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.bottom >= 0);

    if (inView && !statsAnimated) {
        document.querySelectorAll('.stat-number').forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            animateCounter(stat, target, 2000);
        });
        statsAnimated = true;
    }
}

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts (This function is not provided, so it remains a placeholder)
    if (typeof initCharts === 'function') {
        initCharts();
    }
    
    // Check if stats are in view on load
    checkStatsInView();
    
    // Add scroll event listener to animate stats when they come into view
    window.addEventListener('scroll', checkStatsInView);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            
            // Scroll to target
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// GSAP animations
gsap.registerPlugin(ScrollTrigger);

// Animate feature cards on scroll
gsap.utils.toArray('.feature-card, .subject-card').forEach(card => {
    gsap.fromTo(card, 
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        }
    );
});

// NEW: Function to handle "Explore Now" click and redirect
function redirectToPage(page) {
    console.log(`Redirecting to ${page}`); // Log for debugging
    // For a real-world application, you would change the URL here:
    // window.location.href = page;
    // Since these are not real pages, we'll just show an alert.
    alert(`Redirecting to the ${page.replace('.html', '').toUpperCase()} page!\n\nThis is where the detailed course content would be loaded.`);
}

document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Toggle Functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Function to apply the saved theme on page load
    const applyTheme = () => {
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme === 'enabled') {
            body.classList.add('dark-mode');
            if(darkModeToggle) darkModeToggle.checked = true;
        } else {
            body.classList.remove('dark-mode');
            if(darkModeToggle) darkModeToggle.checked = false;
        }
    };

    applyTheme();

    if(darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            if (darkModeToggle.checked) {
                body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }

    // --- Other existing JS code from your app.js file should go here ---
});