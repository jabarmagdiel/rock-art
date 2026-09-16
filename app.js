/**
 * ROCK ART - BIO-ARQUITECTURA Y PAISAJISMO
 * Lógica interactiva de alta gama:
 * - Partículas de ambiente bioluminiscente en Hero
 * - Slider interactivo Antes y Después
 * - Simulador interactivo de proyectos en 3 pasos con WhatsApp
 * - Efecto 3D Tilt en tarjetas
 * - Sonido ambiental de cascada y naturaleza (Web Audio API)
 * - Filtros de galería, Lightbox modal y menú responsivo
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Header scroll effect & Active Link on Scroll
  // =========================================================================
  const siteHeader = document.getElementById('site-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    const scrollY = window.pageYOffset + 180;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // =========================================================================
  // 2. Mobile Navigation Drawer
  // =========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const closeDrawer = document.getElementById('close-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileMenu = () => {
    mobileDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
    mobileToggle.setAttribute('aria-expanded', 'true');
  };

  const closeMobileMenu = () => {
    mobileDrawer.classList.remove('open');
    document.body.style.overflow = '';
    mobileToggle.setAttribute('aria-expanded', 'false');
  };

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (closeDrawer) closeDrawer.addEventListener('click', closeMobileMenu);
  mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // =========================================================================
  // 3. Canvas de Partículas Bioluminiscentes en Hero
  // =========================================================================
  const canvas = document.getElementById('hero-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 1;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = -Math.random() * 0.6 - 0.2; // float upwards
        this.opacity = Math.random() * 0.7 + 0.2;
        this.hue = Math.random() > 0.4 ? 105 : 45; // green or warm amber
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y < 0 || this.x < 0 || this.x > canvas.width) {
          this.reset();
          this.y = canvas.height + 10;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, ${this.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${this.hue}, 90%, 60%, 0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor(canvas.width / 22), 65);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    initParticles();

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animateParticles);
    };

    animateParticles();
  }

  // =========================================================================
  // 4. Slider Interactivo Antes y Después
  // =========================================================================
  const baContainer = document.getElementById('before-after-slider');
  const baResize = document.getElementById('ba-resize');
  const baHandle = document.getElementById('ba-handle');

  if (baContainer && baResize && baHandle) {
    let isDragging = false;

    const baBeforeImg = baResize.querySelector('.ba-before');

    const updateSlider = (clientX) => {
      const rect = baContainer.getBoundingClientRect();
      let offsetX = clientX - rect.left;

      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      baResize.style.width = `${percentage}%`;
      baHandle.style.left = `${percentage}%`;

      if (baBeforeImg) {
        baBeforeImg.style.width = `${rect.width}px`;
      }
    };

    const syncBeforeImageWidth = () => {
      const rect = baContainer.getBoundingClientRect();
      if (baBeforeImg) {
        baBeforeImg.style.width = `${rect.width}px`;
      }
    };

    window.addEventListener('resize', syncBeforeImageWidth);
    syncBeforeImageWidth();

    // Mouse Events
    baContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    });

    // Touch Events for Mobile
    baContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      updateSlider(e.touches[0].clientX);
    }, { passive: true });
  }

  // =========================================================================
  // 5. 3D Tilt Effect en Tarjetas
  // =========================================================================
  const tiltElements = document.querySelectorAll('[data-tilt]');

  tiltElements.forEach(elem => {
    elem.addEventListener('mousemove', (e) => {
      const rect = elem.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      const rotateX = -deltaY * 6;
      const rotateY = deltaX * 6;

      elem.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    elem.addEventListener('mouseleave', () => {
      elem.style.transform = '';
    });
  });

  // =========================================================================
  // 6. Simulador Interactivo de Proyectos en 3 Pasos
  // =========================================================================
  const simTypeBtns = document.querySelectorAll('.sim-opt-btn');
  const simScaleSelect = document.getElementById('sim-scale');
  const simCitySelect = document.getElementById('sim-city');
  const extraCheckboxes = document.querySelectorAll('.sim-checkboxes-grid input');
  const resultSummaryTitle = document.getElementById('result-summary-title');
  const resultSummaryDetails = document.getElementById('result-summary-details');
  const btnSendSim = document.getElementById('btn-send-sim');

  let currentProject = {
    type: 'Piscina Natural de Roca',
    scale: 'Residencial Amplio / Quinta (50 a 150 m²)',
    city: 'Santa Cruz',
    extras: []
  };

  const updateSimSummary = () => {
    // Selected extras
    const extrasList = [];
    if (document.getElementById('extra-lights')?.checked) extrasList.push('Iluminación LED');
    if (document.getElementById('extra-cave')?.checked) extrasList.push('Gruta / Cueva');
    if (document.getElementById('extra-bio')?.checked) extrasList.push('Bio-filtrado');
    if (document.getElementById('extra-render')?.checked) extrasList.push('Render 3D');

    currentProject.extras = extrasList;
    currentProject.scale = simScaleSelect ? simScaleSelect.value : '';
    currentProject.city = simCitySelect ? simCitySelect.value : '';

    if (resultSummaryTitle) {
      resultSummaryTitle.textContent = `${currentProject.type}`;
    }

    if (resultSummaryDetails) {
      const extrasText = extrasList.length > 0 ? ` + ${extrasList.join(', ')}` : '';
      resultSummaryDetails.textContent = `${currentProject.scale} en ${currentProject.city}${extrasText}.`;
    }
  };

  simTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      simTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentProject.type = btn.getAttribute('data-type');
      updateSimSummary();
    });
  });

  if (simScaleSelect) simScaleSelect.addEventListener('change', updateSimSummary);
  if (simCitySelect) simCitySelect.addEventListener('change', updateSimSummary);
  extraCheckboxes.forEach(chk => chk.addEventListener('change', updateSimSummary));

  updateSimSummary();

  if (btnSendSim) {
    btnSendSim.addEventListener('click', () => {
      const whatsappNumber = '59171234567';
      const extrasFormatted = currentProject.extras.length > 0
        ? currentProject.extras.map(e => `  • ${e}`).join('%0A')
        : '  • Estándar';

      const text = `*SIMULACIÓN DE PROYECTO - ROCK ART*%0A%0A` +
        `🌿 *Espacio deseado:* ${encodeURIComponent(currentProject.type)}%0A` +
        `📏 *Escala estimada:* ${encodeURIComponent(currentProject.scale)}%0A` +
        `📍 *Ubicación:* ${encodeURIComponent(currentProject.city)}%0A` +
        `✨ *Elementos adicionales:*%0A${extrasFormatted}%0A%0A` +
        `_Hola, he configurado este proyecto en su simulador web y quisiera recibir asesoría y presupuesto estimado._`;

      window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
    });
  }

  // =========================================================================
  // 7. Galería: Filtros y Lightbox Modal
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Lightbox Modal
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxLocation = document.getElementById('lightbox-location');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxQuoteBtn = document.getElementById('lightbox-quote-btn');

  const openLightbox = (imgSrc, title, location, desc) => {
    lightboxImg.src = imgSrc;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxLocation.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${location}`;
    lightboxDesc.textContent = desc || 'Proyecto desarrollado con bio-construcción y roca artesanal por Rock Art.';
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightboxModal = () => {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightboxModal);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightboxModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal?.classList.contains('active')) {
      closeLightboxModal();
    }
  });

  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      openLightbox(
        card.getAttribute('data-img'),
        card.getAttribute('data-title'),
        card.getAttribute('data-location'),
        card.getAttribute('data-desc')
      );
    });
  });

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      openLightbox(
        item.getAttribute('data-img'),
        item.getAttribute('data-title'),
        item.getAttribute('data-location'),
        item.getAttribute('data-desc')
      );
    });
  });

  if (lightboxQuoteBtn) {
    lightboxQuoteBtn.addEventListener('click', closeLightboxModal);
  }

  // =========================================================================
  // 8. Formulario de Contacto Directo -> WhatsApp
  // =========================================================================
  const quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('client-name').value.trim();
      const phone = document.getElementById('client-phone').value.trim();
      const projectType = document.getElementById('project-type').value;
      const city = document.getElementById('project-city').value;
      const message = document.getElementById('client-message').value.trim();

      const whatsappNumber = '59171234567';

      const text = `*SOLICITUD DE ASESORÍA - ROCK ART*%0A%0A` +
        `👤 *Nombre:* ${encodeURIComponent(name)}%0A` +
        `📱 *Teléfono:* ${encodeURIComponent(phone)}%0A` +
        `📍 *Ubicación:* ${encodeURIComponent(city)}%0A` +
        `🌿 *Tipo de Proyecto:* ${encodeURIComponent(projectType)}%0A` +
        (message ? `📝 *Detalles:* ${encodeURIComponent(message)}%0A` : '') +
        `%0A_Enviado desde el sitio web oficial de Rock Art_`;

      window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
    });
  }

  // =========================================================================
  // 9. Sonido Ambiental Natural (Web Audio API - Cero Dependencias)
  // =========================================================================
  const soundToggle = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  let audioCtx = null;
  let isSoundPlaying = false;
  let noiseNode = null;
  let gainNode = null;

  const createAmbientSound = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // Generate Pink Noise (natural cascading water effect)
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.06; // comfortable gentle volume
      b6 = white * 0.115926;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to simulate soothing gentle river/waterfall cascade
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 650;

    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.5, audioCtx.currentTime + 2);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    whiteNoise.start();
    noiseNode = whiteNoise;
  };

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      if (!isSoundPlaying) {
        if (!audioCtx) {
          createAmbientSound();
        } else if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        isSoundPlaying = true;
        soundToggle.classList.add('playing');
        soundIcon.className = 'fa-solid fa-volume-high';
      } else {
        if (audioCtx) {
          audioCtx.suspend();
        }
        isSoundPlaying = false;
        soundToggle.classList.remove('playing');
        soundIcon.className = 'fa-solid fa-volume-xmark';
      }
    });
  }
});
