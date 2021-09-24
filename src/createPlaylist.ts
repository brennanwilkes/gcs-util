import axios from "axios";
import {baseUrl} from "./config";

// tslint:disable-next-line:interface-name
export interface CreatePlaylistOptions{
	name: string;
	description?: string;
	token: string;
	tracks: string[];
}




// tslint:disable-next-line:interface-name
export interface CreatePlaylistResponse {
	id: string
}

export function createPlaylist(options: CreatePlaylistOptions): Promise<CreatePlaylistResponse> {

	const config = {
	    headers: { Authorization: `Bearer ${options.token}` }
	};
	return new Promise<CreatePlaylistResponse>((resolve, reject) => {
		axios.post(
			`${baseUrl}/api/v1/create?name=${options.name}${options.description ? `&description=${options.description}` : ""}${options.tracks.reduce((t,s) => `${t}&tracks[]=${s}`,'')}`,
			config
		).then((resp) => {
			resolve({
				id: resp.data.id as string
			});
		}).catch(reject);
	});
}
