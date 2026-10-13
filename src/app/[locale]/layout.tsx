import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/app/styles/lib/all.min.css";
import "@/app/styles/scss/style.scss";
import BootstrapClient from "@/components/BootstrapClient";
import LenisProvider from "@/components/LenisProvider";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import MotionProvider from "@/components/MotionProvider";
import { inter } from "@/app/fonts";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
    title: "Estidam",
    description: "Estidam",
};

export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;

    if (!(routing.locales as readonly string[]).includes(locale)) {
        notFound();
    }

    setRequestLocale(locale);
    const messages = await getMessages({ locale });
    const dir = locale === "ar" ? "rtl" : "ltr";

    return (
        <html
            lang={locale}
            dir={dir}
            className={inter.variable}
        >
            <body suppressHydrationWarning>
                <NextIntlClientProvider messages={messages}>
                    <MotionProvider>
                        <LenisProvider>{children}</LenisProvider>
                    </MotionProvider>
                </NextIntlClientProvider>
                <BootstrapClient />
            </body>
        </html>
    );
}
