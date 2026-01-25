import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
    // Get locale from cookie, default to Vietnamese
    const cookieStore = cookies();
    const locale = cookieStore.get('locale')?.value || 'vi';

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
