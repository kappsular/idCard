/**
 * ADMIN CONTROLLER - MOBILE SELF-MANAGEMENT
 * Handles photo downscaling, form binding, live preview & multi-tenant profile saving
 */

'use strict';

let currentSlug = 'default';
let currentConfig = null;
let newAvatarBase64 = null;

function showToast(msg) {
  const t = document.getElementById('adminToast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

function getSlugFromUrl() {
  const p = new URLSearchParams(window.location.search);
  const s = p.get('u') || p.get('client') || p.get('id');
  if (s && /^[a-zA-Z0-9_-]+$/.test(s)) return s;
  if (window.location.hash && window.location.hash.length > 1) {
    const hs = window.location.hash.substring(1).split('?')[0];
    if (/^[a-zA-Z0-9_-]+$/.test(hs)) return hs;
  }
  return 'default';
}

/**
 * Resize and compress smartphone camera photos on the client side
 * Uses HTML5 Canvas to produce an ultra-crisp 400x400 JPEG/WebP under 50KB
 */
function processImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const targetSize = 400;
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');

        // Center cover crop
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;

        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, targetSize, targetSize);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.86);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Load existing profile configuration
 */
async function loadProfile() {
  currentSlug = getSlugFromUrl();
  
  const badge = document.getElementById('clientSlugBadge');
  if (badge) badge.textContent = `Perfil: ${currentSlug}`;

  const btnView = document.getElementById('btnViewCard');
  if (btnView) {
    btnView.href = currentSlug === 'default' ? 'index.html' : `index.html?u=${encodeURIComponent(currentSlug)}`;
  }

  // Check local draft first
  const localDraft = localStorage.getItem(`draft_${currentSlug}`);
  if (localDraft) {
    try {
      currentConfig = JSON.parse(localDraft);
      populateForm(currentConfig);
      return;
    } catch (_) {}
  }

  // Fetch from server / GitHub Pages
  const candidates = [
    `profiles/${currentSlug}.json`,
    `config.json`,
    `profiles/default.json`
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(`${url}?v=${Date.now()}`);
      if (res.ok) {
        currentConfig = await res.json();
        populateForm(currentConfig);
        return;
      }
    } catch (_) {}
  }

  // Fallback empty template
  currentConfig = {
    profile: { name: '', title: '', company: '', bio: '', avatar: '' },
    quickActions: [],
    socialLinks: [],
    vcard: {},
    settings: { accentColor: '#6366f1' }
  };
  populateForm(currentConfig);
}

/**
 * Populate Form Fields from Config
 */
function populateForm(cfg) {
  const p = cfg.profile || {};
  const s = cfg.settings || {};

  document.getElementById('inpName').value = p.name || '';
  document.getElementById('inpTitle').value = p.title || '';
  document.getElementById('inpCompany').value = p.company || '';
  document.getElementById('inpLocation').value = p.location || '';
  document.getElementById('inpBio').value = p.bio || '';
  document.getElementById('inpBadge').value = p.status?.badge || '';

  // Avatar
  const avatarImg = document.getElementById('avatarPreview');
  if (avatarImg) {
    avatarImg.src = newAvatarBase64 || p.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=480&q=80';
  }

  // Quick reach
  const actions = cfg.quickActions || [];
  const wa = actions.find(a => a.type === 'whatsapp');
  const ph = actions.find(a => a.type === 'phone');
  const em = actions.find(a => a.type === 'email');
  const web = actions.find(a => a.type === 'link');

  document.getElementById('inpWhatsApp').value = wa ? wa.value : '';
  document.getElementById('inpPhone').value = ph ? ph.value : '';
  document.getElementById('inpEmail').value = em ? em.value : '';
  document.getElementById('inpWebsite').value = web ? web.value : '';

  // Social
  const socials = cfg.socialLinks || [];
  const li = socials.find(x => x.id === 'linkedin');
  const cal = socials.find(x => x.id === 'calendar');

  document.getElementById('inpLinkedIn').value = li ? li.url : '';
  document.getElementById('inpCalendar').value = cal ? cal.url : '';

  // Accent
  if (s.accentColor) {
    document.getElementById('inpAccentColor').value = s.accentColor;
  }
}

/**
 * Extract Form Fields into Structured JSON
 */
