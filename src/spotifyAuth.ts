export interface SpotifyToken {
    access: string;
	refresh: string
}

export const baseUrl = "http://localhost:8080";

export const spotifyAuth = (): Promise<SpotifyToken> => new Promise<SpotifyToken>((resolve, reject) => {
	window.addEventListener("message", (event: any) => {
		try{
			if("data" in event){
				const payload: string = decodeURIComponent(event.data);
				const json: any = JSON.parse(payload);
				if("spotify" in json){
					const tokens: any = json.spotify;
					if("access" in tokens && "refresh" in tokens){
						if(loginPopup) loginPopup.close();
						resolve({
							access: tokens.access,
							refresh: tokens.refresh
						});
					}
					else{
						if(loginPopup) loginPopup.close();
						reject(new Error("Failed to retrieve spotify access token"));
					}
				}
				else{
					if(loginPopup) loginPopup.close();
					reject(new Error("Failed to retrieve spotify access token"));
				}
			}
			else{
				if(loginPopup) loginPopup.close();
				reject(new Error("Invalid post message"));
			}
		}
		catch(err){
			if(loginPopup) loginPopup.close();
			reject(err);
		}
	}, false);
	const loginPopup = window.open(`${baseUrl}/auth/spotify?state=post`, "Login to Spotify");
});
