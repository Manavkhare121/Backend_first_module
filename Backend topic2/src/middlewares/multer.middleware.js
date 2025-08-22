import multer from "multer";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname) //file is come for tiny second and then we upload on server and delete from cloudinary
    }
})
export const upload = multer({ 
    storage,
})