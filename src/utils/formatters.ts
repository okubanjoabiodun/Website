export function formatNaira(amount: number | null | undefined, priceOnRequest = false): string {
  if (priceOnRequest || amount === null || amount === undefined) {
    return 'Price on Request';
  }
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(amount).replace('NGN', '₦');
}

export function buildWhatsAppLink(
  whatsappNumber: string | undefined,
  params: {
    product?: string;
    size?: string;
    quantity?: string | number;
    deliveryLocation?: string;
    customNote?: string;
  }
): string {
  const cleanNumber = (whatsappNumber || '').replace(/[^0-9]/g, '');
  
  const text = [
    'Hello Toysn Wood and Super Cakes, I am interested in:',
    `Product: ${params.product || 'Wood Materials / Cake'}`,
    `Size: ${params.size || 'Standard'}`,
    `Quantity: ${params.quantity || '1'}`,
    `Delivery location: ${params.deliveryLocation || 'To be specified'}`,
    params.customNote ? `\nNote: ${params.customNote}` : '',
    '\nPlease send me the current price.'
  ].filter(Boolean).join('\n');

  if (!cleanNumber) {
    // Return a direct wa.me link with text ready or fallback
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

export function getCleanSocialUrl(platform: 'facebook' | 'instagram' | 'tiktok', value: string): string {
  if (!value) return '#';
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  const username = value.replace(/^@/, '').trim();
  switch (platform) {
    case 'facebook':
      return `https://facebook.com/${username}`;
    case 'instagram':
      return `https://instagram.com/${username}`;
    case 'tiktok':
      return `https://tiktok.com/@${username}`;
    default:
      return '#';
  }
}
