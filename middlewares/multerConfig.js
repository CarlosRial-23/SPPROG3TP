const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads'); // Define la carpeta de destino absoluta.

        cb(null, uploadDir); // Le dice a Multer dónde guardar los archivos
    },
    filename: function (req, file, cb) {
        const fileExtension = path.extname(file.originalname); // Obtiene la extensión original (.jpg, .png, etc.)
        cb(null, file.fieldname + '-' + Date.now() + fileExtension); // Guarda con un nombre único y la extensión
    }
});

const upload = multer({ storage: storage });

module.exports = upload;