import { createI18n } from "vue-i18n";

function loadLocaleMessages() {
  // load arabic files
  const arabicLocales = require.context(
    "./locales/ar",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  var messages = { en: {}, ar: {} };
  arabicLocales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      // console.log("locale", locale);
      messages["ar"][locale] = arabicLocales(key);
    }
  });

  // load engilsh files
  const englishLocales = require.context(
    "./locales/en",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  englishLocales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      console.log("locale", locale);
      messages["en"][locale] = englishLocales(key);
    }
  });
  console.log(messages);
  return messages;
}
var autoLocale = JSON.parse(localStorage.getItem("currentUser")) || false;
export const i18n = createI18n({
  // locale: process.env.VUE_APP_I18N_LOCALE || autoLocale.lang,
  locale: localStorage.lang || "ar",
  legacy: false,
  globalInjection: true,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || autoLocale.lang,
  messages: loadLocaleMessages(),
});
