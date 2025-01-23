import wretch, { Wretch, WretchError } from "wretch";
import { AuthActions } from "./auth";

const { handleJWTRefresh, storeToken, getToken } = AuthActions();

const api = () => {
  return (
    wretch("http://localhost:8000")
      .auth(`Bearer ${getToken("access")}`)
      .catcher(401, async (error: WretchError, request: Wretch) => {
        try {
          const { access } = (await handleJWTRefresh().json()) as {
            access: string;
          };

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
 * @returns {Promise<any>} The promise resolving to the fetched data.
 * @param url
 */
export const fetcher = (url: string): Promise<any> => {
  return api().get(url).json();
};