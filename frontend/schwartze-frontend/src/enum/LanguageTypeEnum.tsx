export const LanguageTypeEnum = {
    En: 'en',
    Nl: 'nl',
    Es: 'es',
    Fr: 'fr',
    De: 'de'
} as const;

export type LanguageTypeEnum = typeof LanguageTypeEnum[keyof typeof LanguageTypeEnum];
