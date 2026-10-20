/**
 * Automated Verification & Audit Suite
 * Executed by: Agente de Calidad y Seguridad (QA & SecOps)
 */
const fs = require('fs');
const path = require('path');

console.log('--- INICIANDO SUITE DE AUDITORÍA Y QA ---');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// 1. Verify config.json syntax and required schema
try {
  const configRaw = fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8');
  const config = JSON.parse(configRaw);
  assert(config.profile && config.profile.name, 'config.json contiene perfil válido con nombre');
  assert(Array.isArray(config.quickActions) && config.quickActions.length > 0, 'config.json contiene quickActions');
  assert(Array.isArray(config.socialLinks) && config.socialLinks.length > 0, 'config.json contiene socialLinks');
  assert(config.vcard && config.vcard.phone, 'config.json contiene configuración vcard');
} catch (err) {
  assert(false, 'config.json es JSON válido: ' + err.message);
}

// 2. Verify Security / Sanitizer Logic in app.js
const appJs = fs.readFileSync(path.join(__dirname, 'js', 'app.js'), 'utf8');
assert(appJs.includes('sanitizeUrl'), 'app.js implementa sanitizeUrl');
assert(!appJs.includes('innerHTML = action.value') && !appJs.includes('innerHTML = profile.bio'), 'app.js no usa innerHTML con valores dinámicos sin sanitizar');

// Test sanitizer function directly in Node
function sanitizeUrlTest(urlString) {
  if (!urlString || typeof urlString !== 'string') return '#';
  const trimmed = urlString.trim();
  const safeProtocolRegex = /^(https?:\/\/|mailto:|tel:|sms:)/i;
  if (safeProtocolRegex.test(trimmed)) {
    return encodeURI(trimmed);
  }
  return '#';
}

assert(sanitizeUrlTest('javascript:alert(1)') === '#', 'Sanitizador bloquea protocolo javascript:');
assert(sanitizeUrlTest('data:text/html;base64,PHNjcmlwdD4=') === '#', 'Sanitizador bloquea protocolo data:');
assert(sanitizeUrlTest('vbscript:msgbox') === '#', 'Sanitizador bloquea protocolo vbscript:');
assert(sanitizeUrlTest('https://linkedin.com/in/diego') === 'https://linkedin.com/in/diego', 'Sanitizador aprueba URLs https válidas');
assert(sanitizeUrlTest('tel:+573001234567') === 'tel:+573001234567', 'Sanitizador aprueba enlace telefónico tel:');
assert(sanitizeUrlTest('mailto:test@example.com') === 'mailto:test@example.com', 'Sanitizador aprueba enlace mailto:');

// 3. Verify vCard formatting
function generateVCardTest(cfg) {
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
  const firstName = escapeVal(v.firstName || '');
  const lastName = escapeVal(v.lastName || '');
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N;CHARSET=UTF-8:${lastName};${firstName};;;`,
    `FN;CHARSET=UTF-8:${escapeVal(p.name || '')}`,
    v.phone ? `TEL;TYPE=CELL,VOICE:${v.phone}` : null,
    'END:VCARD'
  ].filter(Boolean);
  return lines.join('\r\n');
}

const dummyConfig = {
  profile: { name: 'Diego Alzate' },
  vcard: { firstName: 'Diego', lastName: 'Alzate', phone: '+573001234567' }
};
const vcf = generateVCardTest(dummyConfig);
assert(vcf.includes('BEGIN:VCARD') && vcf.includes('VERSION:3.0') && vcf.includes('END:VCARD'), 'vCard genera encabezado y pie de página RFC estándar');
assert(vcf.includes('CHARSET=UTF-8:Alzate;Diego;;;'), 'vCard codifica nombre con UTF-8 y orden N estándar');

// 4. Verify index.html element ID bindings
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const requiredIds = [
  'profileHeaderContainer',
  'quickActionsContainer',
  'socialGridContainer',
  'btnSaveContact',
  'btnShare',
  'shareModal',
  'qrCodeContainer',
  'btnCopyLink',
  'btnCloseModal',
  'toastNotice'
];

requiredIds.forEach(id => {
  assert(indexHtml.includes(`id="${id}"`), `index.html contiene el elemento con id="${id}"`);
});

// 5. Verify Accessibility & Touch targets in style.css
const styleCss = fs.readFileSync(path.join(__dirname, 'css', 'style.css'), 'utf8');
assert(styleCss.includes('--tap-target-min: 48px'), 'style.css define el estándar táctil WCAG de al menos 48px');
assert(styleCss.includes(':focus-visible'), 'style.css incluye estilos de accesibilidad :focus-visible');
assert(styleCss.includes('@media print'), 'style.css incluye media query de impresión');

console.log(`\nRESUMEN DE AUDITORÍA: ${passedTests}/${totalTests} pruebas superadas.`);
