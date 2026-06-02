// ==================== NAVEGACIÓN MÓVIL ====================
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });

        // Cerrar menú al hacer click en un enlace
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
            });
        });
    }

    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ==================== BOTONES DE PLANES ====================
    document.querySelectorAll('.plan-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const planCard = e.target.closest('.plan-card');
            const planName = planCard.querySelector('h3').textContent;
            const planPrice = planCard.querySelector('.plan-price .amount').textContent;
            
            // Scroll a contacto con mensaje personalizado
            document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
            
            // Pre-llenar el asunto del formulario
            const asuntoInput = document.querySelector('input[placeholder="Asunto"]');
            if (asuntoInput) {
                asuntoInput.value = `Consulta: ${planName} (${planPrice})`;
                asuntoInput.focus();
            }
        });
    });

    // ==================== VALIDACIÓN DE FORMULARIO ====================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Obtener valores del formulario
            const inputs = contactForm.querySelectorAll('input, textarea');
            const formData = {
                nombre: inputs[0].value.trim(),
                email: inputs[1].value.trim(),
                asunto: inputs[2].value.trim(),
                mensaje: inputs[3].value.trim()
            };

            // Validación básica
            if (!formData.nombre || !formData.email || !formData.mensaje) {
                showMessage('Por favor completa los campos obligatorios.', 'error');
                return;
            }

            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showMessage('Por favor ingresa un email válido.', 'error');
                return;
            }

            // Simular envío
            showMessage('¡Mensaje enviado exitosamente! Te contactaremos pronto.', 'success');
            
            // Limpiar formulario
            contactForm.reset();

            // En producción, aquí iría una llamada a un servidor
            console.log('Datos del formulario:', formData);
        });
    }

    // ==================== ANIMACIÓN DE APARICIÓN SCROLL ====================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Aplicar a elementos que aparezcan con scroll
    document.querySelectorAll('.servicio-card, .feature, .portfolio-item').forEach(el => {
        observer.observe(el);
    });

    // ==================== CONTADOR DE ESTADÍSTICAS ====================
    function animateCounter(element, target, duration = 2000) {
        let current = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Animar números si existen
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    const target = parseInt(entry.target.textContent);
                    animateCounter(entry.target, target);
                    statsObserver.unobserve(entry.target);
                }
            });
        });

        stats.forEach(stat => statsObserver.observe(stat));
    }
});

// ==================== FUNCIÓN PARA MOSTRAR MENSAJES ====================
function showMessage(message, type = 'success') {
    // Crear elemento del mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    // Estilos inline
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
    `;

    // Agregar keyframe animation
    if (!document.querySelector('style[data-toast]')) {
        const style = document.createElement('style');
        style.setAttribute('data-toast', 'true');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(messageDiv);

    // Remover después de 4 segundos
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => messageDiv.remove(), 300);
    }, 4000);
}

// ==================== AGREGAR ANIMACIÓN FADEUP ====================
if (!document.querySelector('style[data-animations]')) {
    const style = document.createElement('style');
    style.setAttribute('data-animations', 'true');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// ==================== EFECTO PARALLAX (OPCIONAL) ====================
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < 800) {
        hero.style.backgroundPosition = `center ${scrolled * 0.5}px`;
    }
});