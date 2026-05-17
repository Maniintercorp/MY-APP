CREATE TABLE SupportedLocales (
    Code varchar(16) NOT NULL PRIMARY KEY,
    DisplayName nvarchar(100) NOT NULL,
    NativeName nvarchar(100) NOT NULL,
    IsDefault bit NOT NULL,
    IsEnabled bit NOT NULL,
    Direction varchar(3) NOT NULL
);

CREATE TABLE TranslationResources (
    Id uniqueidentifier NOT NULL PRIMARY KEY,
    LocaleCode varchar(16) NOT NULL,
    Namespace nvarchar(64) NOT NULL,
    ResourcesJson nvarchar(max) NOT NULL,
    CONSTRAINT FK_TranslationResources_SupportedLocales FOREIGN KEY (LocaleCode) REFERENCES SupportedLocales(Code),
    CONSTRAINT UQ_TranslationResources_Locale_Namespace UNIQUE (LocaleCode, Namespace)
);

CREATE TABLE UserLanguagePreferences (
    UserId nvarchar(450) NOT NULL PRIMARY KEY,
    PreferredLanguageCode varchar(16) NOT NULL,
    UpdatedAt datetimeoffset NOT NULL,
    CONSTRAINT FK_UserLanguagePreferences_SupportedLocales FOREIGN KEY (PreferredLanguageCode) REFERENCES SupportedLocales(Code)
);

INSERT INTO SupportedLocales (Code, DisplayName, NativeName, IsDefault, IsEnabled, Direction) VALUES
('en', N'English', N'English', 1, 1, 'ltr'),
('es', N'Spanish', N'Español', 0, 1, 'ltr'),
('fr', N'French', N'Français', 0, 1, 'ltr');

INSERT INTO TranslationResources (Id, LocaleCode, Namespace, ResourcesJson) VALUES
(NEWID(), 'en', N'common', N'{"app":{"name":"App","description":"A professional SaaS workspace"},"buttons":{"save":"Save","cancel":"Cancel","close":"Close","retry":"Retry","submit":"Submit","loading":"Loading..."},"forms":{"email":"Email","password":"Password","displayName":"Display name"},"language":"Language","messages":{"saved":"Your changes have been saved."}}'),
(NEWID(), 'en', N'navigation', N'{"dashboard":"Dashboard","feature":"Feature","settings":"Settings","languageSettings":"Language settings","multilingualSupport":"Multilingual support","signIn":"Sign in","register":"Register"}'),
(NEWID(), 'en', N'validation', N'{"required":"{{field}} is required.","email":"Enter a valid email address.","minLength":"{{field}} must be at least {{count}} characters.","unsupportedLanguage":"This language is unavailable. The fallback language has been applied."}'),
(NEWID(), 'en', N'errors', N'{"generic":"Something went wrong. Please try again.","loadLocales":"Unable to load supported languages.","loadTranslations":"Unable to load translation resources. Fallback translations are being used.","switchLanguage":"Unable to save the selected language. The local preference was still updated.","missingTranslation":"Translation is missing for this key."}'),
(NEWID(), 'en', N'multilingualSupport', N'{"page":{"title":"Multilingual support","subtitle":"Switch languages, persist preferences, and preview localized formatting for dates, numbers, currency, validation, and app messages."},"selector":{"label":"Choose language","description":"Select your preferred application language.","currentLanguage":"Current language: {{language}}"},"status":{"activeLanguage":"Active language","fallbackLanguage":"Fallback language","resourceState":"Translation resources","ready":"Ready"},"demo":{"title":"Localized UI preview","description":"These examples update immediately when the active language changes.","date":"Date","number":"Number","currency":"Currency","validationSuccess":"The localized form was submitted successfully."}}');
