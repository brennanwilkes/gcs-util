import axios from "axios";
import {baseUrl} from "./config";

// tslint:disable-next-line:interface-name
export interface RecommendOptions{
	limit?: number,
	seed_tracks: string[];
	acousticness?: number;
	danceability?: number;
	energy?: number;
	instrumentalness?: number;
	key?: number;
	mode?: number;
	loudness?: number;
	tempo?: number;
	valence?: number;
	token: string;
}



// tslint:disable-next-line:interface-name
export interface RecommendResponse {
	tracks:{
		title: string,
		artist: string,
		album: string,
		duration: number,
		explicit: boolean,
		ids: {
			label: string,
			id: string
		}[],
		thumbnailUrl: string,
		releaseDate: string,
	}[]
}

export function recommend(options: RecommendOptions): Promise<RecommendResponse> {

	const config = {
	    headers: { Authorization: `Bearer ${options.token}` }
	};


	if(!options.limit){
		options.limit = 50;
	}
	return new Promise<RecommendResponse>((resolve, reject) => {

		let url = `${baseUrl}/api/v1/recommend?limit=${options.limit}${options.seed_tracks.reduce((t,s) => `${t}&seed_tracks[]=${s}`,'')}`;
		if(options.acousticness) url += `&acousticness=${options.acousticness}`;
		if(options.danceability) url += `&danceability=${options.danceability}`;
		if(options.acousticness) url += `&acousticness=${options.acousticness}`;
		if(options.energy) url += `&energy=${options.energy}`;
		if(options.key) url += `&key=${options.key}`;
		if(options.mode) url += `&mode=${options.mode}`;
		if(options.loudness) url += `&loudness=${options.loudness}`;
		if(options.tempo) url += `&tempo=${options.tempo}`;
		if(options.valence) url += `&valence=${options.valence}`;

		axios.get(
			url,
			config
		).then((resp: any) => {
			resolve(resp.data as RecommendResponse);
		}).catch(reject);
	});
}
