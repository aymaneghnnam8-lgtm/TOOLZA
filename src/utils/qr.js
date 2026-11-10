function escapeVCard(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

export function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function normalizeHex(value) {
  const raw = String(value || '').trim();
  const full = raw.match(/^#?([0-9a-fA-F]{6})$/);
  if (full) return `#${full[1].toUpperCase()}`;
  const short = raw.match(/^#?([0-9a-fA-F]{3})$/);
  if (!short) return null;
  const [r, g, b] = short[1].split('');
  return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
}

export function colorsAreClose(first, second) {
  const distance = Math.abs(luminance(first) - luminance(second));
  return distance < 48;
}

function luminance(hex) {
  const value = Number.parseInt(hex.slice(1), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function buildVCard(contact) {
  const first = contact.firstName.trim();
  const last = contact.lastName.trim();
  const phone = contact.phone.trim();
  const email = contact.email.trim();
  const organization = contact.organization.trim();
  const website = contact.website.trim();
  if (![first, last, phone, email, organization, website].some(Boolean)) return '';

  const full = [first, last].filter(Boolean).join(' ') || 'Contact';
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escapeVCard(last)};${escapeVCard(first)};;;`,
    `FN:${escapeVCard(full)}`,
  ];
  if (phone) lines.push(`TEL;TYPE=CELL:${escapeVCard(phone)}`);
  if (email) lines.push(`EMAIL:${escapeVCard(email)}`);
  if (organization) lines.push(`ORG:${escapeVCard(organization)}`);
  if (website) lines.push(`URL:${escapeVCard(normalizeUrl(website))}`);
  lines.push('END:VCARD');
  return lines.join('\n');
}
