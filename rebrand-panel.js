(function () {
  const STORAGE_KEY = 'harness-demo-brand';

  const PRESETS = {
    technology: {
      primary: '#1CC47E', primaryDark: '#159E65', primaryLight: '#E4F9F0',
      accent: '#6366F1', accentLight: '#EEEEFF',
      bg: '#080D12', surface: '#0F1720', elevated: '#18232E',
      border: '#1E2D3D', borderLight: '#273D52',
      text: '#EEF2F6', textMuted: '#7A90A8', textFaint: '#3A5060',
      glow: 'rgba(28,196,126,0.15)'
    },
    finance: {
      primary: '#0057B8', primaryDark: '#003F8A', primaryLight: '#E8F0FB',
      accent: '#B8860B', accentLight: '#FDF6E3',
      bg: '#0D1117', surface: '#161B26', elevated: '#1E2637',
      border: '#1E2D45', borderLight: '#2A3A55',
      text: '#F0F4F8', textMuted: '#8899AA', textFaint: '#4A5568',
      glow: 'rgba(0,87,184,0.15)'
    },
    healthcare: {
      primary: '#10B981', primaryDark: '#059669', primaryLight: '#D1FAE5',
      accent: '#6366F1', accentLight: '#EEF2FF',
      bg: '#071420', surface: '#0D1E2E', elevated: '#142538',
      border: '#1A3040', borderLight: '#244050',
      text: '#EEF6F0', textMuted: '#80A090', textFaint: '#3A5045',
      glow: 'rgba(16,185,129,0.15)'
    },
    retail: {
      primary: '#FF6B35', primaryDark: '#E85520', primaryLight: '#FFF0EB',
      accent: '#6366F1', accentLight: '#EEEEFF',
      bg: '#0D0A08', surface: '#1A1410', elevated: '#241E18',
      border: '#352820', borderLight: '#453530',
      text: '#F5F0EC', textMuted: '#A09080', textFaint: '#5A4535',
      glow: 'rgba(255,107,53,0.15)'
    },
    automotive: {
      primary: '#E53E3E', primaryDark: '#C53030', primaryLight: '#FFF5F5',
      accent: '#718096', accentLight: '#EDF2F7',
      bg: '#0A0A0A', surface: '#141414', elevated: '#1E1E1E',
      border: '#2D2D2D', borderLight: '#3D3D3D',
      text: '#F7FAFC', textMuted: '#A0AEC0', textFaint: '#4A5568',
      glow: 'rgba(229,62,62,0.12)'
    }
  };

  function applyVars(p) {
    const s = document.documentElement.style;
    s.setProperty('--color-primary',       p.primary);
    s.setProperty('--color-primary-dark',  p.primaryDark);
    s.setProperty('--color-primary-light', p.primaryLight);
    s.setProperty('--color-accent',        p.accent);
    s.setProperty('--color-accent-light',  p.accentLight);
    s.setProperty('--color-bg',            p.bg);
    s.setProperty('--color-bg-surface',    p.surface);
    s.setProperty('--color-bg-elevated',   p.elevated);
    s.setProperty('--color-border',        p.border);
    s.setProperty('--color-border-light',  p.borderLight);
    s.setProperty('--color-text',          p.text);
    s.setProperty('--color-text-muted',    p.textMuted);
    s.setProperty('--color-text-faint',    p.textFaint);
    s.setProperty('--shadow-glow',         '0 0 40px ' + p.glow);
  }

  function applyLogo(name, domain) {
    document.title = document.title.replace(/—\s*.+$/, '— ' + name);
    document.querySelectorAll('.login-logo-name, .sidebar-logo-name').forEach(el => {
      el.textContent = name;
    });

    const sources = [
      'https://logo.clearbit.com/' + domain,
      'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://' + domain + '&size=256',
      'https://www.google.com/s2/favicons?domain=' + domain + '&sz=128',
    ];

    function showInitials(container) {
      const initials = name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
      container.style.background = '';
      container.innerHTML =
        '<span style="font-size:0.7em;font-weight:700;color:#fff;letter-spacing:-0.5px">' +
        initials + '</span>';
    }

    function tryNext(idx, container) {
      if (idx >= sources.length) { showInitials(container); return; }
      const img = new Image();
      img.alt = name;
      img.style.cssText = 'width:100%;height:100%;object-fit:contain;padding:4px;border-radius:inherit;';
      img.onload = function () {
        // Skip placeholder images returned by favicon services (typically 16×16 or 1×1)
        if (this.naturalWidth < 24 || this.naturalHeight < 24) {
          tryNext(idx + 1, container);
          return;
        }
        container.style.background = 'transparent';
        container.innerHTML = '';
        container.appendChild(this);
      };
      img.onerror = function () { tryNext(idx + 1, container); };
      img.src = sources[idx];
    }

    document.querySelectorAll('.login-logo-icon, .sidebar-logo-icon').forEach(c => tryNext(0, c));
  }

  function applyBrand(data) {
    if (PRESETS[data.industry]) applyVars(PRESETS[data.industry]);
    applyLogo(data.name, data.domain);
  }

  // Apply saved brand immediately on load
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  if (saved) applyBrand(saved);

  // Build and open the rebrand panel
  function openPanel() {
    const current = saved || {
      name:     getComputedStyle(document.documentElement).getPropertyValue('--company-name').trim().replace(/^['"]|['"]$/g, ''),
      domain:   getComputedStyle(document.documentElement).getPropertyValue('--company-domain').trim().replace(/^['"]|['"]$/g, ''),
      industry: 'technology'
    };

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);z-index:9998;display:flex;align-items:center;justify-content:center;';

    overlay.innerHTML = `
      <style>
        @keyframes rb-up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        .rb-panel{background:#0F1720;border:1px solid #273D52;border-radius:16px;padding:28px 32px;width:400px;max-width:calc(100vw - 32px);box-shadow:0 24px 60px rgba(0,0,0,0.7);animation:rb-up 0.2s ease;font-family:system-ui,sans-serif;}
        .rb-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;}
        .rb-title{font-size:1.05rem;font-weight:700;color:#EEF2F6;}
        .rb-close{background:none;border:none;color:#7A90A8;cursor:pointer;font-size:1.3rem;line-height:1;padding:0 4px;}
        .rb-close:hover{color:#EEF2F6;}
        .rb-label{display:block;font-size:0.72rem;font-weight:600;color:#7A90A8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:6px;}
        .rb-field{margin-bottom:18px;}
        .rb-input,.rb-select{width:100%;background:#18232E;border:1.5px solid #1E2D3D;border-radius:8px;color:#EEF2F6;font-size:0.9rem;padding:10px 13px;outline:none;box-sizing:border-box;font-family:inherit;transition:border-color 0.15s;}
        .rb-input:focus,.rb-select:focus{border-color:#1CC47E;}
        .rb-select{cursor:pointer;}
        .rb-apply{width:100%;padding:12px;background:#1CC47E;border:none;border-radius:8px;color:#fff;font-size:0.9rem;font-weight:600;cursor:pointer;font-family:inherit;margin-bottom:10px;transition:background 0.15s;}
        .rb-apply:hover{background:#159E65;}
        .rb-reset{width:100%;padding:10px;background:transparent;border:1.5px solid #1E2D3D;border-radius:8px;color:#7A90A8;font-size:0.85rem;cursor:pointer;font-family:inherit;transition:all 0.15s;}
        .rb-reset:hover{border-color:#273D52;color:#EEF2F6;}
      </style>
      <div class="rb-panel">
        <div class="rb-head">
          <span class="rb-title">Rebrand Demo</span>
          <button class="rb-close">&times;</button>
        </div>
        <div class="rb-field">
          <label class="rb-label" for="rb-name">Company name</label>
          <input class="rb-input" id="rb-name" type="text" placeholder="e.g. Leapwork" value="${current.name}">
        </div>
        <div class="rb-field">
          <label class="rb-label" for="rb-domain">Website domain</label>
          <input class="rb-input" id="rb-domain" type="text" placeholder="e.g. leapwork.com" value="${current.domain}">
        </div>
        <div class="rb-field">
          <label class="rb-label" for="rb-industry">Industry</label>
          <select class="rb-select" id="rb-industry">
            <option value="technology"  ${current.industry==='technology' ?'selected':''}>Technology / SaaS</option>
            <option value="finance"     ${current.industry==='finance'    ?'selected':''}>Finance / Banking</option>
            <option value="healthcare"  ${current.industry==='healthcare' ?'selected':''}>Healthcare</option>
            <option value="retail"      ${current.industry==='retail'     ?'selected':''}>Retail / E-commerce</option>
            <option value="automotive"  ${current.industry==='automotive' ?'selected':''}>Automotive</option>
          </select>
        </div>
        <button class="rb-apply">Apply Branding</button>
        <button class="rb-reset">Reset to default</button>
      </div>
    `;

    document.body.appendChild(overlay);

    function close() { overlay.remove(); }
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    overlay.querySelector('.rb-close').addEventListener('click', close);

    overlay.querySelector('.rb-apply').addEventListener('click', () => {
      const name     = overlay.querySelector('#rb-name').value.trim();
      const domain   = overlay.querySelector('#rb-domain').value.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
      const industry = overlay.querySelector('#rb-industry').value;
      if (!name || !domain) return;
      const data = { name, domain, industry };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      applyBrand(data);
      close();
    });

    overlay.querySelector('.rb-reset').addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    });
  }

  // Floating trigger button
  const btn = document.createElement('button');
  btn.textContent = '⚙ Rebrand';
  btn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9000;background:#0F1720;border:1.5px solid #273D52;border-radius:8px;color:#7A90A8;font-size:0.8rem;font-weight:600;padding:8px 14px;cursor:pointer;font-family:system-ui,sans-serif;transition:all 0.15s;';
  btn.addEventListener('mouseenter', () => { btn.style.color = '#EEF2F6'; btn.style.borderColor = '#1CC47E'; });
  btn.addEventListener('mouseleave', () => { btn.style.color = '#7A90A8'; btn.style.borderColor = '#273D52'; });
  btn.addEventListener('click', openPanel);
  document.body.appendChild(btn);
})();
