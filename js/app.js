/**
 * DIGITAL BUSINESS CARD - CORE APPLICATION ENGINE
 * Developed by: Agente Desarrollador Master
 * Audited by: Agente de Calidad y Seguridad (QA & SecOps)
 * Architecture: Zero-Dependency, Mobile-First, Decoupled Config
 */

'use strict';

// Global state
let appConfig = null;

// SVG Icons repository for high performance (Zero external font dependencies)
const SVG_ICONS = {
  nfc: `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16zM18 6h-5c-1.1 0-2 .9-2 2v2.15c-.54.23-1.01.6-1.37 1.07L7.66 9.25c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l2.58 2.58c-.53.86-.83 1.87-.83 2.96 0 3.31 2.69 6 6 6s6-2.69 6-6V8c0-1.1-.9-2-2-2zm0 10.2c0 2.21-1.79 4-4 4s-4-1.79-4-4c0-.79.23-1.53.63-2.15l4.82 4.82c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-2.03-2.03V8h3.17v8.2z"/></svg>`,
  share: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>`,
  downloadUser: `<svg viewBox="0 0 24 24"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.42.06-.64.3-.22.25-.85.83-.85 2.02s.87 2.34 1 2.5c.12.16 1.7 2.6 4.12 3.65.58.25 1.02.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.21-.57.21-1.06.15-1.16-.06-.1-.22-.16-.47-.29s-1.44-.71-1.66-.79c-.23-.08-.39-.12-.56.12-.17.25-.64.79-.79.95-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.84-.2-.48-.41-.42-.56-.43h-.48z"/></svg>`,
  phone: `<svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`,
  email: `<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
  link: `<svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>`,
  github: `<svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>`,
  x: `<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>`,
  qr: `<svg viewBox="0 0 24 24"><path d="M3 3h8v8H3zm2 2v4h4V5zm8-2h8v8h-8zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zm13-2h3v2h-3zm-3 2h3v3h-3zm3 3h3v3h-3zm-3 3h3v2h-3zm5-5h2v5h-2zm-2-5h2v2h-2z"/></svg>`,
  copy: `<svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`,
  close: `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`
};

/**
 * URL Sanitizer - Defense against XSS & Injection attacks
 * Only allows safe protocols: http, https, mailto, tel, sms
 */
function sanitizeUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') return '#';
  const trimmed = urlString.trim();
  const safeProtocolRegex = /^(https?:\/\/|mailto:|tel:|sms:)/i;
  
  if (safeProtocolRegex.test(trimmed)) {
    return encodeURI(trimmed);
  }
  return '#';
}

/**
 * Haptic Feedback Simulation (Supported on mobile Chrome/Android)
 */
function triggerHaptic(duration = 18) {
  if (appConfig?.settings?.enableHaptics && 'vibrate' in navigator) {
    try {
      navigator.vibrate(duration);
    } catch (_) {
      // Ignore vibration errors gracefully
    }
  }
}

/**
 * Toast Notification System
 */
function showToast(message) {
  const toast = document.getElementById('toastNotice');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  triggerHaptic(25);
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

/**
 * RFC 2426 / 6350 Compliant vCard Generator
 * Escapes characters and supports UTF-8 for international characters.
 */
function generateVCardData(cfg) {
  const v = cfg.vcard || {};
  const p = cfg.profile || {};
  
  const escapeVal = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  };

  const firstName = escapeVal(v.firstName || p.name?.split(' ')[0] || '');
  const lastName = escapeVal(v.lastName || p.name?.split(' ').slice(1).join(' ') || '');
  const org = escapeVal(v.organization || p.company || '');
  const title = escapeVal(v.title || p.title || '');
  const phone = escapeVal(v.phone || '');
  const email = escapeVal(v.email || '');
  const website = escapeVal(v.website || '');
  const note = escapeVal(v.note || p.bio || '');
  const city = escapeVal(v.address?.city || '');
  const country = escapeVal(v.address?.country || '');

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N;CHARSET=UTF-8:${lastName};${firstName};;;`,
    `FN;CHARSET=UTF-8:${escapeVal(p.name || `${firstName} ${lastName}`.trim())}`,
    org ? `ORG;CHARSET=UTF-8:${org}` : null,
    title ? `TITLE;CHARSET=UTF-8:${title}` : null,
    phone ? `TEL;TYPE=CELL,VOICE:${phone}` : null,
    email ? `EMAIL;TYPE=INTERNET,PREF:${email}` : null,
    website ? `URL:${website}` : null,
    (city || country) ? `ADR;TYPE=WORK;CHARSET=UTF-8:;;;${city};;;${country}` : null,
    note ? `NOTE;CHARSET=UTF-8:${note}` : null,
    `REV:${new Date().toISOString()}`,
    'END:VCARD'
  ].filter(Boolean);

  return lines.join('\r\n');
}

