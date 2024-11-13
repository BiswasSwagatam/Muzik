import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats } from "@/types";
import toast from "react-hot-toast";
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
    stats: Stats

    fetchAlbums: () => Promise<void>,
    fetchAlbumById: (albumId: string) => Promise<void>,
    fetchFeaturedSongs: () => Promise<void>,
    fetchMadeForYouSongs: () => Promise<void>,
    fetchTrendingSongs: () => Promise<void>,
    fetchStats: () => Promise<void>,
    fetchSongs: () => Promise<void>,
    deleteSong: (songId: string) => Promise<void>,
    deleteAlbum: (albumId: string) => Promise<void>
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
    stats: {totalSongs: 0, totalAlbums: 0, totalUsers: 0, totalArtists: 0},

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

    fetchStats: async () => {
        set({isLoading: true, error: null})
        try {
            const res = await axiosInstance.get("/stats")
            set({stats: res.data})
        } catch (error: any) {
            set({error: error.response.data.message})
        } finally {
            set({isLoading: false})
        }
    },

    fetchSongs: async () => {
        set({isLoading: true, error: null})
        try {
            const res = await axiosInstance.get("/songs")
            set({songs: res.data})
        } catch (error: any) {
            set({error: error.response.data.message})
        } finally {
            set({isLoading: false})
        }
    },

    deleteSong: async (songId: string) => {
        set({isLoading: true, error: null})
        try {
            await axiosInstance.delete(`/admin/songs/${songId}`)
            set(state => ({
                songs: state.songs.filter(song => song._id !== songId)
            }))
            toast.success("Song deleted successfully")
        } catch (error: any) {
            toast.error("Failed to delete song")
            set({error: error.response.data.message})
        } finally {
            set({isLoading: false})
        }
    },

    deleteAlbum: async (albumId: string) => {
        set({isLoading: true, error: null})
        try {
            await axiosInstance.delete(`/admin/albums/${albumId}`)
            set(state => ({
                albums: state.albums.filter(album => album._id !== albumId),
                songs: state.songs.map((song) => 
                    song.albumId === state.albums.find((a) => a._id === albumId)?.title ? {...song, album: null} : song)
            }))
            toast.success("Album deleted successfully")
        } catch (error: any) {
            toast.error("Failed to delete album")
            set({error: error.response.data.message})
        } finally {
            set({isLoading: false})
        }
    }
}))