import { render } from 'mustache';
import { translationAssets } from './translations';

interface SupportedTranslationAssets {
  EN: string;
  DE: string;
  ES: string;
  FR: string;
  PT: string;
  CZ: string;
}

export class TranslationsService {
  private readonly language: string;

  constructor(lang: string) {
    if (
      lang !== 'en' &&
      lang !== 'de' &&
      lang !== 'es' &&
      lang !== 'fr' &&
      lang !== 'pt' &&
      lang !== 'cz'
    ) {
      throw new Error(`Language ${lang} not supported`);
    }
    this.language = lang;
  }

  private assets = new Map<
    string,
    Record<'en' | 'de' | 'es' | 'fr' | 'pt' | 'cz', string>
  >();

  setAsset(key: string, value: SupportedTranslationAssets) {
    this.assets.set(key, {
      en: value.EN,
      de: value.DE,
      es: value.ES,
      fr: value.FR,
      pt: value.PT,
      cz: value.CZ,
    });
  }

  get(key): string {
    const asset = this.assets.get(key);
    if (asset) {
      return asset[this.language];
    } else {
      throw new Error(`Asset with key ${key} not found}`);
    }
  }

  getLanguageCountry(): string {
    switch (this.language) {
      case 'en':
        return 'Great Britain';
      case 'de':
        return 'Germany';
      case 'es':
        return 'Spain';
      case 'fr':
        return 'France';
      case 'pt':
        return 'Portugal';
      case 'cz':
        return 'Czech Republic';
      default:
        return 'Germany';
    }
  }

  getLanguageName(): string {
    switch (this.language) {
      case 'en':
        return 'English UK';
      case 'de':
        return 'German German';
      case 'es':
        return 'European Spanish';
      case 'fr':
        return 'European French';
      case 'pt':
        return 'European Portuguese';
      case 'cz':
        return 'Czech';
      default:
        return 'German German';
    }
  }

  getTomtomAPILanguageCode(): string {
    switch (this.language) {
      case 'en':
        return 'en-GB';
      case 'de':
        return 'de-DE';
      case 'es':
        return 'es-ES';
      case 'fr':
        return 'fr-FR';
      case 'pt':
        return 'pt-PT';
      case 'cz':
        return 'cs-CZ';
      default:
        return 'de-DE';
    }
  }
}

export const getTranslation = (lang: string, key: string, data = {}) => {
  const splitKey = key.split('.');
  splitKey.unshift(lang.toUpperCase());
  const keys: string[] = [...splitKey];
  const text = retrieveText(translationAssets, ...keys);

  if (text === undefined) {
    throw new Error(`Translation key ${key} not found for language ${lang}`);
  }

  return render(text, data);
};

const retrieveText = (assets: Record<string, any>, ...keys): string => {
  if (keys.length === 1) {
    return assets[keys[0]];
  }

  const key = keys.shift();

  return retrieveText(assets[key], ...keys);
};
