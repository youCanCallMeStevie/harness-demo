(function () {
  function cssVar(prop) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(prop).trim().replace(/^['"]|['"]$/g, '');
  }

  const name   = cssVar('--company-name');
  const domain = cssVar('--company-domain')
    || name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';

  if (!name) return;

  // Let rebrand-panel.js handle everything when a saved brand exists
  if (localStorage.getItem('harness-demo-brand')) return;

  // Page title + visible name labels
  document.title = document.title.replace(/—\s*.+$/, '— ' + name);
  document.querySelectorAll('.login-logo-name, .sidebar-logo-name').forEach(el => {
    el.textContent = name;
  });

  // Sources tried in order; first successful load wins
  const sources = [
    'https://logo.clearbit.com/' + domain,
    'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://' + domain + '&size=256',
    'https://www.google.com/s2/favicons?domain=' + domain + '&sz=128',
  ];

  function showInitials(container) {
    const initials = name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
    container.innerHTML =
      '<span style="font-size:0.7em;font-weight:700;color:#fff;letter-spacing:-0.5px">' +
      initials + '</span>';
  }

  function tryNext(idx, container) {
    if (idx >= sources.length) {
      showInitials(container);
      return;
    }
    const img = new Image();
    img.alt = name;
    img.style.cssText = 'width:100%;height:100%;object-fit:contain;padding:4px;border-radius:inherit;';
    img.onload = function () {
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

  document.querySelectorAll('.login-logo-icon, .sidebar-logo-icon').forEach(container => {
    tryNext(0, container);
  });
})();
