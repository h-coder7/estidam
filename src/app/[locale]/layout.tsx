import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/app/styles/lib/all.min.css";
import "@/app/styles/scss/style.scss";
import BootstrapClient from "@/components/BootstrapClient";
import LenisProvider from "@/components/LenisProvider";
import PageTransition from "@/components/layout/PageTransition";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat/WhatsAppFloat";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import MotionProvider from "@/components/MotionProvider";
import { lamaSans, lamaSansBold } from "@/app/fonts";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
    title: "Estidam",
    description: "Estidam",
    icons: {
        icon: "/images/fav-icon.png",
    },
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
            className={`${lamaSans.variable} ${lamaSansBold.variable}`}
        >
            <body suppressHydrationWarning>
                <NextIntlClientProvider messages={messages}>
                    <MotionProvider>
                        <LenisProvider>
                            <PageTransition>{children}</PageTransition>
                            <WhatsAppFloat />
                        </LenisProvider>
                    </MotionProvider>
                </NextIntlClientProvider>
                <BootstrapClient />
            </body>
        </html>
    );
}
