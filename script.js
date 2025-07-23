// DOM Elements
const cursor = document.querySelector('body::before');
const backToTop = document.getElementById('backToTop');
const navbar = document.querySelector('.navbar');

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
});

// Custom Cursor Effect
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    const speed = 0.1;
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    
    document.documentElement.style.setProperty('--cursor-x', cursorX + 'px');
    document.documentElement.style.setProperty('--cursor-y', cursorY + 'px');
    
    requestAnimationFrame(animateCursor);
}

// Add CSS custom properties for cursor position
document.documentElement.style.setProperty('--cursor-x', '0px');
document.documentElement.style.setProperty('--cursor-y', '0px');

// Update cursor positioning in CSS
const style = document.createElement('style');
style.textContent = `
    body::before {
        left: var(--cursor-x);
        top: var(--cursor-y);
        transform: translate(-50%, -50%);
    }
`;
document.head.appendChild(style);

animateCursor();

// Parallax Effects
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
    
    // Navbar background opacity
    const opacity = Math.min(scrolled / 100, 0.95);
    navbar.style.background = `rgba(26, 26, 46, ${opacity})`;
    
    // Back to top button visibility
    if (scrolled > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// Mouse Parallax for Images
document.addEventListener('mousemove', (e) => {
    const parallaxImages = document.querySelectorAll('.parallax-hover');
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    
    parallaxImages.forEach(img => {
        const rect = img.getBoundingClientRect();
        const imgCenterX = rect.left + rect.width / 2;
        const imgCenterY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - imgCenterX) * 0.02;
        const deltaY = (e.clientY - imgCenterY) * 0.02;
        
        img.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1)`;
    });
});

// Tilt Effect using Vanilla Tilt
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
        max: 15,
        speed: 400,
        glare: true,
        'max-glare': 0.2,
        perspective: 1000,
    });
}

// Back to Top Button
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Glitch Text Effect Enhancement
const glitchTexts = document.querySelectorAll('.glitch-text');
glitchTexts.forEach(text => {
    text.addEventListener('mouseenter', () => {
        text.style.animation = 'none';
        text.offsetHeight; // Trigger reflow
        text.style.animation = null;
    });
});

// Typing Animation for Signature
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Intersection Observer for Advanced Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            
            // Add fade-in-up animation
            element.classList.add('fade-in-up');
            
            // Special animations for specific elements
            if (element.classList.contains('typing-text')) {
                const text = element.textContent;
                typeWriter(element, text, 80);
            }
            
            // Counter animation for stats
            if (element.classList.contains('stat-number')) {
                animateCounter(element);
            }
            
            // Timeline marker pulse
            if (element.classList.contains('marker-icon')) {
                element.style.animation = 'pulse 2s infinite';
            }
        }
    });
}, observerOptions);

// Observe elements for animations
document.querySelectorAll('.timeline-section, .typing-text, .stat-number, .marker-icon').forEach(el => {
    observer.observe(el);
});

// Counter Animation
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const suffix = element.textContent.replace(/[\d]/g, '');
    let current = 0;
    const increment = target / 30;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 50);
}

// Gallery Image Lazy Loading
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            
            // Add placeholder handling for missing images
            img.addEventListener('error', function() {
                this.style.background = 'linear-gradient(135deg, #a55eea, #45b7d1)';
                this.style.display = 'flex';
                this.style.alignItems = 'center';
                this.style.justifyContent = 'center';
                this.style.color = 'white';
                this.style.fontWeight = '600';
                this.style.fontSize = '1rem';
                this.textContent = '📸 Project Image';
            });
            
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img').forEach(img => {
    imageObserver.observe(img);
});

// Code Block Copy Functionality
document.querySelectorAll('.code-block').forEach(block => {
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-code-btn';
    copyButton.innerHTML = '📋 Copy';
    copyButton.style.cssText = `
        position: absolute;
        top: 0.8rem;
        right: 1rem;
        background: rgba(255, 107, 107, 0.2);
        border: 1px solid #ff6b6b;
        color: #ff6b6b;
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    
    const header = block.querySelector('.code-header');
    if (header) {
        header.style.position = 'relative';
        header.appendChild(copyButton);
        
        copyButton.addEventListener('click', () => {
            const code = block.querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.innerHTML = '✅ Copied!';
                copyButton.style.background = 'rgba(38, 222, 129, 0.2)';
                copyButton.style.borderColor = '#26de81';
                copyButton.style.color = '#26de81';
                
                setTimeout(() => {
                    copyButton.innerHTML = '📋 Copy';
                    copyButton.style.background = 'rgba(255, 107, 107, 0.2)';
                    copyButton.style.borderColor = '#ff6b6b';
                    copyButton.style.color = '#ff6b6b';
                }, 2000);
            });
        });
    }
});

