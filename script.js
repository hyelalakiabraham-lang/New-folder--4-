

(function () {
  'use strict';

  
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    };
    animateFollower();

    // Cursor states
    const hoverTargets = document.querySelectorAll('a, button, .col-card-inner, .testi-btn');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
        cursor.style.background = 'transparent';
        cursor.style.border = '1px solid var(--gold)';
        follower.style.width = '60px';
        follower.style.height = '60px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        cursor.style.background = 'var(--gold)';
        cursor.style.border = 'none';
        follower.style.width = '32px';
        follower.style.height = '32px';
      });
    });
  }

  
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobLinks = document.querySelectorAll('.mob-link');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (mobileMenu.classList.contains('open')) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    }
  });

  mobLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    });
  });

  
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => revealObserver.observe(el));

  const counters = document.querySelectorAll('.stat-num');
  let countersStarted = false;

  const animateCount = (el, target, duration) => {
    let start = 0;
    const step = timestamp => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const heroSection = document.querySelector('.hero');
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        counters.forEach(counter => {
          const target = parseInt(counter.dataset.target, 10);
          animateCount(counter, target, 1800);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  if (heroSection) statsObserver.observe(heroSection);

  const form = document.getElementById('enquiry-form');
  const formNote = document.getElementById('form-note');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const hairType = document.getElementById('hair-type').value;
      const message = document.getElementById('message').value.trim();

      if (!name || !phone) {
        formNote.textContent = 'Please fill in your name and WhatsApp number.';
        formNote.style.color = '#e05555';
        return;
      }

      
      const waText = encodeURIComponent(
        `Hello Sooglad! 👋\n\n` +
        `My name is ${name}.\n` +
        (hairType ? `I am interested in: ${hairType}.\n` : '') +
        (message ? `Message: ${message}\n` : '') +
        `\nPlease let me know what is available. Thank you!`
      );

      const submitBtn = form.querySelector('.form-submit');
      submitBtn.textContent = 'Redirecting to WhatsApp…';
      submitBtn.disabled = true;

      formNote.textContent = '✓ Opening WhatsApp for you now…';
      formNote.style.color = 'var(--gold)';

      setTimeout(() => {
        window.open(`https://wa.me/2348129698218?text=${waText}`, '_blank');
        form.reset();
        submitBtn.textContent = 'Send Enquiry';
        submitBtn.disabled = false;
        formNote.textContent = '';
      }, 800);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  const heroBg = document.querySelector('.hero-bg-lines');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroBg.style.transform = `translateY(${scrolled * 0.2}px)`;
    }, { passive: true });
  }

  
  const colCards = document.querySelectorAll('.col-card-inner');
  colCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  // Animate the gold-bar elements into view
  const goldBars = document.querySelectorAll('.gold-bar');
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'expandBar 0.8s ease forwards';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  goldBars.forEach(bar => {
    bar.style.width = '0';
    barObserver.observe(bar);
  });

  // Inject keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes expandBar {
      from { width: 0; opacity: 0; }
      to { width: 48px; opacity: 1; }
    }
  `;
  document.head.appendChild(style);

})();
