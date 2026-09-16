// formatCurrency(numero) usando Intl.NumberFormat
const formatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
});

export function formatCurrency(numero) {
  return formatter.format(Number(numero) || 0);
}