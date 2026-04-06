import './style.css'
import Lenis from 'lenis'

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mouse Glow Tracker
  const glow = document.getElementById('mouse-glow');
  if (glow) {
    document.addEventListener('mousemove', (e) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    });
    document.addEventListener('mouseenter', () => glow.style.opacity = '1');
    document.addEventListener('mouseleave', () => glow.style.opacity = '0');
  }

  // 1.2 Premium Scroll Logic (Lenis)
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    wheelMultiplier: 1,
    smoothTouch: false, // Better native feel on mobile
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Scroll Progress & Navbar State
  const progressBar = document.getElementById('scroll-progress');
  const navbar = document.getElementById('navbar');
  const navLinksList = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
    // 1. Update Progress Bar
    if (progressBar) {
      progressBar.style.transform = `scaleX(${progress})`;
    }

    // 2. Navbar Stuck State
    if (navbar) {
      if (scroll > 50) {
        navbar.classList.add('stuck');
      } else {
        navbar.classList.remove('stuck');
      }
    }

    // 3. Active Link Highlighting (Top Navbar & Dock)
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scroll >= sectionTop - 250) {
        current = section.getAttribute('id');
      }
    });

    const dockItems = document.querySelectorAll('.dock-item');
    
    // Highlight Mobile Nav Links
    navLinksList.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current) && current !== '') {
        link.classList.add('active');
      }
    });

    // Highlight Desktop Dock Items
    dockItems.forEach((item) => {
      item.classList.remove('active');
      const href = item.getAttribute('href');
      
      if (current === '' && item.getAttribute('data-section') === 'hero') {
        item.classList.add('active');
      } else if (href && href.includes(current) && current !== '') {
        item.classList.add('active');
      }
    });
  });

  // Handle anchor link clicks with Lenis (Applies to all links including dock)
  document.querySelectorAll('a[href^="#"], .dock-item').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId.startsWith('javascript')) return;

      e.preventDefault();
      
      if (targetId === '#' || this.getAttribute('data-section') === 'hero') {
        lenis.scrollTo(0);
      } else {
        lenis.scrollTo(targetId, { offset: -20 });
      }
    });
  });

  // 1.5 Mobile Menu Toggle
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if(menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuBtn.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuBtn.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // 2. Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll(
    '.reveal-slide-up, .reveal-slide-left, .reveal-scale, .reveal-fade'
  );

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        // Optional: stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
  
  // Trigger initial reveal for elements instantly in viewport (hero)
  setTimeout(() => {
    document.querySelectorAll('.hero-dashboard [class*="reveal-"]').forEach(el => {
      el.classList.add('is-revealed');
    });
  }, 100);

  // 3. Simple SVG Line Drawing function to connect nodes to cards
  const drawLines = () => {
    const pt1 = document.querySelector('.pt-1');
    const pt2 = document.querySelector('.pt-2');
    const card1 = document.querySelector('.top-card');
    const card2 = document.querySelector('.bot-card');
    const svgArea = document.querySelector('.connection-lines');
    
    // Safety check - on mobile cards might be hidden
    if (!pt1 || !card1 || window.innerWidth < 992) {
      if(svgArea) svgArea.innerHTML = '';
      return; 
    }

    const rect1 = pt1.getBoundingClientRect();
    const rect2 = pt2.getBoundingClientRect();
    const c1 = card1.getBoundingClientRect();
    const c2 = card2.getBoundingClientRect();

    // Coordinates relative to bounding viewport since SVG is fixed/absolute 100%
    const startX1 = rect1.left + rect1.width/2;
    const startY1 = rect1.top + rect1.height/2;
    const endX1 = c1.left;
    const endY1 = c1.top + c1.height/2;

    const startX2 = rect2.left + rect2.width/2;
    const startY2 = rect2.top + rect2.height/2;
    const endX2 = c2.left;
    const endY2 = c2.top + c2.height/2;

    const svgHtml = `
      <polyline points="${startX1},${startY1} ${endX1 - 20},${startY1} ${endX1},${endY1}" 
        fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
      <circle cx="${startX1}" cy="${startY1}" r="3" fill="#fff" />
      <circle cx="${endX1}" cy="${endY1}" r="3" fill="rgba(255,255,255,0.5)" />
      
      <polyline points="${startX2},${startY2} ${startX2 + 40},${startY2} ${endX2},${endY2}" 
        fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
      <circle cx="${startX2}" cy="${startY2}" r="3" fill="#fff" />
      <circle cx="${endX2}" cy="${endY2}" r="3" fill="rgba(255,255,255,0.5)" />
    `;

    svgArea.innerHTML = svgHtml;
  };

  // Draw lines on load and resize
  window.addEventListener('load', drawLines);
  window.addEventListener('resize', () => {
    requestAnimationFrame(drawLines);
  });

  // 4. Portfolio Modal & Load More Logic
  const projectsData = {
    oakdesign: {
      title: "Oakdesign Door – Komplett Varumärkesresa",
      category: "E-handel & Snickeri",
      desc: "Vi hjälpte Oakdesign Door med allt från deras nya logotyp till en skräddarsydd hemsida. Vi skapade en design som känns lika rejäl och exklusiv som deras egna dörrar, och såg till att den fungerar på flera språk. Hemsidan är byggd för att vara enkel att använda för kunderna och vi tar hand om allt det tekniska så att de kan lägga sin tid på hantverket istället.",
      tech: ["Logotypdesign", "Webbutveckling", "UI/UX Design", "Flerspråkig"],
      link: "#",
      images: [
        "/projects/oakdesigndoor/images/aokdoordesign.png",
        "/assets/oakdesign/hero.png",
        "/assets/oakdesign/products.png",
        "/assets/oakdesign/staff.png"
      ]
    },
    centrumlack: {
      title: "Centrum Lack – Professionell Billackering",
      category: "Företagswebb",
      desc: "För Centrum Lack, en expert inom billackering med över 35 års erfarenhet, byggde vi en modern och snygg hemsida som lyfter fram deras hantverk. Vi fokuserade på att göra det så enkelt som möjligt för kunderna att se deras expertis och boka tid. Idag ser vi till att de syns högt upp på Google och att hemsidan alltid rullar på som den ska.",
      tech: ["Webbutveckling", "SEO", "Branding"],
      link: "#",
      images: [
        "/assets/logga1.png",
        "/assets/centrumlack/hero.png",
        "/assets/centrumlack/services.png",
        "/assets/centrumlack/contact.png"
      ]
    },
    avtalsvaggen: {
      title: "SaaS-plattform för Avtalsväggen",
      category: "SaaS & Tjänst",
      desc: "Vi fick i uppdrag att bygga Avtalsväggen – en modern SaaS-tjänst! Huvudfokus var att utveckla en avancerad AI-plattform som automatiskt tar fram skräddarsydda dokument när användaren fyller i ett formulär. Systemet säkerställer att alla avtal strikt följer Sveriges lagar och juridiska regelverk. Vi ansvarade för hela processen från UX/UI-design till AI-integration och backend-utveckling. Idag fungerar vi som deras långsiktiga tekniska partner, där vi kontinuerligt underhåller plattformen och utvecklar nya funktioner utifrån kundens löpande önskemål.",
      tech: ["SaaS", "Systemutveckling", "UX/UI Design"],
      link: "#",
      images: [
        "/assets/avtalsvaggen/avtalsvaggen_1.png",
        "/assets/avtalsvaggen/avtalsvaggen_2.png",
        "/assets/avtalsvaggen/avtalsvaggen_3.png",
        "/assets/avtalsvaggen/avtalsvaggen_4.png"
      ]
    },
    arkiv1: {
      title: "Boutique Hotel",
      category: "Bokningssystem",
      desc: "Ett tidigare arkivprojekt. Vi byggde en premiumupplevelse för ett exklusivt boutiquehotell med integrerad bokningsmotor.",
      tech: ["Vue", "Tailwind", "API"],
      link: "#",
      images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"]
    },
    arkiv2: {
      title: "FinTech Dashboard",
      category: "Webbapplikation",
      desc: "Säker plattform för visualisering av finansiell data i realtid. Fokus på snabbhet och data-säkerhet.",
      tech: ["React", "D3.js", "Node"],
      link: "#",
      images: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"]
    },
    arkiv3: {
      title: "Retailer Portal",
      category: "B2B E-handel",
      desc: "Sluten portal för återförsäljare att lägga bulk-ordrar och hantera sina avtal.",
      tech: ["Next.js", "Prisma", "PostgreSQL"],
      link: "#",
      images: ["https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop"]
    }
  };

  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('close-modal');
  const portGrid = document.querySelector('.port-grid');
  const loadMoreBtn = document.getElementById('load-more-btn');

  const mTitle = document.getElementById('modal-title');
  const mCat = document.getElementById('modal-category');
  const mDesc = document.getElementById('modal-desc');
  const mTech = document.getElementById('modal-tech');
  const mMainImg = document.getElementById('modal-main-img');
  const mThumbs = document.getElementById('modal-thumbnails');

  const openProjectModal = (pKey) => {
    const data = projectsData[pKey];
    if(!data) return;

    mTitle.textContent = data.title;
    mCat.textContent = data.category;
    mDesc.textContent = data.desc;
    
    mTech.innerHTML = '';
    data.tech.forEach(t => {
      mTech.innerHTML += `<span class="tech-item">${t}</span>`;
    });

    mMainImg.src = data.images[0];
    mMainImg.style.objectFit = 'contain';
    mMainImg.style.padding = '3rem';
    mMainImg.style.background = '#030407';
    mMainImg.onerror = () => { mMainImg.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'; };

    mThumbs.innerHTML = '';
    data.images.forEach((imgSrc, index) => {
      const thumb = document.createElement('img');
      thumb.src = imgSrc;
      thumb.onerror = () => { thumb.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop'; };
      thumb.className = index === 0 ? 'thumb-img active' : 'thumb-img';
      
      thumb.addEventListener('click', () => {
         mMainImg.src = thumb.src;
         document.querySelectorAll('.thumb-img').forEach(t => t.classList.remove('active'));
         thumb.classList.add('active');
         
         if (index === 0) {
           mMainImg.style.objectFit = 'contain';
           mMainImg.style.padding = '3rem';
           mMainImg.style.background = '#030407';
         } else {
           mMainImg.style.objectFit = 'cover';
           mMainImg.style.padding = '0';
           mMainImg.style.background = 'transparent';
         }
      });
      mThumbs.appendChild(thumb);
    });

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; 
  };

  // Event Delegation for portfolio cards
  if(portGrid) {
    portGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.port-card');
      if(card) {
        openProjectModal(card.getAttribute('data-project'));
      }
    });
  }

  // Close Modal
  if(closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    });
  }

  // TEAM MODAL LOGIC
  const teamData = {
    mattias: {
      name: "Mattias Ohsol",
      role: "Grundare & Webbdesigner",
      desc: "Mattias är hjärnan bakom designen och strategin. Med sin bakgrund inom webb och grafisk produktion ser han till att allting är pixelperfekt. Ring honom om du har idéer eller strategiska frågor om ert projekt.",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=500&auto=format&fit=crop",
      email: "mattias@digisoulmedia.se",
      phone: "070-123 45 67",
      linkedin: "https://linkedin.com/in/mattiass"
    },
    oliver: {
      name: "Oliver Lindblad",
      role: "Lead Developer",
      desc: "Oliver är vår tekniska arkitekt. Han bygger robusta och skalbara lösningar från grunden och ser till att prestandan alltid är i toppklass. Han älskar att optimera kod och lösa komplexa backend-utmaningar.",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=500&auto=format&fit=crop",
      email: "oliver@digisoulmedia.se",
      phone: "070-234 56 78",
      linkedin: "https://linkedin.com/in/oliverlindblad"
    },
    robin: {
      name: "Robin Prodam",
      role: "UX/UI Designer",
      desc: "Robin är vår visionär inom användarvänlighet. Han skapar intuitiva gränssnitt som inte bara ser fantastiska ut utan också förbättrar kundresan. Med ett öga för detaljer ser han till att varje pixel har ett syfte.",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&h=500&auto=format&fit=crop",
      email: "robin@digisoulmedia.se",
      phone: "070-345 67 89",
      linkedin: "https://linkedin.com/in/robinprodam"
    }
  };

  const teamModal = document.getElementById('team-modal');
  const closeTeamModalBtn = document.getElementById('close-team-modal');
  
  const tmImg = document.getElementById('tm-img');
  const tmName = document.getElementById('tm-name');
  const tmRole = document.getElementById('tm-role');
  const tmDesc = document.getElementById('tm-desc');
  const tmEmail = document.getElementById('tm-email');
  const tmPhone = document.getElementById('tm-phone');
  const tmLinkedin = document.getElementById('tm-linkedin');

  document.querySelectorAll('.interactive-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if(e.target.tagName.toLowerCase() === 'a') return; // Ignore link clicks
      
      const memberId = card.getAttribute('data-member');
      const info = teamData[memberId];
      if(!info) return;

      tmImg.src = info.img;
      tmName.textContent = info.name;
      tmRole.textContent = info.role;
      tmDesc.textContent = info.desc;
      tmEmail.href = `mailto:${info.email}`;
      tmPhone.href = `tel:${info.phone.replace(/[\s-]/g, '')}`;
      tmLinkedin.href = info.linkedin;

      teamModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  if(closeTeamModalBtn) {
    closeTeamModalBtn.addEventListener('click', () => {
      teamModal.classList.add('hidden');
      document.body.style.overflow = '';
    });
  }

  // Load More Button
  let isExpanded = false;
  if(loadMoreBtn && portGrid) {
    loadMoreBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      
      if (isExpanded) {
        // Expand
        const archiveKeys = ['arkiv1', 'arkiv2', 'arkiv3'];
        
        archiveKeys.forEach((key, index) => {
          const data = projectsData[key];
          const delay = index + 1;
          const html = `
            <div class="port-card extra-project reveal-slide-up is-revealed delay-${delay}" style="opacity:0; transform:translateY(20px); animation: fadeUpIn 0.6s ease forwards ${index * 0.15}s;" data-project="${key}">
              <div class="port-img-wrapper">
                <img src="${data.images[0]}" alt="${data.title}">
                <div class="port-overlay">
                  <span class="pill-btn small-btn">Visa Arkiv →</span>
                </div>
              </div>
              <div class="port-info">
                <h3>${data.title}</h3>
                <p>${data.category}</p>
              </div>
            </div>
          `;
          portGrid.insertAdjacentHTML('beforeend', html);
        });
        
        loadMoreBtn.innerHTML = 'Visa Färre Projekt <span>-</span>';
      } else {
        // Collapse
        const extraProjects = document.querySelectorAll('.extra-project');
        extraProjects.forEach(extra => extra.remove());
        
        loadMoreBtn.innerHTML = 'Visa Fler Projekt <span>+</span>';
        
        // Scroll back to portfolio section to avoid being lost
        const portfolioSection = document.getElementById('portfolio');
        if (portfolioSection) {
          lenis.scrollTo(portfolioSection, { offset: -50 });
        }
      }
      
      // Inline styles used for rapid animation of new dom nodes
      if(!document.getElementById('dyn-anim')) {
         document.head.insertAdjacentHTML('beforeend', `<style id="dyn-anim">@keyframes fadeUpIn { to { opacity: 1; transform: translateY(0); } }</style>`);
      }
    });
  }

  console.log('DigisoulMedia Premium Dashboard Initialized');
});
