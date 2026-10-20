#!/usr/bin/env node
/**
 * AUTONOMOUS CLIENT PROVISIONING ENGINE
 * Usage:
 *   node provision.js --id "cliente-slug" --name "Nombre Cliente" --title "Cargo" --company "Empresa" --phone "+57300..." --whatsapp "57300..." --email "correo@..."
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function parseArgs() {
  const args = process.argv.slice(2);
  const params = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.replace(/^--/, '');
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        params[key] = next;
        i++;
      } else {
        params[key] = true;
      }
    }
  }
  return params;
}

const args = parseArgs();

if (!args.name) {
  console.log(`
--- MOTOR AUTÓNOMO DE APROVISIONAMIENTO DE CLIENTES IDCARD ---
Uso:
  node provision.js --id "slug-cliente" --name "Nombre Completo" [opciones]

Opciones:
  --id         Identificador único en la URL (ej. juan-perez) [Requerido]
  --name       Nombre y Apellidos del cliente [Requerido]
  --title      Cargo o Profesión
  --company    Nombre de la empresa
  --location   Ciudad, País
  --phone      Teléfono con prefijo internacional (+57...)
  --whatsapp   WhatsApp con código de país sin + (ej. 57300...)
  --email      Correo electrónico
  --website    URL de su portafolio o empresa
  --linkedin   Usuario o URL de LinkedIn
  --accent     Color hexadecimal (ej. #06b6d4, #10b981, #6366f1)
  --no-push    Crea el archivo sin hacer git push automático
`);
  process.exit(0);
}

// Normalize ID / Slug
const rawId = args.id || args.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
const slug = rawId.replace(/^-|-$/g, '');

const name = args.name.trim();
const title = args.title || 'Profesional';
const company = args.company || '';
const location = args.location || 'Colombia';
const phone = args.phone || '';
const whatsapp = args.whatsapp ? String(args.whatsapp).replace(/\D/g, '') : (phone ? phone.replace(/\D/g, '') : '');
const email = args.email || '';
const website = args.website || '';
const linkedin = args.linkedin || '';
const accentColor = args.accent || '#6366f1';

const quickActions = [];
if (whatsapp) {
  quickActions.push({
    id: "whatsapp",
    type: "whatsapp",
    label: "WhatsApp Directo",
    sublabel: "Atención inmediata",
    value: whatsapp,
    message: `Hola ${name.split(' ')[0]}, vi tu tarjeta NFC y quiero contactarte.`,
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
    label: "Portal Web",
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

const newProfile = {
  profile: {
    name: name,
    prefix: args.prefix || "",
    pronouns: args.pronouns || "",
    title: title,
    company: company,
    location: location,
    avatar: args.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e293b&color=f8fafc&size=400&bold=true`,
    avatarFallbackText: name.substring(0, 2).toUpperCase(),
    status: {
      available: true,
      badge: "🟢 Disponible para Contacto"
    },
    bio: args.bio || `Tarjeta de presentación profesional de ${name}.`
  },
  quickActions: quickActions,
  socialLinks: socialLinks,
  vcard: {
    firstName: name.split(' ')[0] || '',
    lastName: name.split(' ').slice(1).join(' ') || '',
    organization: company,
    title: title,
    phone: phone || (whatsapp ? `+${whatsapp}` : ''),
    email: email,
    website: website,
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
    footerText: `© 2026 ${name} • Powered by IdCard Services`
  }
};

const profilesDir = path.join(__dirname, 'profiles');
if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir, { recursive: true });
}

const targetPath = path.join(profilesDir, `${slug}.json`);
fs.writeFileSync(targetPath, JSON.stringify(newProfile, null, 2), 'utf8');
console.log(`[OK] Perfil generado: profiles/${slug}.json`);

// Automatically push to GitHub if not disabled
if (!args['no-push']) {
  try {
    console.log('[...] Sincronizando con GitHub origin main...');
    execSync(`git add profiles/${slug}.json`, { stdio: 'pipe' });
    execSync(`git commit -m "feat(client): provision digital card for ${name} (${slug})"`, { stdio: 'pipe' });
    execSync('git push origin main', { stdio: 'pipe' });
    console.log('[OK] Cambios publicados a GitHub.');
  } catch (err) {
    console.warn('[AVISO] No se pudo hacer push automático (verifique conexión o credenciales):', err.message);
  }
}

const publicNfcUrl = `https://kappsular.github.io/idCard/?u=${slug}`;
const adminUrl = `https://kappsular.github.io/idCard/admin.html?u=${slug}`;

console.log(`
============================================================
🎉 CLIENTE APROVISIONADO EXITOSAMENTE
============================================================
Cliente:           ${name} (${title} - ${company})
Identificador:     ${slug}

📲 Enlace para Grabar en Tag NFC / QR:
   👉 ${publicNfcUrl}

⚙️ Enlace del Panel de Auto-Gestión del Cliente:
   👉 ${adminUrl}
============================================================
`);
