/* ==========================================================================
   WINTER TAPE CLUB — interactions
   Vanilla JS, no dependencies. Every feature degrades gracefully.
   --------------------------------------------------------------------------
   01 · utilities
   02 · navigation
   03 · tape counter
   04 · scroll spy
   05 · side a / side b
   06 · memory lightbox
   07 · random note machine
   08 · footer year
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ── 01 · UTILITIES ───────────────────────────────────────────────────── */
  function pad(n) { return String(n).padStart(2, "0"); }

  function formatTimecode(totalSeconds) {
    var h = Math.floor(totalSeconds / 3600) % 24;
    var m = Math.floor(totalSeconds / 60) % 60;
    var s = Math.floor(totalSeconds) % 60;
    return pad(h) + ":" + pad(m) + ":" + pad(s);
  }

  /* ── 02 · NAVIGATION ──────────────────────────────────────────────────── */
  (function navigation() {
    var nav     = $("#nav");
    var toggle  = $("#nav-toggle");
    var menu    = $("#nav-menu");
    var links   = $$(".nav__link");
    if (!nav || !toggle || !menu) return;

    function closeMenu() {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      menu.classList.remove("is-open");
      document.body.classList.remove("is-locked");
    }

    function openMenu() {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      menu.classList.add("is-open");
      document.body.classList.add("is-locked");
    }

    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });

    links.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) closeMenu();
    });

    /* sticky state */
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        nav.classList.toggle("is-stuck", window.scrollY > 40);
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();

  /* ── 03 · TAPE COUNTER ────────────────────────────────────────────────── */
  (function tapeCounter() {
    var counter = $("#tape-counter");
    var hero    = $("#hero-timestamp");
    if (!counter && !hero) return;

    var started = Date.now();
    var baseSeconds = 1 * 3600 + 23 * 60 + 45; // 01:23:45 — the tape's own clock

    function tick() {
      var elapsed = Math.floor((Date.now() - started) / 1000);
      var value = formatTimecode(baseSeconds + elapsed);
      if (counter) counter.textContent = value;
      if (hero) hero.textContent = value;
    }

    tick();
    window.setInterval(tick, 1000);
  })();

  /* ── 04 · SCROLL SPY ──────────────────────────────────────────────────── */
  (function scrollSpy() {
    var links = $$(".nav__link");
    if (!links.length || !("IntersectionObserver" in window)) return;

    var map = {};
    links.forEach(function (link) {
      var id = link.getAttribute("href");
      if (id && id.charAt(0) === "#") map[id.slice(1)] = link;
    });

    var sections = Object.keys(map)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    if (!sections.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) { link.classList.remove("is-current"); });
        var active = map[entry.target.id];
        if (active) active.classList.add("is-current");
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });

    /* the footer is not a nav target — keep the last section marked when we reach the end */
    window.addEventListener("scroll", function () {
      var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (!atBottom) return;
      links.forEach(function (link) { link.classList.remove("is-current"); });
      links[links.length - 1].classList.add("is-current");
    }, { passive: true });
  })();

  /* ── 05 · SIDE A / SIDE B ─────────────────────────────────────────────── */
  (function tapeSides() {
    var tabs   = $$(".deck__tab");
    var panels = $$(".panel");
    var thumb  = $(".deck__thumb");
    if (tabs.length !== 2 || panels.length !== 2) return;

    function activate(index, focusTab) {
      tabs.forEach(function (tab, i) {
        var selected = i === index;
        tab.classList.toggle("deck__tab--active", selected);
        tab.setAttribute("aria-selected", selected ? "true" : "false");
        tab.setAttribute("tabindex", selected ? "0" : "-1");
      });

      panels.forEach(function (panel, i) {
        var active = i === index;
        panel.classList.toggle("panel--active", active);
        panel.hidden = !active;
        if (active && !reduceMotion) {
          // restart the entrance animation
          panel.style.animation = "none";
          void panel.offsetWidth;
          panel.style.animation = "";
        }
      });

      if (thumb) thumb.classList.toggle("is-b", index === 1);
      if (focusTab && tabs[index]) tabs[index].focus();
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () { activate(index, false); });

      tab.addEventListener("keydown", function (event) {
        var key = event.key;
        if (key === "ArrowRight" || key === "ArrowDown") {
          event.preventDefault();
          activate(1, true);
        } else if (key === "ArrowLeft" || key === "ArrowUp") {
          event.preventDefault();
          activate(0, true);
        } else if (key === "Home") {
          event.preventDefault();
          activate(0, true);
        } else if (key === "End") {
          event.preventDefault();
          activate(1, true);
        }
      });
    });
  })();

  /* ── 06 · MEMORY LIGHTBOX ─────────────────────────────────────────────── */
  (function lightbox() {
    var triggers = $$(".memory__frame");
    var box      = $("#lightbox");
    if (!triggers.length || !box) return;

    var img      = $("#lb-img");
    var title    = $("#lb-title");
    var caption  = $("#lb-caption");
    var time     = $("#lb-time");
    var count    = $("#lb-count");
    var btnPrev  = $("#lb-prev");
    var btnNext  = $("#lb-next");
    var closeEls = $$("[data-close]", box);
    var lastFocus = null;
    var current = 0;

    var items = triggers.map(function (btn) {
      var card = btn.closest(".memory__card");
      var picture = $("img", btn);
      return {
        src: picture ? picture.getAttribute("src") : "",
        alt: picture ? picture.getAttribute("alt") : "",
        title: card ? ($(".memory__label", card) || {}).textContent : "",
        caption: card ? ($(".memory__caption", card) || {}).textContent : "",
        time: card ? ($(".memory__time", card) || {}).textContent : ""
      };
    });

    function render(index) {
      current = (index + items.length) % items.length;
      var item = items[current];
      img.setAttribute("src", item.src);
      img.setAttribute("alt", item.alt || item.title || "Memory photograph");
      title.textContent = (item.title || "").trim();
      caption.textContent = (item.caption || "").trim();
      time.textContent = (item.time || "").trim();
      count.textContent = (current + 1) + " / " + items.length;

      // reset the entrance animation on the panel figure
      if (!reduceMotion) {
        img.style.animation = "none";
        void img.offsetWidth;
        img.style.animation = "";
      }
    }

    function open(index, trigger) {
      lastFocus = trigger || document.activeElement;
      render(index);
      box.hidden = false;
      document.body.classList.add("is-locked");
      var closeBtn = $(".lightbox__close", box);
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      box.hidden = true;
      document.body.classList.remove("is-locked");
      img.removeAttribute("src");
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }

    triggers.forEach(function (btn, index) {
      btn.addEventListener("click", function () { open(index, btn); });
    });

    closeEls.forEach(function (el) { el.addEventListener("click", close); });

    btnPrev.addEventListener("click", function () { render(current - 1); });
    btnNext.addEventListener("click", function () { render(current + 1); });

    document.addEventListener("keydown", function (event) {
      if (box.hidden) return;

      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        render(current - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        render(current + 1);
      } else if (event.key === "Tab") {
        // keep focus inside the dialog
        var focusable = $$("button, [href], [tabindex]:not([tabindex='-1'])", box)
          .filter(function (el) { return el.offsetParent !== null; });
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  })();

  /* ── 07 · RANDOM NOTE MACHINE ─────────────────────────────────────────── */
  (function noteMachine() {
    var button = $("#note-btn");
    var prompt = $("#note-prompt");
    var text   = $("#note-text");
    var meta   = $("#note-meta");
    if (!button || !text || !meta) return;

    var notes = [
      { body: "Some days I wish I could rewind.", when: "Dec 2023 · bus stop, 7:40am" },
      { body: "We didn't know those moments would become memories.", when: "Jan 2024 · inside a library book" },
      { body: "Maybe growing up just means learning how to miss things.", when: "Feb 2024 · back of a receipt" },
      { body: "The hallway still smells like winter and floor polish.", when: "Mar 2024 · second floor" },
      { body: "I still take the long way home past the old building.", when: "Nov 2024 · 6:12pm" },
      { body: "Some tapes are meant to be played only once.", when: "Jan 2025 · tape 07, unlabelled" },
      { body: "You were laughing at something I can't remember now.", when: "unfiled · tape 12" },
      { body: "I keep the ticket stub in my coat pocket like proof.", when: "unfiled · winter, no date" },
      { body: "If I called you now, would we still be seventeen?", when: "unfiled · 2:31am" },
      { body: "Everything was ordinary and it was the best year of my life.", when: "unfiled · december" },
      { body: "I wrote your name in the snow and watched it disappear.", when: "unfiled · first snow" },
      { body: "The tape clicks at the same place every time. I play it anyway.", when: "unfiled · side b" }
    ];

    var lastIndex = -1;

    function pickIndex() {
      if (notes.length < 2) return 0;
      var index = lastIndex;
      while (index === lastIndex) {
        index = Math.floor(Math.random() * notes.length);
      }
      return index;
    }

    function reveal() {
      var index = pickIndex();
      lastIndex = index;
      var note = notes[index];

      if (prompt) prompt.hidden = true;
      text.hidden = false;
      meta.hidden = false;

      text.textContent = note.body;
      meta.textContent = note.when;

      if (!reduceMotion) {
        text.style.animation = "none";
        meta.style.animation = "none";
        void text.offsetWidth;
        text.style.animation = "";
        meta.style.animation = "";
      }
    }

    button.addEventListener("click", reveal);
  })();

  /* ── 08 · FOOTER YEAR ─────────────────────────────────────────────────── */
  (function footerYear() {
    var year = $("#year");
    if (year) year.textContent = String(new Date().getFullYear());
  })();
})();