// Timeline Progress Indicator
function updateTimelineProgress() {
    const timelineSections = document.querySelectorAll('.timeline-section');
    const scrollProgress = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);
    
    timelineSections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const marker = section.querySelector('.marker-icon');
        
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            marker.style.boxShadow = '0 0 40px rgba(78, 205, 196, 0.8)';
            marker.style.transform = 'scale(1.2)';
        } else {
            marker.style.boxShadow = '0 0 30px rgba(78, 205, 196, 0.3)';
            marker.style.transform = 'scale(1)';
        }
    });
}

window.addEventListener('scroll', updateTimelineProgress);

// Particle Background Effect
function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    
    document.body.appendChild(particleContainer);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(78, 205, 196, 0.3);
            border-radius: 50%;
            animation: float ${Math.random() * 10 + 5}s infinite linear;
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
        `;
        particleContainer.appendChild(particle);
    }
}

// Add floating animation for particles
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float {
        0% {
            transform: translateY(100vh) translateX(0px);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

createParticles();

// Mobile Menu Toggle (for responsive design)
function createMobileMenu() {
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: var(--text-primary);
        font-size: 1.5rem;
        cursor: pointer;
        
        @media (max-width: 768px) {
            display: block;
        }
    `;
    
    const navContainer = document.querySelector('.nav-container');
    navContainer.appendChild(mobileMenuBtn);
    
    mobileMenuBtn.addEventListener('click', () => {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.classList.toggle('active');
    });
}

createMobileMenu();

// Performance Optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Replace direct scroll listeners with throttled versions
window.removeEventListener('scroll', updateTimelineProgress);
window.addEventListener('scroll', throttle(updateTimelineProgress, 100));

// Add loading screen
function createLoadingScreen() {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--dark-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;
    
    loader.innerHTML = `
        <div style="text-align: center;">
            <div style="
                width: 50px;
                height: 50px;
                border: 3px solid rgba(255, 107, 107, 0.3);
                border-top: 3px solid #ff6b6b;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 1rem;
            "></div>
            <p style="color: var(--text-secondary); font-family: 'JetBrains Mono', monospace;">
                Ładowanie portfolio...
            </p>
        </div>
    `;
    
    document.body.appendChild(loader);
    
    // Add spin animation
    const spinStyle = document.createElement('style');
    spinStyle.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinStyle);
    
    // Remove loader when page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }, 1000);
    });
}

createLoadingScreen();

// Easter Egg: Konami Code
let konamiCode = [];
const konami = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konami.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konami.join(',')) {
        // Easter egg activation
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 3000);
        
        // Show message
        const message = document.createElement('div');
        message.textContent = '🎮 Konami Code Activated! Matrix mode ON';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 255, 0, 0.9);
            color: black;
            padding: 1rem 2rem;
            border-radius: 10px;
            font-family: 'JetBrains Mono', monospace;
            font-weight: 700;
            z-index: 10000;
            animation: pulse 0.5s ease-in-out;
        `;
        
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
        
        konamiCode = [];
    }
});

console.log('🚀 Portfolio loaded successfully!');
console.log('💡 Try the Konami Code: ↑↑↓↓←→←→BA');