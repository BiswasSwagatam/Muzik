import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import  cloudinary  from "../lib/cloudinary.js";

// upload to cloudinary
const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: 'auto'
        })
        return result.secure_url
    } catch (error) {
        console.log("Error uploading to cloudinary", error)
        throw new Error("Error uploading to cloudinary")
    }
}

export const checkAdmin = async (req, res, next) => {
    res.status(200).json({admin: true})
}

export const createSong = async (req, res, next) => {
    try {
        if(!req.files || !req.files.audioFile || !req.files.imageFile) {
            return res.status(400).json({message: "All files are required"})
        }

        const {title, artist, duration ,albumId} = req.body
        const audioFile = req.files.audioFile
        const imageFile = req.files.imageFile

        const audioUrl = await uploadToCloudinary(audioFile)
        const imageUrl = await uploadToCloudinary(imageFile)

        const song = new Song({
            title,
            artist,
            duration,
            imageUrl,
            audioUrl,
            albumId: albumId || null
        })

        await song.save()

        // if song belongs to an album
        if(albumId){
            await Album.findByIdAndUpdate(albumId, {
                $push: {songs: song._id}
            })
        }
        res.status(201).json({message: "Song created successfully"})
    } catch (error) {
        console.log("Error creating song" ,error)
        next(error)
    }
}

export const deleteSong = async (req, res, next) => {
    try {
        const {id} = req.params
        const song = await Song.findById(id)
        // if song belongs to an album, update the album's songs array
        if(song.albumId){
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: {songs: song._id}
            })
        }
        await Song.findByIdAndDelete(id)
        res.status(200).json({message: "Song deleted successfully"})   
    } catch (error) {
        console.log("Error deleting song", error)
        next(error)
    }
}

export const createAlbum = async (req, res, next) => {
    try {
        const {title, artist, releaseYear} = req.body
        const {imageFile} = req.files
        const imageUrl = await uploadToCloudinary(imageFile)

        const album = new Album({
            title,
            artist,
            releaseYear,
            imageUrl
        })

        await album.save()
        res.status(201).json({message: "Album created successfully", album})
    } catch (error) {
        console.log("Error creating album", error)
        next(error)
    }
}

export const deleteAlbum = async (req, res, next) => {
    try {
        const {id} = req.params
        const album = await Album.findById(id)
        if(!album){
            return res.status(404).json({message: "Album not found"})
        }
        await Song.deleteMany({albumId: id}) // delete all songs in the album
        await Album.findByIdAndDelete(id) // delete the album
        res.status(200).json({message: "Album deleted successfully"})
    } catch (error) {
        console.log("Error deleting album", error)
        next(error)
    }
}