import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  
  // Sticky nav background transition
  const nav = document.querySelector('.nav-pill');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // Mobile Menu Toggle
  const mobileBtn = document.querySelector('.nav-mobile-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-up').forEach(el => {
    observer.observe(el);
  });

  // Contact Form Pill Toggles
  const formPills = document.querySelectorAll('.pill-input');
  formPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      const siblings = e.target.closest('.pill-options').querySelectorAll('.pill-input');
      siblings.forEach(s => s.classList.remove('active'));
      e.target.classList.add('active');
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Portfolio Project Data
  const projectsData = {
    centrumlack: {
      title: "Centrum Lack",
      badge: "Bas",
      category: "Professionell Fordonslackering",
      desc: "För Centrum Lack, en expert inom billackering med över 35 års erfarenhet, byggde vi en modern och snygg hemsida som lyfter fram deras hantverk. Vi fokuserade på att göra det så enkelt som möjligt för kunderna att se deras expertis och boka tid. Idag ser vi till att de syns högt upp på Google och att hemsidan alltid rullar på som den ska.",
      tech: ["Webbutveckling", "SEO", "Branding"],
      images: [
        "/port-centrum-logo.png",
        "/port-centrum-hero.png",
        "/port-centrum-services.png",
        "/port-centrum-contact.png"
      ]
    },
    oakdesign: {
      title: "Oak Design Door",
      badge: "Mellan",
      category: "Premiumsnickeri & Webbnärvaro",
      desc: "Vi hjälpte Oakdesign Door med allt från deras nya logotyp till en skräddarsydd hemsida. Vi skapade en design som känns lika rejäl och exklusiv som deras egna dörrar, och såg till att den fungerar på flera språk. Hemsidan är byggd för att vara enkel att använda för kunderna och vi tar hand om allt det tekniska så att de kan lägga sin tid på hantverket istället.",
      tech: ["Logotypdesign", "Webbutveckling", "UI/UX Design", "Flerspråkig"],
      images: [
        "/port-oak-logo.png",
        "/port-oak-hero.png",
        "/port-oak-products.png",
        "/port-oak-staff.png"
      ]
    },
    avtalsvaggen: {
      title: "Avtalsväggen",
      badge: "Premium",
      category: "SaaS-plattform för juridik",
      desc: "Vi fick i uppdrag att bygga Avtalsväggen – en modern SaaS-tjänst! Huvudfokus var att utveckla en avancerad AI-plattform som automatiskt tar fram skräddarsydda dokument när användaren fyller i ett formulär. Systemet säkerställer att alla avtal strikt följer Sveriges lagar och juridiska regelverk. Vi ansvarade för hela processen från UX/UI-design till AI-integration och backend-utveckling.",
      tech: ["SaaS", "Systemutveckling", "UX/UI Design", "AI Integration"],
      images: ["/port-avtals.png", "/port-avtals-2.png", "/port-avtals-3.png", "/port-avtals-4.png"]
    }
  };

  // Modal logic
  const modal = document.getElementById('project-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalBadge = document.getElementById('modal-badge');
  const modalCat = document.getElementById('modal-cat');
  const modalDesc = document.getElementById('modal-desc');
  const modalTechList = document.getElementById('modal-tech-list');
  const modalGallery = document.getElementById('modal-gallery');
  const closeBtn = document.getElementById('close-modal');

  const openModal = (projectId) => {
    const data = projectsData[projectId];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalBadge.textContent = data.badge;
    modalCat.textContent = data.category;
    modalDesc.textContent = data.desc;
    modalImg.src = data.images[0];

    // Tech tags
    modalTechList.innerHTML = '';
    data.tech.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'tech-tag';
      span.textContent = tag;
      modalTechList.appendChild(span);
    });

    // Gallery / Thumbs
    modalGallery.innerHTML = '';
    if (data.images.length > 1) {
      data.images.forEach((img, index) => {
        const thumb = document.createElement('img');
        thumb.src = img;
        thumb.className = `modal-thumb ${index === 0 ? 'active' : ''}`;
        thumb.addEventListener('click', () => {
          modalImg.src = img;
          document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        });
        modalGallery.appendChild(thumb);
      });
      modalGallery.style.display = 'flex';
    } else {
      modalGallery.style.display = 'none';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Portfolio card click
  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project');
      openModal(projectId);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  
  // Close on backdrop click
  const backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Cookie Consent Logic
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieSettingsBtn = document.getElementById('cookie-settings');
  const hasConsented = localStorage.getItem('cookie-consent');

  // Settings Modal Elements
  const settingsModal = document.getElementById('cookie-settings-modal');
  const closeSettingsBtn = document.getElementById('close-cookie-settings');
  const saveChoicesBtn = document.getElementById('cookie-save-choices');
  const acceptAllModalBtn = document.getElementById('cookie-accept-modal');
  const analyticsToggle = document.getElementById('cookie-opt-analytics');
  const marketingToggle = document.getElementById('cookie-opt-marketing');

  if (!hasConsented && cookieBanner) {
    setTimeout(() => {
      cookieBanner.classList.remove('display-none');
      cookieBanner.offsetHeight;
      cookieBanner.classList.add('active');
    }, 2000);
  }

  const hideBanner = () => {
    cookieBanner.classList.remove('active');
    setTimeout(() => {
      cookieBanner.classList.add('display-none');
    }, 600);
  };

  const saveConsent = (preferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    hideBanner();
    if (settingsModal) settingsModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      saveConsent({ necessary: true, analytics: true, marketing: true });
    });
  }

  if (cookieSettingsBtn) {
    cookieSettingsBtn.addEventListener('click', () => {
      settingsModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener('click', () => {
      settingsModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (saveChoicesBtn) {
    saveChoicesBtn.addEventListener('click', () => {
      saveConsent({
        necessary: true,
        analytics: analyticsToggle.checked,
        marketing: marketingToggle.checked
      });
    });
  }

  if (acceptAllModalBtn) {
    acceptAllModalBtn.addEventListener('click', () => {
      saveConsent({ necessary: true, analytics: true, marketing: true });
    });
  }

  // Close settings on backdrop click
  const settingsBackdrop = document.getElementById('cookie-settings-backdrop');
  if (settingsBackdrop) {
    settingsBackdrop.addEventListener('click', () => {
      settingsModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Reopen Cookie Settings Button
  const reopenBtn = document.getElementById('cookie-reopen-btn');
  if (reopenBtn && settingsModal) {
    reopenBtn.addEventListener('click', () => {
      settingsModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

});
