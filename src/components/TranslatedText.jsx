import { useAutoTranslate } from '../hooks/useAutoTranslate';

/**
 * map() ve benzeri döngüler içinde hook kullanabilmek için wrapper bileşen.
 * Otomatik olarak Arapça çeviri uygular, diğer dillerde orijinali gösterir.
 *
 * Kullanım:
 *   <TranslatedText text={category.name} />
 *   <TranslatedText text={product.name} fallback="Ürün Adı" />
 */
const TranslatedText = ({ text, fallback = '' }) => {
  const translated = useAutoTranslate(text || fallback);
  return <>{translated || fallback || text}</>;
};

export default TranslatedText;
