const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const getHotels = () => apiFetch('/api/public/tenants')

export const getRooms = (slug, checkIn, checkOut) => {
  const p = new URLSearchParams()
  if (checkIn)  p.set('checkIn',  checkIn)
  if (checkOut) p.set('checkOut', checkOut)
  const qs = p.toString() ? `?${p}` : ''
  return apiFetch(`/api/public/${slug}/rooms${qs}`)
}

export const submitEnquiry = (payload) =>
  apiFetch('/api/public/enquiries', { method: 'POST', body: JSON.stringify(payload) })

export const lookupEnquiry = (phone, enquiryNumber) =>
  apiFetch('/api/public/enquiries/lookup', {
    method: 'POST',
    body: JSON.stringify({ phone, enquiryNumber }),
  })

export const cancelEnquiry = (id, phone) =>
  apiFetch(`/api/public/enquiries/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ phone }),
  })
