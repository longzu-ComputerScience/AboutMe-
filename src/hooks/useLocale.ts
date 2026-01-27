"use client";

import { useState, useEffect } from "react";

/**
 * Hook to get current locale from cookie (synchronous after first render).
 * This avoids the flicker issue when using async API calls.
 */
export function useLocale(): { locale: string; isVietnamese: boolean; isLoading: boolean } {
    const [locale, setLocale] = useState<string>("vi"); // Default to Vietnamese
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Read locale from cookie on client side
        const getCookieLocale = () => {
            const cookies = document.cookie.split("; ");
            const localeCookie = cookies.find((c) => c.startsWith("locale="));
            return localeCookie ? localeCookie.split("=")[1] : "vi";
        };

        const cookieLocale = getCookieLocale();
        setLocale(cookieLocale);
        setIsLoading(false);

        // Listen for locale changes
        const handleStorageChange = () => {
            const newLocale = getCookieLocale();
            setLocale(newLocale);
        };

        // Custom event for locale changes within same tab
        window.addEventListener("localeChange", handleStorageChange);

        return () => {
            window.removeEventListener("localeChange", handleStorageChange);
        };
    }, []);

    return {
        locale,
        isVietnamese: locale === "vi",
        isLoading,
    };
}

/**
 * Dispatch locale change event for components to update.
 */
export function dispatchLocaleChange() {
    window.dispatchEvent(new CustomEvent("localeChange"));
}
