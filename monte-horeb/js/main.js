/**
 * Centro de Educación Inicial - Monte Horeb
 * Funcionalidad interactiva v2.0: Pestañas, Asistente Inteligente por Edad,
 * Animaciones al Scroll y Generador Directo de WhatsApp.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Menú Móvil
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
      });
    });
  }

  // 2. Pestañas Interactivas de Programas (Maternal 1-2 años vs Preescolar 3-6 años)
  const tabBtns = Array.from(document.querySelectorAll('.tab-btn'));
  const tabPanels = document.querySelectorAll('.tab-panel');

  const activateTab = (btn, moveFocus) => {
    const targetTab = btn.getAttribute('data-tab');

    // Actualizar estado activo, ARIA y orden de tabulación (roving tabindex)
    tabBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
      b.setAttribute('tabindex', '-1');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    btn.removeAttribute('tabindex');
    if (moveFocus) btn.focus();

    // Mostrar panel correspondiente y actualizar ARIA
    tabPanels.forEach(panel => {
      if (panel.id === `tab-${targetTab}`) {
        panel.classList.add('active');
        panel.removeAttribute('hidden');
      } else {
        panel.classList.remove('active');
        panel.setAttribute('hidden', '');
      }
    });
  };

  tabBtns.forEach((btn, i) => {
    if (!btn.classList.contains('active')) btn.setAttribute('tabindex', '-1');

    btn.addEventListener('click', () => activateTab(btn, false));

    // Navegación por teclado según el patrón WAI-ARIA de pestañas
    btn.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabBtns[(i + 1) % tabBtns.length];
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabBtns[(i - 1 + tabBtns.length) % tabBtns.length];
      else if (e.key === 'Home') next = tabBtns[0];
      else if (e.key === 'End') next = tabBtns[tabBtns.length - 1];
      if (next) {
        e.preventDefault();
        activateTab(next, true);
      }
    });
  });

  // 3. Asistente Inteligente por Edad en el Formulario
  const childAgeSelect = document.getElementById('childAge');
  const programInterestSelect = document.getElementById('programInterest');
  const previewBadge = document.getElementById('previewBadge');
  const previewTitle = document.getElementById('previewTitle');
  const previewDesc = document.getElementById('previewDesc');

  if (childAgeSelect && programInterestSelect) {
    childAgeSelect.addEventListener('change', () => {
      const ageVal = parseInt(childAgeSelect.value, 10);

      if (ageVal === 1 || ageVal === 2) {
        // Asignación directa a Maternal (1 a 2 años)
        programInterestSelect.value = 'Cuidados Maternales (1 a 2 años)';
        if (previewBadge) previewBadge.textContent = 'Recomendado: Maternal (1 a 2 años)';
        if (previewTitle) previewTitle.textContent = '👶 Cuidados Maternales y Estimulación Temprana';
        if (previewDesc) previewDesc.textContent = 'Enfoque prioritario: Desarrollo sensorial, primeros pasos en lenguaje, control de esfínteres asistido, nutrición saludable y amor continuo.';
      } else if (ageVal >= 3 && ageVal <= 6) {
        // Asignación directa a Educación Inicial (3 a 6 años)
        programInterestSelect.value = 'Educación Inicial (3 a 6 años)';
        let subNivel = ageVal === 3 ? 'Preescolar I (3 años)' : (ageVal === 4 ? 'Preescolar II (4 años)' : 'Preescolar III / Preparatoria (5-6 años)');
        if (previewBadge) previewBadge.textContent = `Recomendado: ${subNivel}`;
        if (previewTitle) previewTitle.textContent = '🎒 Educación Inicial y Apresto Escolar';
        if (previewDesc) previewDesc.textContent = 'Enfoque prioritario: Iniciación a la lectura y escritura, lógica matemática, valores morales, autonomía y preparación óptima para primer grado.';
      }
    });
  }

  // 4. Generador de Mensaje y Envío a WhatsApp
  const leadForm = document.getElementById('leadForm');

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const parentName = document.getElementById('parentName')?.value.trim() || '';
      const childName = document.getElementById('childName')?.value.trim() || '';
      const childAge = document.getElementById('childAge')?.value || '';
      const programInterest = document.getElementById('programInterest')?.value || 'Educación Inicial';
      const preferredTime = document.getElementById('preferredTime')?.value || 'Mañana';
      const customNotes = document.getElementById('customNotes')?.value.trim() || '';

      // Construcción del mensaje personalizado
      let message = `¡Hola, Centro de Educación Inicial Monte Horeb! 👋\n\n`;
      message += `Mi nombre es *${parentName}* y me comunico para solicitar información de inscripciones.\n`;
      if (childName) {
        message += `👶 *Nombre del niño(a):* ${childName}\n`;
      }
      message += `🎂 *Edad:* ${childAge} ${parseInt(childAge) === 1 ? 'año' : 'años'}\n`;
      message += `🎒 *Nivel correspondiente:* ${programInterest}\n`;
      message += `⏰ *Turno preferido:* ${preferredTime}\n`;
      
      if (customNotes) {
        message += `💬 *Consulta particular:* ${customNotes}\n`;
      }
      
      message += `\n¿Podrían indicarme aranceles, cupos disponibles y coordinar una visita para conocer las instalaciones? ¡Muchas gracias!`;

      // Número WhatsApp del centro Monte Horeb
      const phone = '584242698583';
      const encodedMsg = encodeURIComponent(message);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMsg}`;

      // Abrir WhatsApp en pestaña nueva
      window.open(whatsappUrl, '_blank');
    });
  }

  // 5. Acordeón de Preguntas Frecuentes (FAQ)
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerDiv = item.querySelector('.faq-answer');

    if (questionBtn && answerDiv) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Cerrar otros acordeones abiertos
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherBtn = otherItem.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Alternar el actual
        if (isActive) {
          item.classList.remove('active');
          questionBtn.setAttribute('aria-expanded', 'false');
          answerDiv.style.maxHeight = null;
        } else {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
          answerDiv.style.maxHeight = answerDiv.scrollHeight + 'px';
        }
      });
    }
  });

  // 6. Animaciones al Hacer Scroll (IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback si el navegador no tiene soporte de observer
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // 7. Sombra dinámica en la barra de navegación al hacer scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.style.boxShadow = '0 4px 20px rgba(36, 54, 78, 0.08)';
    } else {
      navbar.style.boxShadow = 'var(--shadow-sm)';
    }
  });

  // 8. Año actual automático en el footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
