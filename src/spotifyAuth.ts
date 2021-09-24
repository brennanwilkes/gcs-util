import {baseUrl} from "./config";

// tslint:disable-next-line:interface-name
export interface SpotifyToken {
  access: string;
  refresh: string;
}

const localStorageKey = "gcs-access-key-spotify";

export const spotifyAuth = (): Promise<SpotifyToken> =>
  new Promise<SpotifyToken>((resolve, reject) => {
    window.addEventListener(
      "message",
      (event: any) => {
		if("origin" in event && event.origin === baseUrl){
			try {
	          if ("data" in event) {
	            const payload: string = decodeURIComponent(event.data);
	            const json: any = JSON.parse(payload);
	            if ("spotify" in json) {
	              const tokens: any = json.spotify;
	              if ("access" in tokens && "refresh" in tokens) {
	                if (loginPopup) {
	                  loginPopup.close();
	                }
	                resolve({
	                  access: tokens.access,
	                  refresh: tokens.refresh
	                });
	              } else {
	                if (loginPopup) {
	                  loginPopup.close();
	                }
	                reject(new Error("Failed to retrieve spotify access token"));
	              }
	            } else {
	              if (loginPopup) {
	                loginPopup.close();
	              }
	              reject(new Error("Failed to retrieve spotify access token"));
	            }
	          } else {
	            if (loginPopup) {
	              loginPopup.close();
	            }
	            reject(new Error("Invalid post message"));
	          }
	        } catch (err) {
	          if (loginPopup) {
	            loginPopup.close();
	          }
	          reject(err);
	        }
		}
      },
      false
    );
    const loginPopup = window.open(
      `${baseUrl}/auth/spotify?state=post`,
      "Login to Spotify"
    );
  });

export const spotifyCachedAuth = (): Promise<SpotifyToken> => new Promise<SpotifyToken>((resolve, reject) => {
	const existing: string | null = localStorage.getItem(localStorageKey);
	if(existing){
		const payload = JSON.parse(existing) as {
			expires: Date,
			token: SpotifyToken
		};
		if(new Date(payload.expires) > new Date()){
			resolve(payload.token);
			return;
		}
	}
	spotifyAuth().then(token => {
		localStorage.setItem(localStorageKey, JSON.stringify({
			token,
			expires: new Date(new Date().getTime() + 45 * 60000)
		}))
	}).catch(reject);
});
