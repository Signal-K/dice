import wretch, { Wretch, WretchError } from "wretch";
import { AuthActions } from "./auth";

const { handleJWTRefresh, storeToken, getToken } = AuthActions();

const api = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  return (
    wretch(baseUrl)
      .auth(`Bearer ${getToken("access")}`)
      .catcher(401, async (error: WretchError, request: Wretch) => {
        try {
          const { access } = (await handleJWTRefresh().json()) as { access: string };

          storeToken(access, "access");

          return request
            .auth(`Bearer ${access}`)
            .fetch()
            .unauthorized(() => {
              window.location.replace("/"); 
            })
            .json();
        } catch (err) {
          window.location.replace("/");
        }
      })
  );
};

/**
 * Fetches data from the specified URL, automatically handling authentication and token refresh.
 * @param url - The API endpoint to fetch data from
 * @returns {Promise<any>} - The data from the fetched URL
 */
export const fetcher = (url: string): Promise<any> => {
  return api().get(url).json();
};