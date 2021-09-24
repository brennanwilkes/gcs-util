import axios from "axios";
import {baseUrl} from "./config";

// tslint:disable-next-line:interface-name
export interface GetTopOptions{
	type: "tracks" | "artists";
	time_range: "short_term" | "medium_term" | "long_term";
	token: string;
	limit?: number;
	offset?: number
}

// tslint:disable-next-line:interface-name
export interface GetTopTracksOptions extends GetTopOptions{
	type: "tracks";
}

// tslint:disable-next-line:interface-name
export interface GetTopArtistsOptions extends GetTopOptions{
	type: "artists";
}

// tslint:disable-next-line:interface-name
export interface TopArtistsResponse {
	artists: {
		name: string,
		id: string
	}[]
}

// tslint:disable-next-line:interface-name
export interface TopTracksResponse {
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

export function getTop(options: GetTopTracksOptions): Promise<TopTracksResponse>;
export function getTop(options: GetTopArtistsOptions): Promise<TopArtistsResponse>;
export function getTop(options: GetTopTracksOptions | GetTopArtistsOptions): Promise<TopTracksResponse> | Promise<TopArtistsResponse> {

	const config = {
	    headers: { Authorization: `Bearer ${options.token}` }
	};


	if(!options.offset){
		options.offset = 0;
	}
	if(!options.limit){
		options.limit = 50;
	}

	if(options.type === "artists"){
		return new Promise<TopArtistsResponse>((resolve, reject) => {
			axios.get(
				`${baseUrl}/api/v1/spotify/topArtists?time_range=${options.time_range}&limit=${options.limit}&offset=${options.offset}`,
				config
			).then((resp: any) => {
				resolve(resp.data as TopArtistsResponse);
			}).catch(reject);
		});

	}
	else{
		return new Promise<TopTracksResponse>((resolve, reject) => {
			axios.get(
				`${baseUrl}/api/v1/spotify/topTracks?time_range=${options.time_range}&limit=${options.limit}&offset=${options.offset}`,
				config
			).then((resp: any) => {
				resolve(resp.data as TopTracksResponse);
			}).catch(reject);
		});
	}
}
