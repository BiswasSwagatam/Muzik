import { Song } from "../models/song.model.js"



export const getAllSongs = async (req, res, next) => {
    try {
        // -1 for desc
        const songs = await Song.find().sort({createdAt: -1})
        res.status(200).json(songs)
    } catch (error) {
        console.log("Error getting all songs", error)
        next(error)
    }
}

export const getFeaturedSongs = async (req, res, next) => {
    try {
        const songs = await Song.aggregate([
            {$sample: {size: 6}},
            {$project: {
                _id: 1, 
                title: 1, 
                artist: 1, 
                imageUrl: 1, 
                audioUrl: 1
            }}
        ])
        res.status(200).json(songs)
    } catch (error) {
        console.log("Error getting featured songs", error)
        next(error)
    }
}

export const getMadeForYouSongs = async (req, res, next) => {
    try {
        const songs = await Song.aggregate([
            {$sample: {size: 4}},
            {$project: {
                _id: 1, 
                title: 1, 
                artist: 1, 
                imageUrl: 1, 
                audioUrl: 1
            }}
        ])
        res.status(200).json(songs)
    } catch (error) {
        console.log("Error getting made for you songs", error)
        next(error)
    }
}

export const getTrendingSongs = async (req, res, next) => {
    try {
        const songs = await Song.aggregate([
            {$sample: {size: 4}},
            {$project: {
                _id: 1, 
                title: 1, 
                artist: 1, 
                imageUrl: 1, 
                audioUrl: 1
            }}
        ])
        res.status(200).json(songs)
    } catch (error) {
        console.log("Error getting trending songs", error)
        next(error)
    }
}