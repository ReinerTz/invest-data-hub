// Função de utilidade para converter string para número
function parseNumberFromString(s: string): number {
  // Primeiro, removemos caracteres não numéricos exceto vírgula e ponto
  let cleaned = s.replace(/[^0-9,.-]+/g, '');

  // Detectamos se o número usa vírgula para decimais ou milhares
  if (cleaned.match(/,\d{2}$/)) {
    // Caso europeu: vírgula usada para decimais (ex: 1.234,56)
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else {
    // Caso de vírgula como separador de milhar (ex: 1,234.56 ou 1,234)
    cleaned = cleaned.replace(/,/g, '');
  }

  return parseFloat(cleaned) || 0; // Retorna 0 se o resultado não for um número
}

export { parseNumberFromString };
