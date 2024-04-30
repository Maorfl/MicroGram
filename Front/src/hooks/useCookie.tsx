import { Cookie } from "../types/CookieType";
function useCookie(cookieName: string): Cookie {
    let cookie: Cookie = "";

    function getTokenCookie(cookieName: string): string | undefined {
        const name = cookieName + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookies = decodedCookie.split(';');
        for (let cookie of cookies) {
            while (cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) == 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return undefined;
    }

    if (!cookie) cookie = getTokenCookie(cookieName);

    return cookie;
}

export default useCookie;