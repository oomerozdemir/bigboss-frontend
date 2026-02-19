/**
 * Fiyatı Türk sayı formatında biçimlendirir.
 * Örnek: 11249 → "11.249,00"  |  149.9 → "149,90"
 *
 * @param {number|string} value - Biçimlendirilecek sayısal değer
 * @returns {string} Biçimlendirilmiş fiyat metni (örn. "11.249,00")
 */
export const formatPrice = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return '0,00';
  return num.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
