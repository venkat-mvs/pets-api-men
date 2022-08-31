const multer = require("multer");
const XLSX = require("xlsx");

class FileTypeError extends Error{
    constructor(message, error){
        super(message);
    }
}

const MemoryUploader = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fieldNameSize: 50, // TODO: Check if this size is enough
        fieldSize: 20000, //TODO: Check if this size is enough
        // TODO: Change this line after compression
        fileSize: 15000000, // 150 KB 
    },
    fileFilter: function(_req, file, cb){
        const filetypes = /application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet/;
        if(filetypes.test(file.mimetype))
            cb(null, true);
        else
        cb(new FileTypeError(
            `${file.originalname} is not allowed`
        ), false);
    } 
}
)

const getDataFromExcel = (file, sheet) => {
    return XLSX.utils.sheet_to_json(XLSX.read(file, {
        type: 'buffer'
    }).Sheets[sheet]);
}

module.exports = { MemoryUploader, getDataFromExcel, FileTypeError };