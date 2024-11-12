import { axiosInstance } from "@/lib/axios";
import { Album, Song } from "@/types";
import {create} from "zustand";

interface MusicStore {
    albums: Album[],
    songs: Song[],
    currentAlbum: Album | null,
    isLoading: boolean,
    error: string | null,
    madeForYouSongs: Song[],
    featuredSongs: Song[],
    trendingSongs: Song[],

    fetchAlbums: () => Promise<void>,
    fetchAlbumById: (albumId: string) => Promise<void>,
    fetchFeaturedSongs: () => Promise<void>,
    fetchMadeForYouSongs: () => Promise<void>,
    fetchTrendingSongs: () => Promise<void>
}

export const useMusicStore = create<MusicStore>((set) => ({
    albums: [],
    songs: [],
    isLoading: false,
    error: null,
    currentAlbum: null,
    madeForYouSongs: [],
    featuredSongs: [],
    trendingSongs: [],

    fetchAlbums: async () => {
        set({isLoading: true, error: null})
        try {
            const res = await axiosInstance.get("/albums")
            set({albums: res.data})
        } catch (error: any) {
            set({error: error.response.data.message})
        } finally {
            set({isLoading: false})
        }
    },

    fetchAlbumById: async (albumId: string) => {
        set({isLoading: true, error: null})
        try {
            const res = await axiosInstance.get(`/albums/${albumId}`)
            set({currentAlbum: res.data})
        } catch (error: any) {
            set({error: error.response.data.message})
        } finally {
            set({isLoading: false})
        }
    },

    fetchFeaturedSongs: async () => { 
        set({isLoading: true, error: null})
        try {
            const res = await axiosInstance.get("/songs/featured")
            set({featuredSongs: res.data})
        } catch (error: any) {
            set({error: error.response.data.message})
        } finally {
            set({isLoading: false})
        }
    },

    fetchMadeForYouSongs: async () => {
        set({isLoading: true, error: null})
        try {
            const res = await axiosInstance.get("/songs/made-for-you")
            set({madeForYouSongs: res.data})
        } catch (error: any) {
            set({error: error.response.data.message})
        } finally {
            set({isLoading: false})
        }
    },

    fetchTrendingSongs: async () => {
        set({isLoading: true, error: null})
        try {
            const res = await axiosInstance.get("/songs/trending")
            set({trendingSongs: res.data})
        } catch (error: any) {
            set({error: error.response.data.message})
        } finally {
            set({isLoading: false})
        }  
    },
}))