export const translationKeys = {
  common: {
    appName: 'common:app.name',
    appDescription: 'common:app.description',
    buttons: {
      save: 'common:buttons.save',
      cancel: 'common:buttons.cancel',
      close: 'common:buttons.close',
      retry: 'common:buttons.retry',
      submit: 'common:buttons.submit',
      loading: 'common:buttons.loading',
    },
    forms: {
      email: 'common:forms.email',
      password: 'common:forms.password',
      displayName: 'common:forms.displayName',
    },
  },
  navigation: {
    dashboard: 'navigation:dashboard',
    feature: 'navigation:feature',
    settings: 'navigation:settings',
    languageSettings: 'navigation:languageSettings',
    multilingualSupport: 'navigation:multilingualSupport',
    signIn: 'navigation:signIn',
    register: 'navigation:register',
  },
  validation: {
    required: 'validation:required',
    email: 'validation:email',
    minLength: 'validation:minLength',
    unsupportedLanguage: 'validation:unsupportedLanguage',
  },
  errors: {
    generic: 'errors:generic',
    loadLocales: 'errors:loadLocales',
    loadTranslations: 'errors:loadTranslations',
    switchLanguage: 'errors:switchLanguage',
    missingTranslation: 'errors:missingTranslation',
  },
  multilingualSupport: {
    pageTitle: 'multilingualSupport:page.title',
    pageSubtitle: 'multilingualSupport:page.subtitle',
    selectorLabel: 'multilingualSupport:selector.label',
    demoTitle: 'multilingualSupport:demo.title',
  },
} as const;

export interface TranslationKeyConvention {
  namespace: string;
  usage: string;
  examples: string[];
}

export const translationKeyConventions: TranslationKeyConvention[] = [
  {
    namespace: 'common',
    usage: 'Shared app labels, reusable button text, form field names, and generic messages used across multiple features.',
    examples: ['common:buttons.save', 'common:forms.email', 'common:app.name'],
  },
  {
    namespace: 'navigation',
    usage: 'Sidebar, header, menu, breadcrumb, tab, and route labels.',
    examples: ['navigation:dashboard', 'navigation:settings', 'navigation:languageSettings'],
  },
  {
    namespace: 'validation',
    usage: 'Client-side form validation messages and schema-level validation text.',
    examples: ['validation:required', 'validation:email', 'validation:minLength'],
  },
  {
    namespace: 'errors',
    usage: 'Network, API, authorization, missing translation, and fallback error states.',
    examples: ['errors:generic', 'errors:loadLocales', 'errors:switchLanguage'],
  },
  {
    namespace: 'multilingualSupport',
    usage: 'Feature-specific copy for multilingual support pages, examples, and language selector helper text.',
    examples: ['multilingualSupport:page.title', 'multilingualSupport:selector.currentLanguage'],
  },
];
