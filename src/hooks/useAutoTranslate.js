import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Sayfa yenilenene kadar çevirileri bellekte tutan cache
const memoryCache = {};

const MAX_CHARS = 450; // MyMemory ücretsiz API limiti

const translateChunk = async (text) => {
  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=tr|ar`
  );
  const data = await res.json();
  const translated = data.responseData?.translatedText;
  // MyMemory bazen "MYMEMORY WARNING" döner, bunu filtrele
  if (!translated || translated.startsWith('MYMEMORY WARNING')) return text;
  return translated;
};

const translateText = async (text) => {
  if (!text || typeof text !== 'string') return text;
  const trimmed = text.trim();
  if (!trimmed) return text;

  // Kısa metinler doğrudan çevrilir
  if (trimmed.length <= MAX_CHARS) {
    return translateChunk(trimmed);
  }

  // Uzun metinler cümlelere bölünür
  const sentences = trimmed.match(/[^.!?\n]+[.!?\n]*/g) || [trimmed];
  const chunks = [];
  let current = '';

  for (const sentence of sentences) {
    if ((current + sentence).length > MAX_CHARS) {
      if (current) chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current) chunks.push(current.trim());

  const translated = await Promise.all(chunks.map(translateChunk));
  return translated.join(' ');
};

/**
 * Tek bir metin için otomatik çeviri hook'u.
 * Dil 'ar' ise MyMemory API ile Türkçe → Arapça çevirir.
 * Çeviriler bellek cache'inde saklanır (sayfa yenilenene kadar geçerli).
 */
export const useAutoTranslate = (text) => {
  const { i18n } = useTranslation();
  const [result, setResult] = useState(text);

  useEffect(() => {
    // Dil değişince veya metin değişince orijinale sıfırla
    setResult(text);

    if (i18n.language !== 'ar' || !text || typeof text !== 'string') return;

    const trimmed = text.trim();
    if (!trimmed) return;

    // Cache kontrolü
    if (memoryCache[trimmed] !== undefined) {
      setResult(memoryCache[trimmed]);
      return;
    }

    // API çağrısı
    translateText(trimmed)
      .then((translated) => {
        memoryCache[trimmed] = translated;
        setResult(translated);
      })
      .catch(() => {
        // Hata olursa orijinali koru, tekrar deneme
        memoryCache[trimmed] = trimmed;
      });
  }, [text, i18n.language]);

  return result;
};

export default useAutoTranslate;
