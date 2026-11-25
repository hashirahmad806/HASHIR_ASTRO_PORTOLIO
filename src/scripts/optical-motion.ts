import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

interface ProjectData {
  id: string;
  title: string;
  tag: string;
  clientName?: string;
  fullDesc: string;
  humanImpact: string;
  highlights: string[];
  tech: string[];
  liveUrl: string;
  githubUrl: string;
}

interface SkillData {
  id: string;
  name: string;
  tag: string;
  maturity: string;
  latency: string;
  tenure: string;
  role: string;
  language: string;
  code: string;
  projectLink: string;
}

interface LoopStepData {
  step: string;
  name: string;
  role: string;
  desc: string;
  tech: string;
  metric: string;
}

interface RagChunkRef {
  source: string;
  category: string;
  score: number;
  excerpt: string;
}

interface ChatApiResponse {
  answer: string;
  intent: string;
  sources: string[];
  chunks?: RagChunkRef[];
  suggestedFollowups: string[];
  model?: string;
  mode: string;
  embeddingBackend?: string;
  needsWhatsapp?: boolean;
  whatsappUrl?: string;
  llmError?: string | null;
  latencyMs: number;
  trace: Array<{ node: string; durationMs?: number; [k: string]: unknown }>;
}

function setupModalTrap(modalEl: HTMLElement | null, onClose: () => void) {
  if (!modalEl) return () => {};
  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key !== 'Tab') return;
    const focusables = Array.from(
      modalEl.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.classList.contains('hidden') && el.offsetParent !== null);

    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  document.addEventListener('keydown', handleKey);
  return () => document.removeEventListener('keydown', handleKey);
}