function extractFormData() {
  const name = document.getElementById('inpName').value.trim();
  const title = document.getElementById('inpTitle').value.trim();
  const company = document.getElementById('inpCompany').value.trim();
  const location = document.getElementById('inpLocation').value.trim();
  const bio = document.getElementById('inpBio').value.trim();
  const badge = document.getElementById('inpBadge').value.trim();
  const whatsapp = document.getElementById('inpWhatsApp').value.trim().replace(/\D/g, '');
  const phone = document.getElementById('inpPhone').value.trim();
  const email = document.getElementById('inpEmail').value.trim();
  const website = document.getElementById('inpWebsite').value.trim();
  const linkedin = document.getElementById('inpLinkedIn').value.trim();
  const calendar = document.getElementById('inpCalendar').value.trim();
  const accentColor = document.getElementById('inpAccentColor').value;

  const quickActions = [];
  if (whatsapp) {
    quickActions.push({
      id: "whatsapp",
      type: "whatsapp",
      label: "WhatsApp Directo",
      sublabel: "Respuesta inmediata",
      value: whatsapp,
      message: `Hola ${name.split(' ')[0]}, vi tu tarjeta digital NFC y me gustaría conectar contigo.`,
      featured: true
    });
  }
  if (phone) {
    quickActions.push({
      id: "phone",
      type: "phone",
      label: "Llamada Móvil",
      sublabel: phone,
      value: phone
    });
  }
  if (email) {
    quickActions.push({
      id: "email",
      type: "email",
      label: "Correo Electrónico",
      sublabel: email,
      value: email,
      subject: "Contacto Profesional vía Tarjeta Digital"
    });
  }
  if (website) {
    quickActions.push({
      id: "website",
      type: "link",
      label: "Portafolio & Web",
      sublabel: website.replace(/^https?:\/\//, ''),
      value: website
    });
  }

  const socialLinks = [];
  if (linkedin) {
    socialLinks.push({
      id: "linkedin",
      name: "LinkedIn",
      url: linkedin.startsWith('http') ? linkedin : `https://linkedin.com/in/${linkedin.replace('@', '')}`,
      username: linkedin.includes('/') ? linkedin.split('/').pop() : linkedin
    });
  }
  if (calendar) {
    socialLinks.push({
      id: "calendar",
      name: "Agendar Cita",
      url: calendar,
      username: "30 min de reunión"
    });
  }

  const updatedConfig = {
    profile: {
      name: name || 'Mi Nombre',
      prefix: currentConfig?.profile?.prefix || '',
      pronouns: currentConfig?.profile?.pronouns || '',
      title: title || 'Profesional Independiente',
      company: company || '',
      location: location || '',
      avatar: newAvatarBase64 || currentConfig?.profile?.avatar || '',
      avatarFallbackText: name ? name.substring(0, 2).toUpperCase() : 'ID',
      status: {
        available: Boolean(badge),
        badge: badge || '🟢 Disponible'
      },
      bio: bio || ''
    },
    quickActions: quickActions,
    socialLinks: socialLinks,
    vcard: {
      firstName: name.split(' ')[0] || '',
      lastName: name.split(' ').slice(1).join(' ') || '',
      organization: company || '',
      title: title || '',
      phone: phone || (whatsapp ? `+${whatsapp}` : ''),
      email: email || '',
      website: website || '',
      address: {
        city: location.split(',')[0]?.trim() || '',
        country: location.split(',')[1]?.trim() || ''
      },
      note: "Contacto verificado mediante Tarjeta Digital NFC."
    },
    settings: {
      theme: "dark-elite",
      accentColor: accentColor,
      accentGlow: `${accentColor}55`,
      enableHaptics: true,
      enableShareModal: true,
      nfcBadgeText: "NFC & Quick Share Ready",
      footerText: `© 2026 ${name || 'IdCard'} • Powered by IdCard Services`
    }
  };

  return updatedConfig;
}

/**
 * Save Action
 */
function saveAllChanges() {
  const data = extractFormData();
  currentConfig = data;

  // Persist locally
  localStorage.setItem(`draft_${currentSlug}`, JSON.stringify(data));
  showToast('✅ ¡Cambios guardados localmente!');

  // Refresh preview iframe if visible
  const iframe = document.getElementById('previewIframe');
  if (iframe) {
    const targetUrl = currentSlug === 'default' ? 'index.html' : `index.html?u=${encodeURIComponent(currentSlug)}`;
    iframe.src = `${targetUrl}?preview=1&v=${Date.now()}`;
  }
}

/**
 * Export JSON Download
 */
function exportJsonFile() {
  const data = extractFormData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = currentSlug === 'default' ? 'config.json' : `${currentSlug}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  showToast('📥 Archivo JSON descargado');
}

// Bind DOM Listeners
document.addEventListener('DOMContentLoaded', () => {
  loadProfile();

  // Avatar picker
  const avatarWrapper = document.getElementById('avatarWrapper');
  const fileInput = document.getElementById('fileAvatarInput');
  if (avatarWrapper && fileInput) {
    avatarWrapper.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          newAvatarBase64 = await processImageFile(file);
          document.getElementById('avatarPreview').src = newAvatarBase64;
          showToast('📸 Fotografía optimizada');
        } catch (err) {
          showToast('⚠️ Error al procesar imagen');
        }
      }
    });
  }

  // Tabs
  const tabForm = document.getElementById('tabForm');
  const tabPreview = document.getElementById('tabPreview');
  const viewForm = document.getElementById('viewForm');
  const viewPreview = document.getElementById('viewPreview');
  const iframe = document.getElementById('previewIframe');

  if (tabForm && tabPreview) {
    tabForm.addEventListener('click', () => {
      tabForm.classList.add('active');
      tabPreview.classList.remove('active');
      viewForm.style.display = 'block';
      viewPreview.style.display = 'none';
    });

    tabPreview.addEventListener('click', () => {
      tabPreview.classList.add('active');
      tabForm.classList.remove('active');
      viewForm.style.display = 'none';
      viewPreview.style.display = 'block';
      const targetUrl = currentSlug === 'default' ? 'index.html' : `index.html?u=${encodeURIComponent(currentSlug)}`;
      iframe.src = `${targetUrl}?v=${Date.now()}`;
    });
  }

  // Buttons
  const btnSave = document.getElementById('btnSaveAll');
  if (btnSave) btnSave.addEventListener('click', saveAllChanges);

  const btnExport = document.getElementById('btnExportJson');
  if (btnExport) btnExport.addEventListener('click', exportJsonFile);
});
