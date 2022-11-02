import { LanguageType } from '../interfaces/interfaces';

interface Language {
  id: number;
  name: LanguageType;
  title: string;
  countryCode: string;
}

export const languages: Language[] = [
  {
    id: 1,
    name: 'en',
    title: 'English',
    countryCode: 'gb',
  },
  {
    id: 2,
    name: 'de',
    title: 'German',
    countryCode: 'de',
  },
];

export const bookLanguages: Language[] = [
  {
    id: 1,
    name: 'en',
    title: 'English',
    countryCode: 'gb',
  },
  {
    id: 2,
    name: 'vi',
    title: 'Viet Nam',
    countryCode: 'vn',
  },
  {
    id: 3,
    name: 'de',
    title: 'German',
    countryCode: 'de',
  },
  {
    id:4,
    name:'jp',
    title:"Japan",
    countryCode:'jp'
  }
]