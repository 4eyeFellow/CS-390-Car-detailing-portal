// Small display helpers shared by pages.

// 16000 -> "$160.00" (the database stores prices in cents)
export function formatPrice(cents) {
  return ((cents ?? 0) / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

// Database timestamp -> "Nov 10, 2026, 10:00 AM" in Evansville time
export function formatDateTime(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