/**
 * Trigger Native vCard Download (.vcf)
 */
function downloadVCard() {
  triggerHaptic(30);
  if (!appConfig) return;

  const vcardText = generateVCardData(appConfig);
  const blob = new Blob([vcardText], { type: 'text/vcard;charset=utf-8;' });
  const filename = `${(appConfig.profile.name || 'contacto').toLowerCase().replace(/\s+/g, '_')}.vcf`;

  // Standard download via Object URL
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(link.href), 1500);

  showToast('¡Contacto guardado en tu dispositivo!');
}

/**
 * Handle Native Quick Share or fallback to QR Modal
 */
async function handleShareAction() {
  triggerHaptic(20);
  const shareData = {
    title: `${appConfig?.profile?.name || 'Tarjeta de Presentación'} | Contacto`,
    text: `${appConfig?.profile?.name} - ${appConfig?.profile?.title}. Conéctate conmigo aquí:`,
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      showToast('¡Compartido exitosamente!');
      return;
    } catch (err) {
      if (err.name !== 'AbortError') {
        openShareModal();
      }
    }
  } else {
    openShareModal();
  }
}

/**
 * Open QR Code & Share Modal
 */
function openShareModal() {
  const modal = document.getElementById('shareModal');
  const qrContainer = document.getElementById('qrCodeContainer');
  if (!modal || !qrContainer) return;

  const currentUrl = window.location.href;

  // Generate vector QR Code using standalone qrcode-generator
  try {
    if (typeof qrcode !== 'undefined') {
      const qr = qrcode(0, 'M');
      qr.addData(currentUrl);
      qr.make();
      qrContainer.innerHTML = qr.createSvgTag(5, 0);
    } else {
      qrContainer.textContent = currentUrl;
    }
  } catch (err) {
    qrContainer.textContent = currentUrl;
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

/**
 * Close QR Code & Share Modal
 */
function closeShareModal() {
  const modal = document.getElementById('shareModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Copy Card Link to Clipboard with visual confirmation
 */
async function copyCardLink() {
  triggerHaptic(25);
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast('¡Enlace copiado al portapapeles!');
  } catch (_) {
    // Fallback for older browsers
    const input = document.createElement('input');
    input.value = window.location.href;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast('¡Enlace copiado!');
  }
}

/**
 * Build URL based on action type
 */
function resolveActionUrl(action) {
  switch (action.type) {
    case 'whatsapp': {
      const cleanPhone = String(action.value).replace(/\D/g, '');
      const encodedMsg = encodeURIComponent(action.message || 'Hola, me gustaría contactarte.');
      return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
    }
    case 'phone': {
      return `tel:${action.value}`;
    }
    case 'email': {
      const sub = encodeURIComponent(action.subject || 'Contacto');
      return `mailto:${action.value}?subject=${sub}`;
    }
    case 'link':
    default: {
      return action.value;
    }
  }
}

/**
 * Render Profile Component safely into the DOM
 */
function renderProfile(profile) {
  const container = document.getElementById('profileHeaderContainer');
  if (!container) return;
  container.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'profile-card';

  // Avatar Wrapper
  const avatarWrapper = document.createElement('div');
  avatarWrapper.className = 'avatar-wrapper';

  if (profile.avatar) {
    const img = document.createElement('img');
    img.className = 'avatar-img';
    img.src = sanitizeUrl(profile.avatar);
    img.alt = profile.name || 'Foto de Perfil';
    img.loading = 'eager';
    img.onerror = () => {
      // Fallback monogram if image fails or is blocked
      avatarWrapper.innerHTML = '';
      const fallback = document.createElement('div');
      fallback.className = 'avatar-fallback';
      fallback.textContent = profile.avatarFallbackText || profile.name?.substring(0, 2).toUpperCase() || 'DA';
      avatarWrapper.appendChild(fallback);
    };
    avatarWrapper.appendChild(img);
  } else {
    const fallback = document.createElement('div');
    fallback.className = 'avatar-fallback';
    fallback.textContent = profile.avatarFallbackText || 'DA';
    avatarWrapper.appendChild(fallback);
  }
  card.appendChild(avatarWrapper);

  // Status Badge
  if (profile.status?.available) {
    const badge = document.createElement('span');
    badge.className = 'status-badge';
    badge.textContent = profile.status.badge || '🟢 Disponible';
    card.appendChild(badge);
  }

  // Name
  const nameEl = document.createElement('h1');
  nameEl.className = 'profile-name';
  nameEl.textContent = profile.name || '';
  card.appendChild(nameEl);

  // Title
  if (profile.title) {
    const titleEl = document.createElement('h2');
    titleEl.className = 'profile-title';
    titleEl.textContent = profile.title;
    card.appendChild(titleEl);
  }

  // Company & Location
  const companyParts = [profile.company, profile.location].filter(Boolean).join(' • ');
  if (companyParts) {
    const companyEl = document.createElement('p');
    companyEl.className = 'profile-company';
    companyEl.textContent = companyParts;
    card.appendChild(companyEl);
  }

  // Bio
  if (profile.bio) {
    const bioEl = document.createElement('p');
    bioEl.className = 'profile-bio';
    bioEl.textContent = profile.bio;
    card.appendChild(bioEl);
  }

  container.appendChild(card);
}

/**
 * Render Quick Action Buttons
 */
function renderQuickActions(actions) {
  const container = document.getElementById('quickActionsContainer');
  if (!container || !Array.isArray(actions)) return;
  container.innerHTML = '';

  actions.forEach(action => {
    const card = document.createElement('a');
    card.className = `action-card ${action.featured ? 'featured' : ''}`;
    card.href = sanitizeUrl(resolveActionUrl(action));
    card.target = action.type === 'link' ? '_blank' : '_self';
    if (card.target === '_blank') card.rel = 'noopener noreferrer';
    card.setAttribute('aria-label', `${action.label}: ${action.sublabel || ''}`);
    card.addEventListener('click', () => triggerHaptic(15));

    // Icon Box
    const iconBox = document.createElement('div');
    iconBox.className = 'action-icon-box';
    iconBox.innerHTML = SVG_ICONS[action.type] || SVG_ICONS.link;
    card.appendChild(iconBox);

    // Text Group
    const textGroup = document.createElement('div');
    textGroup.className = 'action-text-group';

    const label = document.createElement('span');
    label.className = 'action-label';
    label.textContent = action.label;
    textGroup.appendChild(label);

    if (action.sublabel) {
      const sub = document.createElement('span');
      sub.className = 'action-sublabel';
      sub.textContent = action.sublabel;
      textGroup.appendChild(sub);
    }
    card.appendChild(textGroup);

    // Chevron
    const chevronBox = document.createElement('div');
    chevronBox.className = 'action-chevron';
    chevronBox.innerHTML = SVG_ICONS.chevron;
    card.appendChild(chevronBox);

    container.appendChild(card);
  });
}

/**
 * Render Social & Professional Links
 */
function renderSocialGrid(socialLinks) {
  const container = document.getElementById('socialGridContainer');
  if (!container || !Array.isArray(socialLinks)) return;
  container.innerHTML = '';

  socialLinks.forEach(item => {
    const card = document.createElement('a');
    card.className = 'social-card';
    card.href = sanitizeUrl(item.url);
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.setAttribute('aria-label', `${item.name}: ${item.username || ''}`);
    card.addEventListener('click', () => triggerHaptic(15));

    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'social-icon-wrapper';
    iconWrapper.innerHTML = SVG_ICONS[item.id] || SVG_ICONS.link;
    card.appendChild(iconWrapper);

    const meta = document.createElement('div');
    meta.className = 'social-meta';

    const name = document.createElement('span');
    name.className = 'social-name';
    name.textContent = item.name;
    meta.appendChild(name);

    if (item.username) {
      const handle = document.createElement('span');
      handle.className = 'social-handle';
      handle.textContent = item.username;
      meta.appendChild(handle);
    }

    card.appendChild(meta);
    container.appendChild(card);
  });
}

/**
 * Helper to determine client profile from URL parameter (?u=client-slug or #client-slug)
 */
function getProfileSlug() {
  try {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('u') || params.get('client') || params.get('id');
    if (slug && /^[a-zA-Z0-9_-]+$/.test(slug)) {
      return slug;
    }
    if (window.location.hash && window.location.hash.length > 1) {
      const hashSlug = window.location.hash.substring(1).split('?')[0];
      if (/^[a-zA-Z0-9_-]+$/.test(hashSlug)) return hashSlug;
    }
  } catch (_) {}
  return null;
}

/**
 * Initialize Web App & Fetch Config (Supports Multi-Tenant Clients)
 */
async function initApp() {
  const currentSlug = getProfileSlug();
  const candidates = currentSlug 
    ? [`profiles/${currentSlug}.json`, `config.json`, `profiles/default.json`]
    : ['config.json', 'profiles/default.json'];

  let loadedConfig = null;
  let lastError = null;

  for (const url of candidates) {
    try {
      const response = await fetch(`${url}?v=${Date.now()}`, { cache: 'no-cache' });
      if (response.ok) {
        loadedConfig = await response.json();
        break;
      }
    } catch (err) {
      lastError = err;
    }
  }

  if (!loadedConfig) {
    console.error('Error al inicializar la tarjeta de presentación:', lastError);
    const container = document.getElementById('profileHeaderContainer');
    if (container) {
      container.innerHTML = `
        <div class="error-banner">
          <strong>Aviso de Sistema:</strong> No se pudo cargar el perfil <code>${currentSlug || 'principal'}</code>. Verifique que exista en <code>profiles/</code>.
        </div>
      `;
    }
    return;
  }

  appConfig = loadedConfig;

  // Apply dynamic client theme accent if specified
  if (appConfig.settings?.accentColor) {
    document.documentElement.style.setProperty('--accent-primary', appConfig.settings.accentColor);
  }
  if (appConfig.settings?.accentGlow) {
    document.documentElement.style.setProperty('--accent-glow', appConfig.settings.accentGlow);
  }

  // Render components
  renderProfile(appConfig.profile || {});
  renderQuickActions(appConfig.quickActions || []);
  renderSocialGrid(appConfig.socialLinks || []);

  // Custom Footer Text with Admin link
  const footer = document.getElementById('footerText');
  if (footer) {
    const text = appConfig.settings?.footerText || '© 2026 Tarjeta Digital Profesional';
    const adminUrl = currentSlug ? `admin.html?u=${encodeURIComponent(currentSlug)}` : 'admin.html';
    footer.innerHTML = `${text} • <a href="${adminUrl}" style="color:var(--text-dim);text-decoration:none;font-size:0.85em;" title="Gestionar esta tarjeta">⚙️ Editar</a>`;
  }

  // NFC badge text
  const badgeText = document.getElementById('nfcBadgeText');
  if (badgeText && appConfig.settings?.nfcBadgeText) {
    badgeText.textContent = appConfig.settings.nfcBadgeText;
  }

  // Dynamic document title
  if (appConfig.profile?.name) {
    document.title = `${appConfig.profile.name} | Tarjeta de Presentación Digital`;
  }
}

// Bind Global UI Listeners once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Main Action: Save vCard
  const btnSaveContact = document.getElementById('btnSaveContact');
  if (btnSaveContact) {
    btnSaveContact.addEventListener('click', downloadVCard);
  }

  // Quick Share Button
  const btnShare = document.getElementById('btnShare');
  if (btnShare) {
    btnShare.addEventListener('click', handleShareAction);
  }

  // Close Modal Buttons
  const btnCloseModal = document.getElementById('btnCloseModal');
  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', closeShareModal);
  }

  const shareModal = document.getElementById('shareModal');
  if (shareModal) {
    shareModal.addEventListener('click', (e) => {
      if (e.target === shareModal) closeShareModal();
    });
  }

  // Copy Link Button
  const btnCopyLink = document.getElementById('btnCopyLink');
  if (btnCopyLink) {
    btnCopyLink.addEventListener('click', copyCardLink);
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeShareModal();
  });

  // Register Service Worker for offline resilience (PWA/NFC)
  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  // Run initial loading
  initApp();
});
