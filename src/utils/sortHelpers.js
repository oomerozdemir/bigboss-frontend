export const sortVariantsByOrder = (variants) => {
  // Standart bedenlerin sıralama puanları
  const sizeOrder = {
    "XXS": 1, "XS": 2, "S": 3, "M": 4, "L": 5, "XL": 6, "XXL": 7, 
    "2XL": 8, "3XL": 9, "4XL": 10, "5XL": 11, "STD": 99, "STANDART": 99
  };

  return [...variants].sort((a, b) => {
    const sizeA = a.size.toUpperCase().trim();
    const sizeB = b.size.toUpperCase().trim();

    // 1. İkisi de bilinen harf beden ise (S, M, L...)
    if (sizeOrder[sizeA] && sizeOrder[sizeB]) {
      return sizeOrder[sizeA] - sizeOrder[sizeB];
    }

    // 2. İkisi de sayı ise (36, 38, 40...)
    const numA = parseInt(sizeA.replace(/\D/g, '')); // Sadece sayıları al
    const numB = parseInt(sizeB.replace(/\D/g, ''));

    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB; // Küçükten büyüğe sayısal sıralama
    }

    // 3. Biri sayı biri harf ise? (Genelde olmaz ama)
    if (!isNaN(numA) && sizeOrder[sizeB]) return 1; // Sayılar sonda olsun
    if (sizeOrder[sizeA] && !isNaN(numB)) return -1;

    // 4. Hiçbiri değilse alfabetik sırala
    return sizeA.localeCompare(sizeB);
  });
};