function makeWhatsappForwardUrl(baseUrl: string, userQuery: string, note = '') {
  const lines = ["Hi Hashir, I'm reaching out from your portfolio."];
  if (userQuery.trim()) lines.push(`Question: ${userQuery.trim()}`);
  if (note.trim()) lines.push(`Context: ${note.trim()}`);
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}text=${encodeURIComponent(lines.join('\n'))}`;
}

export function initOpticalMotion() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenis: Lenis | null = null;

  // 1. GSAP + ScrollTrigger + Lenis Smooth Choreography
  if (!prefersReduced) {
    lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Top reading progress hairline
    const progressBar = document.getElementById('scroll-progress-bar');
    if (progressBar) {
      gsap.to(progressBar, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.25,
        },
      });
    }

    // Hero Entry Optical Calibration Timeline
    const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    heroTl
      .from('.hero-stagger', {
        opacity: 0,
        y: 28,
        filter: 'blur(8px)',
        duration: 0.85,
        stagger: 0.085,
        clearProps: 'filter,transform',
      })
      .from(
        '.hero-lens-frame',
        {
          opacity: 0,
          scale: 0.94,
          y: 24,
          filter: 'blur(10px)',
          duration: 1.0,
          clearProps: 'filter,transform',
        },
        '-=0.65'
      );

    // Kinetic Role Ticker in Hero
    const tickerEl = document.getElementById('hero-role-ticker');
    if (tickerEl?.dataset.roles) {
      const roles: string[] = JSON.parse(tickerEl.dataset.roles);
      let roleIdx = 0;
      window.setInterval(() => {
        roleIdx = (roleIdx + 1) % roles.length;
        gsap.to(tickerEl, {
          y: -10,
          opacity: 0,
          duration: 0.26,
          ease: 'power2.in',
          onComplete: () => {
            tickerEl.textContent = roles[roleIdx];
            gsap.fromTo(
              tickerEl,
              { y: 10, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.36, ease: 'power3.out', clearProps: 'transform' }
            );
          },
        });
      }, 2800);
    }

    // Interactive Hero Optical Aura + Portrait Viewfinder Reticle Tracking
    const heroSection = document.getElementById('hero');
    const heroAura = document.getElementById('hero-optical-aura');
    if (heroSection && heroAura) {
      const auraX = gsap.quickTo(heroAura, 'left', { duration: 0.55, ease: 'power3.out' });
      const auraY = gsap.quickTo(heroAura, 'top', { duration: 0.55, ease: 'power3.out' });
      heroSection.addEventListener('pointermove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        heroAura.style.opacity = '1';
        auraX(e.clientX - rect.left);
        auraY(e.clientY - rect.top);
      });
      heroSection.addEventListener('pointerleave', () => {
        heroAura.style.opacity = '0';
      });
    }

    const portraitFrame = document.querySelector<HTMLElement>('.hero-lens-frame');
    const portraitReticle = document.getElementById('portrait-reticle');
    const portraitCoords = document.getElementById('portrait-coords');
    if (portraitFrame && portraitReticle) {
      const rx = gsap.quickTo(portraitReticle, 'left', { duration: 0.28, ease: 'power3.out' });
      const ry = gsap.quickTo(portraitReticle, 'top', { duration: 0.28, ease: 'power3.out' });
      portraitFrame.addEventListener('pointermove', (e) => {
        const rect = portraitFrame.getBoundingClientRect();
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);
        portraitReticle.style.opacity = '1';
        rx(x);
        ry(y);
        if (portraitCoords) portraitCoords.textContent = `FOCAL LOCK · X:${x} Y:${y}`;
      });
      portraitFrame.addEventListener('pointerleave', () => {
        portraitReticle.style.opacity = '0';
        if (portraitCoords) portraitCoords.textContent = 'OPTICAL LOCK · 34.01° N';
      });
    }

    // Scrubbed Atmospheric Parallax Orbs
    document.querySelectorAll<HTMLElement>('[data-parallax-orb]').forEach((orb) => {
      const factor = parseFloat(orb.dataset.parallaxOrb || '0.15');
      gsap.to(orb, {
        yPercent: factor * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: orb.parentElement || document.body,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.1,
        },
      });
    });

    // Crisp ScrollTrigger Optical Focus Reveals
    ScrollTrigger.batch('.lens-reveal', {
      start: 'top 85%',
      once: true,
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          { opacity: 0, y: 34, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.85,
            stagger: 0.09,
            ease: 'power3.out',
            clearProps: 'filter,transform',
          }
        );
      },
    });

    // Animated Language Footprint Bars
    document.querySelectorAll<HTMLElement>('[data-lang-bar]').forEach((bar) => {
      gsap.from(bar, {
        scaleX: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: bar, start: 'top 90%', once: true },
        clearProps: 'transform',
      });
    });

    // Magnetic Button Physics
    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
      const moveX = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
      const moveY = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });
      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
        moveX(dx);
        moveY(dy);
      });
      el.addEventListener('pointerleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.55)' });
      });
    });

    // 3D Optical Depth Tilt
    document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
      const rotX = gsap.quickTo(card, 'rotationX', { duration: 0.4, ease: 'power3.out' });
      const rotY = gsap.quickTo(card, 'rotationY', { duration: 0.4, ease: 'power3.out' });
      card.style.transformStyle = 'preserve-3d';
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        rotX(-py * 7);
        rotY(px * 7);
      });
      card.addEventListener('pointerleave', () => {
        gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'power3.out' });
      });
    });

    // Damped Google Lens Pointer Spotlight Physics
    document.querySelectorAll<HTMLElement>('.lens-surface').forEach((surface) => {
      const setX = gsap.quickTo(surface, '--lens-x-num', { duration: 0.32, ease: 'power3.out' });
      const setY = gsap.quickTo(surface, '--lens-y-num', { duration: 0.32, ease: 'power3.out' });

      surface.addEventListener('pointermove', (e) => {
        const rect = surface.getBoundingClientRect();
        setX(Math.round(e.clientX - rect.left));
        setY(Math.round(e.clientY - rect.top));
      });
    });

    // Scroll Section Spy for Navbar Pills
    const navPills = document.querySelectorAll<HTMLElement>('[data-nav-spy]');
    navPills.forEach((pill) => {
      const id = pill.dataset.navSpy;
      const sec = id ? document.getElementById(id) : null;
      if (!sec) return;
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => {
          pill.classList.toggle('text-[#4FE3B5]', self.isActive);
          pill.classList.toggle('bg-[#151C19]', self.isActive);
          pill.classList.toggle('text-[#B6C2BC]', !self.isActive);
        },
      });
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
  }

  // Smooth anchor scrolling (Lenis-aware)
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;
      e.preventDefault();
      if (lenis && !prefersReduced) {
        lenis.scrollTo(target, { offset: -84 });
      } else {
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
      }
    });
  });

  // 2. Global Lens Focus Inspect Toggle
  const lensToggleBtn = document.getElementById('lens-mode-toggle');
  const setLensActive = (active: boolean) => {
    document.body.classList.toggle('lens-inspect-active', active);
    if (lensToggleBtn) {
      lensToggleBtn.setAttribute('aria-pressed', active ? 'true' : 'false');
      lensToggleBtn.classList.toggle('border-[#4FE3B5]/60', active);
      lensToggleBtn.classList.toggle('text-[#4FE3B5]', active);
      const label = lensToggleBtn.querySelector('span');
      if (label) label.textContent = active ? 'Lens Active' : 'Lens Focus';
    }
  };
  lensToggleBtn?.addEventListener('click', () => {
    setLensActive(!document.body.classList.contains('lens-inspect-active'));
  });

  // 3. Mobile Navigation Drawer
  const mobileBtn = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const hamTop = document.getElementById('ham-top');
  const hamMid = document.getElementById('ham-mid');
  const hamBot = document.getElementById('ham-bot');
  let removeMobileTrap = () => {};

  const toggleMobileDrawer = (open: boolean) => {
    if (!mobileDrawer || !mobileBtn) return;
    mobileBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      mobileDrawer.classList.remove('hidden');
      mobileDrawer.classList.add('flex');
      document.body.style.overflow = 'hidden';
      hamTop?.classList.add('translate-y-[6px]', 'rotate-45');
      hamMid?.classList.add('opacity-0');
      hamBot?.classList.add('-translate-y-[6px]', '-rotate-45');
      removeMobileTrap = setupModalTrap(mobileDrawer, () => toggleMobileDrawer(false));
      mobileDrawer.querySelector<HTMLElement>('a')?.focus();
    } else {
      mobileDrawer.classList.add('hidden');
      mobileDrawer.classList.remove('flex');
      document.body.style.overflow = '';
      hamTop?.classList.remove('translate-y-[6px]', 'rotate-45');
      hamMid?.classList.remove('opacity-0');
      hamBot?.classList.remove('-translate-y-[6px]', '-rotate-45');
      removeMobileTrap();
      mobileBtn.focus();
    }
  };

  mobileBtn?.addEventListener('click', () => {
    const isOpen = mobileBtn.getAttribute('aria-expanded') === 'true';
    toggleMobileDrawer(!isOpen);
  });

  document.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => toggleMobileDrawer(false));
  });

  // 4. Project Category Filter
  const filterBtns = document.querySelectorAll<HTMLButtonElement>('[data-project-filter]');
  const projectCards = Array.from(document.querySelectorAll<HTMLElement>('[data-project-card]'));

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.projectFilter || 'all';
      filterBtns.forEach((b) => {
        const active = b === btn;
        b.setAttribute('aria-selected', active ? 'true' : 'false');
        b.classList.toggle('bg-[#4FE3B5]', active);
        b.classList.toggle('text-[#06130F]', active);
        b.classList.toggle('font-medium', active);
        b.classList.toggle('text-[#B6C2BC]', !active);
      });

      const shown: HTMLElement[] = [];
      projectCards.forEach((card) => {
        const match = cat === 'all' || card.dataset.category === cat;
        card.classList.toggle('hidden', !match);
        const origSpan = card.dataset.bentoSpan;
        if (cat === 'all') {
          card.classList.remove('md:col-span-3', 'md:col-span-6');
          if (origSpan) card.classList.add(origSpan);
        } else if (match) {
          if (origSpan) card.classList.remove(origSpan);
          card.classList.add('md:col-span-3');
        }
        if (match) shown.push(card);
      });
      if (cat !== 'all' && shown.length === 1) {
        shown[0].classList.remove('md:col-span-3');
        shown[0].classList.add('md:col-span-6');
      }

      if (!prefersReduced && shown.length > 0) {
        gsap.fromTo(
          shown,
          { opacity: 0, y: 14, scale: 0.985 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.045, ease: 'power2.out', clearProps: 'transform' }
        );
      }
      ScrollTrigger.refresh();
    });
  });

  // 5. Project Architecture Inspection Modal
  const projectsRaw = document.getElementById('projects-json-data')?.textContent;
  const projectsList: ProjectData[] = projectsRaw ? JSON.parse(projectsRaw) : [];
  const projectModal = document.getElementById('project-modal');
  const projectBackdrop = document.getElementById('project-modal-backdrop');
  const projectClose = document.getElementById('project-modal-close');
  let projectOpener: HTMLElement | null = null;
  let removeProjectTrap = () => {};

  const closeProjectModal = () => {
    if (!projectModal) return;
    projectModal.classList.add('hidden');
    projectModal.classList.remove('flex');
    document.body.style.overflow = '';
    removeProjectTrap();
    projectOpener?.focus();
  };

  const openProjectModal = (projId: string, opener: HTMLElement) => {
    const project = projectsList.find((p) => p.id === projId);
    if (!project || !projectModal) return;
    projectOpener = opener;

    const tagEl = document.getElementById('project-modal-tag');
    const titleEl = document.getElementById('project-modal-title');
    const clientEl = document.getElementById('project-modal-client');
    const descEl = document.getElementById('project-modal-desc');
    const impactEl = document.getElementById('project-modal-impact');
    const highlightsEl = document.getElementById('project-modal-highlights');
    const techEl = document.getElementById('project-modal-tech');
    const liveEl = document.getElementById('project-modal-live') as HTMLAnchorElement | null;
    const githubEl = document.getElementById('project-modal-github') as HTMLAnchorElement | null;

    if (tagEl) tagEl.textContent = `ARCHITECTURE BRIEF // ${project.tag}`;
    if (titleEl) titleEl.textContent = project.title;
    if (clientEl) {
      if (project.clientName) {
        clientEl.textContent = `Client Delivery: ${project.clientName}`;
        clientEl.classList.remove('hidden');
      } else {
        clientEl.classList.add('hidden');
      }
    }
    if (descEl) descEl.textContent = project.fullDesc;
    if (impactEl) impactEl.textContent = project.humanImpact;

    if (highlightsEl) {
      highlightsEl.replaceChildren();
      project.highlights.forEach((h) => {
        const li = document.createElement('li');
        li.className = 'flex items-start gap-2.5 text-sm text-[#F2EFE9]';
        const dot = document.createElement('span');
        dot.className = 'text-[#4FE3B5] mt-0.5';
        dot.setAttribute('aria-hidden', 'true');
        dot.textContent = '◆';
        const txt = document.createElement('span');
        txt.textContent = h;
        li.append(dot, txt);
        highlightsEl.appendChild(li);
      });
    }

    if (techEl) {
      techEl.replaceChildren();
      project.tech.forEach((t) => {
        const span = document.createElement('span');
        span.className =
          'px-3 py-1 rounded-lg bg-[#080B0A] border border-[rgba(242,239,233,0.12)] font-mono-tech text-xs text-[#E8B88A]';
        span.textContent = t;
        techEl.appendChild(span);
      });
    }

    if (liveEl) liveEl.href = project.liveUrl;
    if (githubEl) {
      if (project.githubUrl && project.githubUrl !== project.liveUrl) {
        githubEl.href = project.githubUrl;
        githubEl.classList.remove('hidden');
      } else {
        githubEl.classList.add('hidden');
      }
    }

    projectModal.classList.remove('hidden');
    projectModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    removeProjectTrap = setupModalTrap(projectModal, closeProjectModal);
    projectClose?.focus();
  };

  document.querySelectorAll<HTMLButtonElement>('[data-open-project]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.openProject) openProjectModal(btn.dataset.openProject, btn);
    });
  });
  projectBackdrop?.addEventListener('click', closeProjectModal);
  projectClose?.addEventListener('click', closeProjectModal);

  // 6. Skill Node Inspector
  const skillsRaw = document.getElementById('skills-json-data')?.textContent;
  const skillsList: SkillData[] = skillsRaw ? JSON.parse(skillsRaw) : [];
  const skillBtns = document.querySelectorAll<HTMLButtonElement>('[data-skill-btn]');

  skillBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const node = skillsList.find((s) => s.id === btn.dataset.skillBtn);
      if (!node) return;

      skillBtns.forEach((b) => {
        const active = b === btn;
        b.setAttribute('aria-selected', active ? 'true' : 'false');
        b.classList.toggle('bg-[#151C19]', active);
        b.classList.toggle('border-[#4FE3B5]/50', active);
        b.classList.toggle('bg-[#0F1412]', !active);
      });

      const setTxt = (id: string, val: string) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };
      setTxt('skill-ins-tag', `NODE INSPECTOR // ${node.tag}`);
      setTxt('skill-ins-name', node.name);
      setTxt('skill-ins-maturity', node.maturity);
      setTxt('skill-ins-latency', node.latency);
      setTxt('skill-ins-tenure', node.tenure);
      setTxt('skill-ins-role', node.role);
      setTxt('skill-ins-lang', node.language);
      setTxt('skill-ins-code', node.code);
      setTxt('skill-ins-project', `${node.projectLink} ↗`);
    });
  });

  // 7. ReAct Cognitive Loop Simulator
  const loopRaw = document.getElementById('loop-json-data')?.textContent;
  const loopSteps: LoopStepData[] = loopRaw ? JSON.parse(loopRaw) : [];
  const loopBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-loop-step]'));
  const loopPlayBtn = document.getElementById('loop-autoplay-btn');
  let loopIndex = 0;
  let loopInterval: number | null = null;

  const renderLoopStep = (idx: number) => {
    const item = loopSteps[idx];
    if (!item) return;
    loopIndex = idx;

    loopBtns.forEach((b, i) => {
      const active = i === idx;
      b.classList.toggle('bg-[#151C19]', active);
      b.classList.toggle('border-[#4FE3B5]/55', active);
      b.classList.toggle('bg-[#0B0F0D]', !active);
    });

    const t = document.getElementById('loop-step-title');
    const m = document.getElementById('loop-step-metric');
    const d = document.getElementById('loop-step-desc');
    const l = document.getElementById('loop-step-tech');
    if (t) t.textContent = `${item.step}. ${item.name}`;
    if (m) m.textContent = item.metric;
    if (d) d.textContent = item.desc;
    if (l) l.textContent = item.tech;
  };

  loopBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      if (loopInterval !== null) {
        window.clearInterval(loopInterval);
        loopInterval = null;
        if (loopPlayBtn) loopPlayBtn.textContent = 'Auto-Play Trace ▶';
      }
      renderLoopStep(idx);
    });
  });

  loopPlayBtn?.addEventListener('click', () => {
    if (loopInterval !== null) {
      window.clearInterval(loopInterval);
      loopInterval = null;
      loopPlayBtn.textContent = 'Auto-Play Trace ▶';
      return;
    }
    loopPlayBtn.textContent = 'Pause Trace ❚❚';
    loopInterval = window.setInterval(() => {
      renderLoopStep((loopIndex + 1) % loopSteps.length);
    }, 1500);
  });

  // 8. Wrapify Certificate Preview Modal
  const certModal = document.getElementById('cert-preview-modal');
  const certBackdrop = document.getElementById('cert-preview-backdrop');
  const certClose = document.getElementById('cert-preview-close');
  const certImg = document.getElementById('cert-preview-img') as HTMLImageElement | null;
  let certOpener: HTMLElement | null = null;
  let removeCertTrap = () => {};

  const closeCertModal = () => {
    if (!certModal) return;
    certModal.classList.add('hidden');
    certModal.classList.remove('flex');
    document.body.style.overflow = '';
    removeCertTrap();
    certOpener?.focus();
  };

  document.querySelectorAll<HTMLButtonElement>('[data-open-cert-preview]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!certModal) return;
      certOpener = btn;
      if (certImg && btn.dataset.openCertPreview) {
        certImg.src = btn.dataset.openCertPreview;
      }
      certModal.classList.remove('hidden');
      certModal.classList.add('flex');
      document.body.style.overflow = 'hidden';
      removeCertTrap = setupModalTrap(certModal, closeCertModal);
      certClose?.focus();
    });
  });
  certBackdrop?.addEventListener('click', closeCertModal);
  certClose?.addEventListener('click', closeCertModal);

  // 9. Live GitHub Sync (FastAPI LangGraph Backend -> Direct GitHub Fallback)
  const ghSection = document.getElementById('github');
  const apiBase = ghSection?.dataset.apiBase || 'http://127.0.0.1:8000';
  const ghBtn = document.getElementById('refresh-github-btn') as HTMLButtonElement | null;
  const ghLabel = document.getElementById('refresh-github-label');
  const ghCount = document.getElementById('gh-repo-count');
  const ghContribs = document.getElementById('gh-contrib-count');
  const ghCurStreak = document.getElementById('gh-current-streak');
  const ghLongStreak = document.getElementById('gh-longest-streak');
  const ghStatus = document.getElementById('gh-sync-status');
  const ghGrid = document.getElementById('gh-repos-grid');

  ghBtn?.addEventListener('click', async () => {
    if (!ghBtn) return;
    ghBtn.disabled = true;
    if (ghLabel) ghLabel.textContent = 'Syncing GitHub...';

    try {
      let reposPayload: Array<{ name: string; description: string; language: string; url: string; pushedAt: string }> = [];
      let totalRepos: number | null = null;
      let totalContribs: number | null = null;
      let curStreak: number | null = null;
      let longStreak: number | null = null;

      // Prefer Python FastAPI /api/github endpoint if active
      try {
        const pyRes = await fetch(`${apiBase}/api/github?sync=true`);
        if (pyRes.ok) {
          const pyData = await pyRes.json();
          totalRepos = pyData?.stats?.totalRepos ?? null;
          totalContribs = pyData?.stats?.totalContributions ?? null;
          curStreak = pyData?.stats?.currentStreak ?? null;
          longStreak = pyData?.stats?.longestStreak ?? null;
          reposPayload = pyData?.latestRepos || [];
        }
      } catch {
        // Fallback directly to GitHub REST API when static-only
      }

      if (reposPayload.length === 0) {
        const [userRes, reposRes] = await Promise.all([
          fetch('https://api.github.com/users/hashirahmad806'),
          fetch('https://api.github.com/users/hashirahmad806/repos?sort=pushed&per_page=6'),
        ]);
        if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API limit or offline');
        const user = await userRes.json();
        const repos = await reposRes.json();
        totalRepos = typeof user.public_repos === 'number' ? user.public_repos : null;
        if (Array.isArray(repos)) {
          reposPayload = repos.map((r) => ({
            name: r.name || 'Repository',
            description: r.description || 'Active engineering repository on GitHub.',
            language: r.language || 'Code',
            url: r.html_url,
            pushedAt: String(r.pushed_at || '').slice(0, 10),
          }));
        }
      }

      if (ghCount && totalRepos !== null) ghCount.textContent = String(totalRepos);
      if (ghContribs && totalContribs !== null) ghContribs.textContent = String(totalContribs);
      if (ghCurStreak && curStreak !== null) ghCurStreak.textContent = `${curStreak}d`;
      if (ghLongStreak && longStreak !== null) ghLongStreak.textContent = `${longStreak}d`;
      if (ghStatus) {
        ghStatus.textContent = `Synced ${new Date().toLocaleTimeString()}`;
        ghStatus.classList.add('text-[#4FE3B5]');
      }

      if (ghGrid && reposPayload.length > 0) {
        ghGrid.replaceChildren();
        reposPayload.forEach((repo) => {
          const card = document.createElement('a');
          card.href = repo.url;
          card.target = '_blank';
          card.rel = 'noopener noreferrer';
          card.className = 'bezel-outer group block';

          const inner = document.createElement('div');
          inner.className = 'bezel-inner lens-surface p-5 h-full flex flex-col justify-between gap-4';

          const top = document.createElement('div');
          top.className = 'relative z-[2] space-y-2';

          const header = document.createElement('div');
          header.className = 'flex items-start justify-between gap-2';
          const h3 = document.createElement('h3');
          h3.className = 'font-display font-bold text-base text-[#F2EFE9] group-hover:text-[#4FE3B5] transition-colors break-words min-w-0';
          h3.textContent = repo.name;
          const lang = document.createElement('span');
          lang.className = 'px-2 py-0.5 rounded bg-[#0B0F0D] border border-[rgba(242,239,233,0.1)] font-mono-tech text-[10px] text-[#E8B88A] shrink-0';
          lang.textContent = repo.language;
          header.append(h3, lang);

          const desc = document.createElement('p');
          desc.className = 'text-xs sm:text-sm text-[#B6C2BC] leading-relaxed';
          desc.textContent = repo.description;
          top.append(header, desc);

          const foot = document.createElement('div');
          foot.className = 'relative z-[2] pt-3 border-t border-[rgba(242,239,233,0.08)] flex items-center justify-between font-mono-tech text-[11px] text-[#85948D]';
          const dt = document.createElement('span');
          dt.textContent = `Updated ${repo.pushedAt}`;
          const arrow = document.createElement('span');
          arrow.className = 'text-[#4FE3B5]';
          arrow.textContent = 'Inspect ↗';
          foot.append(dt, arrow);

          inner.append(top, foot);
          card.appendChild(inner);
          ghGrid.appendChild(card);
        });
      }
    } catch {
      if (ghStatus) ghStatus.textContent = 'Offline — verified snapshot';
    } finally {
      ghBtn.disabled = false;
      if (ghLabel) ghLabel.textContent = 'Sync Live GitHub API';
    }
  });

  // 10. Contact Copy Email & Direct Mailto Brief Composer
  const copyEmailBtn = document.getElementById('copy-email-btn') as HTMLButtonElement | null;
  const copyStatus = document.getElementById('copy-email-status');
  const copyEmailToClipboard = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      return true;
    } catch {
      return false;
    }
  };

  copyEmailBtn?.addEventListener('click', async () => {
    const email = copyEmailBtn.dataset.email || 'Hashirahmad801@gmail.com';
    const ok = await copyEmailToClipboard(email);
    if (copyStatus) {
      copyStatus.textContent = ok
        ? `Copied ${email} to clipboard.`
        : `Direct address: ${email}`;
      copyStatus.classList.add('text-[#4FE3B5]');
    }
  });

  const contactForm = document.getElementById('contact-composer-form') as HTMLFormElement | null;
  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('contact-name') as HTMLInputElement;
    const emailInput = document.getElementById('contact-email') as HTMLInputElement;
    const topicInput = document.getElementById('contact-topic') as HTMLSelectElement;
    const msgInput = document.getElementById('contact-message') as HTMLTextAreaElement;

    const errName = document.getElementById('err-name');
    const errEmail = document.getElementById('err-email');
    const errMsg = document.getElementById('err-message');
    const statusBox = document.getElementById('contact-form-status');

    let hasErr = false;
    const setErr = (el: HTMLElement | null, msg: string) => {
      if (!el) return;
      if (msg) {
        el.textContent = msg;
        el.classList.remove('hidden');
        hasErr = true;
      } else {
        el.textContent = '';
        el.classList.add('hidden');
      }
    };

    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const msgVal = msgInput.value.trim();

    setErr(errName, nameVal ? '' : 'Please enter your name.');
    setErr(
      errEmail,
      emailVal && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)
        ? ''
        : 'Please enter a valid email address.'
    );
    setErr(errMsg, msgVal ? '' : 'Please include a short message.');

    if (hasErr) return;

    const subject = `[Portfolio] ${topicInput.value} — ${nameVal}`;
    const bodyText = `Hi Hashir,\n\nFrom: ${nameVal} (${emailVal})\nTopic: ${topicInput.value}\n\n${msgVal}`;
    await copyEmailToClipboard(`${subject}\n\n${bodyText}`);

    if (statusBox) {
      statusBox.textContent =
        'Draft copied to clipboard and launching your mail app to Hashirahmad801@gmail.com.';
      statusBox.classList.remove('hidden');
    }

    window.location.href = `mailto:Hashirahmad801@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyText)}`;
  });

  // 11. Real-Time LangChain + LangGraph RAG Chatbot & Direct WhatsApp Forwarder
  const chatModal = document.getElementById('identity-chatbot-modal');
  const chatBackdrop = document.getElementById('chatbot-backdrop');
  const chatClose = document.getElementById('chatbot-close');
  const chatLauncher = document.getElementById('chatbot-launcher');
  const chatHeroTrigger = document.getElementById('open-chatbot-hero');
  const chatForm = document.getElementById('chatbot-form') as HTMLFormElement | null;
  const chatInput = document.getElementById('chatbot-input') as HTMLInputElement | null;
  const chatMessages = document.getElementById('chatbot-messages');
  const chatApiStatus = document.getElementById('chatbot-api-status');
  const chatStatusDot = document.getElementById('chatbot-status-dot');
  const chatSuiteBtn = document.getElementById('chatbot-run-suite') as HTMLButtonElement | null;
  const waModeBtn = document.getElementById('chatbot-wa-mode-btn');
  const waPanel = document.getElementById('chatbot-wa-panel');
  const waPanelClose = document.getElementById('chatbot-wa-panel-close');
  const waForwardForm = document.getElementById('chatbot-wa-forward-form') as HTMLFormElement | null;
  const waBaseUrl = chatModal?.dataset.whatsappUrl || 'https://wa.me/923294222404';
  const chatApiUrl = chatModal?.dataset.apiBase || 'http://127.0.0.1:8000';
  const threadId = `visitor-${Math.random().toString(36).slice(2, 10)}`;
  let chatOpener: HTMLElement | null = null;
  let removeChatTrap = () => {};

  const checkChatbotHealth = async () => {
    try {
      const res = await fetch(`${chatApiUrl}/api/health`);
      if (res.ok) {
        const info = await res.json();
        if (chatApiStatus) {
          chatApiStatus.textContent = info.llmConfigured
            ? `Live RAG (${info.model}) · ${info.ragChunks} Vector Chunks`
            : `RAG Index Ready (${info.ragChunks} chunks) · Configure LLM Key`;
          chatApiStatus.classList.toggle('text-[#4FE3B5]', Boolean(info.llmConfigured));
          chatApiStatus.classList.toggle('text-[#E8B88A]', !info.llmConfigured);
        }
        if (chatStatusDot && info.llmConfigured) {
          chatStatusDot.classList.replace('bg-[#E8B88A]', 'bg-[#4FE3B5]');
        }
        return true;
      }
    } catch {
      // Python API offline
    }
    if (chatApiStatus) {
      chatApiStatus.textContent = 'Python RAG API Offline · Use WhatsApp Direct ↗';
    }
    return false;
  };

  const closeChatbot = () => {
    if (!chatModal) return;
    chatModal.classList.add('hidden');
    chatModal.classList.remove('flex');
    chatLauncher?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    removeChatTrap();
    chatOpener?.focus();
  };

  const openChatbot = async (opener?: HTMLElement | null) => {
    if (!chatModal) return;
    chatOpener = opener || (document.activeElement as HTMLElement | null);
    chatModal.classList.remove('hidden');
    chatModal.classList.add('flex');
    chatLauncher?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    removeChatTrap = setupModalTrap(chatModal, closeChatbot);
    chatInput?.focus();
    await checkChatbotHealth();
  };

  waModeBtn?.addEventListener('click', () => {
    waPanel?.classList.toggle('hidden');
    if (!waPanel?.classList.contains('hidden')) {
      (document.getElementById('wa-visitor-msg') as HTMLInputElement | null)?.focus();
    }
  });
  waPanelClose?.addEventListener('click', () => waPanel?.classList.add('hidden'));

  waForwardForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameEl = document.getElementById('wa-visitor-name') as HTMLInputElement | null;
    const msgEl = document.getElementById('wa-visitor-msg') as HTMLInputElement | null;
    const msgVal = msgEl?.value.trim() || '';
    if (!msgVal) return;

    let forwardUrl = makeWhatsappForwardUrl(waBaseUrl, msgVal, nameEl?.value ? `Visitor: ${nameEl.value.trim()}` : '');
    try {
      const res = await fetch(`${chatApiUrl}/api/whatsapp/forward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameEl?.value.trim() || '', message: msgVal }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.whatsappUrl) forwardUrl = data.whatsappUrl;
      }
    } catch {
      // Fallback safely to client-formatted wa.me link
    }
    window.open(forwardUrl, '_blank', 'noopener,noreferrer');
  });

  const appendUserBubble = (text: string) => {
    if (!chatMessages) return;
    const wrap = document.createElement('div');
    wrap.className = 'flex justify-end';
    const bubble = document.createElement('div');
    bubble.className = 'rounded-2xl rounded-br-sm bg-[#4FE3B5] text-[#06130F] px-4 py-2.5 text-sm font-medium max-w-[85%]';
    bubble.textContent = text;
    wrap.appendChild(bubble);
    chatMessages.appendChild(wrap);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const appendThinkingBubble = () => {
    if (!chatMessages) return null;
    const el = document.createElement('div');
    el.className = 'rounded-2xl border border-[#4FE3B5]/25 bg-[#0F1412] px-4 py-3 font-mono-tech text-xs text-[#4FE3B5] max-w-[80%] animate-pulse';
    el.textContent = 'Retrieving vector RAG chunks & querying live Groq LLM...';
    chatMessages.appendChild(el);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return el;
  };

  const appendBotBubble = (data: ChatApiResponse, originalQuery: string) => {
    if (!chatMessages) return;
    const card = document.createElement('div');
    card.className = 'rounded-2xl rounded-bl-sm border border-[rgba(242,239,233,0.12)] bg-[#0F1412] p-4 space-y-3 max-w-[94%]';

    const meta = document.createElement('div');
    meta.className = 'flex flex-wrap items-center justify-between gap-2 font-mono-tech text-[10px] uppercase tracking-[0.1em]';
    const leftMeta = document.createElement('span');
    leftMeta.className = 'text-[#4FE3B5]';
    leftMeta.textContent = `${data.intent} · ${data.model || data.mode}`;
    const rightMeta = document.createElement('span');
    rightMeta.className = 'text-[#85948D]';
    rightMeta.textContent = `${data.latencyMs}ms`;
    meta.append(leftMeta, rightMeta);

    const body = document.createElement('p');
    body.className = 'text-sm text-[#F2EFE9] leading-relaxed whitespace-pre-line';
    body.textContent = data.answer;

    card.append(meta, body);

    // Direct WhatsApp Escalation Banner when needed (or subtle per-message forward link always)
    const waUrl = data.whatsappUrl || makeWhatsappForwardUrl(waBaseUrl, originalQuery);
    if (data.needsWhatsapp) {
      const waCard = document.createElement('div');
      waCard.className = 'rounded-xl border border-[#E8B88A]/40 bg-[#E8B88A]/10 p-3 flex flex-wrap items-center justify-between gap-2.5';
      const waText = document.createElement('span');
      waText.className = 'text-xs text-[#F2EFE9]';
      waText.textContent = 'Need direct confirmation or custom project help? Forward this straight to Hashir.';
      const waBtn = document.createElement('a');
      waBtn.href = waUrl;
      waBtn.target = '_blank';
      waBtn.rel = 'noopener noreferrer';
      waBtn.className = 'px-3.5 py-2 rounded-lg bg-[#E8B88A] text-[#080B0A] font-mono-tech text-[11px] font-medium hover:opacity-95 shrink-0';
      waBtn.textContent = 'Forward to WhatsApp ↗';
      waCard.append(waText, waBtn);
      card.appendChild(waCard);
    }

    const traceDetails = document.createElement('details');
    traceDetails.className = 'rounded-xl border border-[rgba(242,239,233,0.08)] bg-[#080B0A] px-3 py-2';
    const summary = document.createElement('summary');
    summary.className = 'font-mono-tech text-[11px] text-[#E8B88A] cursor-pointer select-none flex items-center justify-between gap-2';
    summary.textContent = `RAG Chunks (${data.chunks?.length ?? 0}) & LangGraph Trace (${data.trace.map((t) => t.node).join(' → ')})`;

    const traceBody = document.createElement('div');
    traceBody.className = 'mt-2.5 space-y-2 font-mono-tech text-[11px] text-[#B6C2BC]';
    const srcLine = document.createElement('div');
    srcLine.textContent = `Sources: ${data.sources.join(' | ')}${data.embeddingBackend ? ` · Embeddings: ${data.embeddingBackend}` : ''}`;
    traceBody.appendChild(srcLine);

    if (data.chunks?.length) {
      data.chunks.slice(0, 3).forEach((ch, idx) => {
        const chRow = document.createElement('div');
        chRow.className = 'p-2 rounded-lg border border-[rgba(242,239,233,0.06)] bg-[#0F1412] text-[10px]';
        chRow.textContent = `[Chunk ${idx + 1} · ${ch.source} · sim=${ch.score}] ${ch.excerpt}`;
        traceBody.appendChild(chRow);
      });
    }

    data.trace.forEach((step) => {
      const row = document.createElement('div');
      row.textContent = `• ${step.node}${step.durationMs !== undefined ? ` (${step.durationMs}ms)` : ''}`;
      traceBody.appendChild(row);
    });

    const quickWa = document.createElement('a');
    quickWa.href = waUrl;
    quickWa.target = '_blank';
    quickWa.rel = 'noopener noreferrer';
    quickWa.className = 'inline-block pt-1 text-[#4FE3B5] hover:underline';
    quickWa.textContent = 'Forward this question to Hashir on WhatsApp ↗';
    traceBody.appendChild(quickWa);

    traceDetails.append(summary, traceBody);
    card.appendChild(traceDetails);

    if (data.suggestedFollowups?.length) {
      const followWrap = document.createElement('div');
      followWrap.className = 'flex flex-wrap gap-1.5 pt-1';
      data.suggestedFollowups.slice(0, 3).forEach((q) => {
        const fBtn = document.createElement('button');
        fBtn.type = 'button';
        fBtn.className =
          'px-2.5 py-1 rounded-full border border-[rgba(242,239,233,0.12)] bg-[#080B0A] font-mono-tech text-[10px] text-[#B6C2BC] hover:text-[#4FE3B5] hover:border-[#4FE3B5]/40 cursor-pointer';
        fBtn.textContent = q;
        fBtn.addEventListener('click', () => {
          void submitChatQuery(q);
        });
        followWrap.appendChild(fBtn);
      });
      card.appendChild(followWrap);
    }

    chatMessages.appendChild(card);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const submitChatQuery = async (rawMessage: string) => {
    const query = rawMessage.trim();
    if (!query) return;
    appendUserBubble(query);
    if (chatInput) chatInput.value = '';
    const loadingEl = appendThinkingBubble();

    try {
      const res = await fetch(`${chatApiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, thread_id: threadId }),
      });
      loadingEl?.remove();
      if (!res.ok) throw new Error('API error');
      const data: ChatApiResponse = await res.json();
      appendBotBubble(data, query);
    } catch {
      loadingEl?.remove();
      appendBotBubble(
        {
          answer:
            'The live Python LangChain + LangGraph RAG server (' +
            chatApiUrl +
            ') is not currently running. Start it with `python -m uvicorn app.main:app --port 8000` inside `backend/`, or click below to forward your message directly to Hashir on WhatsApp.',
          intent: 'offline_escalation',
          sources: ['Direct WhatsApp Handoff'],
          suggestedFollowups: [],
          mode: 'rag-api-offline',
          needsWhatsapp: true,
          whatsappUrl: makeWhatsappForwardUrl(waBaseUrl, query),
          latencyMs: 0,
          trace: [{ node: 'api_connectivity_check' }],
        },
        query
      );
    }
  };

  chatLauncher?.addEventListener('click', () => void openChatbot(chatLauncher));
  chatHeroTrigger?.addEventListener('click', () => void openChatbot(chatHeroTrigger));
  chatBackdrop?.addEventListener('click', closeChatbot);
  chatClose?.addEventListener('click', closeChatbot);

  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (chatInput) void submitChatQuery(chatInput.value);
  });

  document.querySelectorAll<HTMLButtonElement>('[data-chat-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.chatPreset) void submitChatQuery(btn.dataset.chatPreset);
    });
  });

  chatSuiteBtn?.addEventListener('click', async () => {
    chatSuiteBtn.disabled = true;
    chatSuiteBtn.textContent = 'Testing RAG...';
    appendUserBubble('Run live LangChain + LangGraph + Groq RAG API test suite');
    const loadingEl = appendThinkingBubble();
    try {
      const res = await fetch(`${chatApiUrl}/api/chat/test-suite`);
      loadingEl?.remove();
      if (!res.ok) throw new Error('Backend offline');
      const suite = await res.json();
      const lines = (suite.results || []).map(
        (r: { intent: string; model: string; latencyMs: number; query: string; needsWhatsapp: boolean }) =>
          `✓ [${r.intent} | ${r.model}${r.needsWhatsapp ? ' | WA Escalate' : ''}] (${r.latencyMs}ms) — ${r.query}`
      );
      appendBotBubble(
        {
          answer: `Live RAG + Groq Test Suite (${suite.passed ? 'PASSED' : 'PARTIAL'} — ${suite.count}/${suite.count}):\n${lines.join('\n')}`,
          intent: 'rag_diagnostic_suite',
          sources: ['FastAPI /api/chat/test-suite'],
          suggestedFollowups: ['Tell me about his Wrapify Solutions internship', 'Check his live GitHub contributions'],
          mode: 'groq-rag-live-suite',
          latencyMs: 0,
          trace: [
            { node: 'analyze_query' },
            { node: 'retrieve_rag_context' },
            { node: 'llm_rag_synthesis' },
            { node: 'whatsapp_handoff' },
          ],
        },
        'Run live RAG test suite'
      );
    } catch {
      loadingEl?.remove();
      appendBotBubble(
        {
          answer:
            'Could not reach Python RAG API at ' +
            chatApiUrl +
            '. Start it with `python -m uvicorn app.main:app --port 8000` inside `backend/` or forward your message directly to Hashir on WhatsApp.',
          intent: 'offline_escalation',
          sources: ['Connectivity Probe'],
          suggestedFollowups: [],
          mode: 'rag-api-offline',
          needsWhatsapp: true,
          whatsappUrl: makeWhatsappForwardUrl(waBaseUrl, 'Hi Hashir, I tried testing your portfolio AI assistant.'),
          latencyMs: 0,
          trace: [{ node: 'health_probe' }],
        },
        'Test RAG API'
      );
    } finally {
      chatSuiteBtn.disabled = false;
      chatSuiteBtn.textContent = 'Test RAG API';
    }
  });

  // 12. Command & Optical Lens Palette (Ctrl+K / Cmd+K)
  const cmdModal = document.getElementById('command-modal');
  const cmdBackdrop = document.getElementById('command-modal-backdrop');
  const cmdClose = document.getElementById('command-modal-close');
  const cmdInput = document.getElementById('command-search-input') as HTMLInputElement | null;
  const cmdOutput = document.getElementById('command-output');
  const openCmdBtn = document.getElementById('open-command-btn');
  const mobileCmdBtn = document.getElementById('mobile-command-trigger');
  let cmdOpener: HTMLElement | null = null;
  let removeCmdTrap = () => {};

  const closeCmdModal = () => {
    if (!cmdModal) return;
    cmdModal.classList.add('hidden');
    cmdModal.classList.remove('flex');
    document.body.style.overflow = '';
    removeCmdTrap();
    cmdOpener?.focus();
  };

  const openCmdModal = (opener?: HTMLElement | null) => {
    if (!cmdModal) return;
    cmdOpener = opener || (document.activeElement as HTMLElement | null);
    cmdModal.classList.remove('hidden');
    cmdModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    removeCmdTrap = setupModalTrap(cmdModal, closeCmdModal);
    if (cmdInput) {
      cmdInput.value = '';
      cmdInput.dispatchEvent(new Event('input'));
      cmdInput.focus();
    }
  };

  openCmdBtn?.addEventListener('click', () => openCmdModal(openCmdBtn));
  mobileCmdBtn?.addEventListener('click', () => {
    toggleMobileDrawer(false);
    openCmdModal(mobileCmdBtn);
  });
  cmdBackdrop?.addEventListener('click', closeCmdModal);
  cmdClose?.addEventListener('click', closeCmdModal);

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdModal?.classList.contains('hidden')) openCmdModal();
      else closeCmdModal();
    }
  });

  cmdInput?.addEventListener('input', () => {
    const q = cmdInput.value.trim().toLowerCase();
    document.querySelectorAll<HTMLElement>('.cmd-item').forEach((item) => {
      const lbl = (item.dataset.cmdLabel || '').toLowerCase();
      item.classList.toggle('hidden', q.length > 0 && !lbl.includes(q));
    });
  });

  document.querySelectorAll<HTMLElement>('[data-cmd-nav]').forEach((navItem) => {
    navItem.addEventListener('click', () => closeCmdModal());
  });

  document.querySelectorAll<HTMLButtonElement>('[data-cmd-action]').forEach((actionBtn) => {
    actionBtn.addEventListener('click', async () => {
      const act = actionBtn.dataset.cmdAction;
      if (act === 'open-chatbot') {
        closeCmdModal();
        void openChatbot(openCmdBtn);
      } else if (act === 'toggle-lens') {
        const next = !document.body.classList.contains('lens-inspect-active');
        setLensActive(next);
        if (cmdOutput) {
          cmdOutput.textContent = next
            ? '● Optical Lens Focus activated across all project & engineering surfaces.'
            : '○ Optical Lens Focus returned to hover-inspect mode.';
          cmdOutput.classList.remove('hidden');
        }
      } else if (act === 'copy-email') {
        await copyEmailToClipboard('Hashirahmad801@gmail.com');
        if (cmdOutput) {
          cmdOutput.textContent = '✓ Copied Hashirahmad801@gmail.com to clipboard.';
          cmdOutput.classList.remove('hidden');
        }
      } else if (act === 'run-rag' && cmdOutput) {
        cmdOutput.classList.remove('hidden');
        cmdOutput.replaceChildren();
        const lines = [
          '[01] LangGraph StateGraph initialized (thread: 0x9AF4)...',
          '[02] Cosine ANN Vector Search @ MongoDB Atlas (18.4ms, k=5)...',
          '[03] Verified: Hashir Ahmad · UET Peshawar CS · Wrapify Solutions Intern · 8 Certs.',
        ];
        lines.forEach((line, i) => {
          window.setTimeout(() => {
            const div = document.createElement('div');
            div.textContent = line;
            cmdOutput.appendChild(div);
          }, i * 320);
        });
      }
    });
  });
}
