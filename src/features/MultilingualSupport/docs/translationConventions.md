# Multilingual Support Translation Conventions

Use namespaced translation keys in the format `namespace:path.to.key`.

## Namespaces

- `common`: Shared application strings, buttons, field labels, and reusable messages.
- `navigation`: Sidebar, navbar, route, tab, and menu labels.
- `validation`: Form validation and schema validation messages.
- `errors`: API, network, missing translation, fallback, and unavailable locale errors.
- `multilingualSupport`: Feature-specific content for language settings and multilingual examples.

## Key Rules

1. Prefer stable semantic keys over literal English text.
2. Use interpolation with double braces, for example `{{field}}` and `{{count}}`.
3. Put reusable validation strings in `validation` instead of feature namespaces.
4. Put feature-specific headings, descriptions, and helper text in the feature namespace.
5. When a key is missing, the i18n setup falls back to English and then to the key name.

## Examples

- `common:buttons.save`
- `navigation:languageSettings`
- `validation:required`
- `errors:loadTranslations`
- `multilingualSupport:selector.currentLanguage`
