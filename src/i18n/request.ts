import { getRequestConfig } from 'next-intl/server';
import { routing, type Locale } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const reqLocale = await requestLocale;
  const locale = (reqLocale && (routing.locales as readonly string[]).includes(reqLocale))
    ? (reqLocale as Locale)
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../lang/${locale}.json`)).default,
  };
});
