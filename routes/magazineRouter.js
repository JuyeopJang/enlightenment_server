const express = require('express');
const router = express.Router();
const magazineController = require('../controllers/magazineController');
const isValidUser = require('../utils/isValidUser');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3')
const dotenv = require('dotenv');
dotenv.config()
const multer = require('multer');

const s3 = new AWS.S3({ 
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, //노출주의
    secretAccessKey: process.env.AWS_SECRET_KEY, //노출주의
    region: process.env.AWS_REGION, //노출주의
});
//console.log(s3.deleteObject)

const storage = multerS3({ 
    s3: s3,
    bucket: 'www.kelection.ml',
    contentType: multerS3.AUTO_CONTENT_TYPE, 
    acl: 'public-read',
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname })
    },
    key: function (req, file, cb) { 
        cb(null, `images/${Date.now()}_${file.originalname}`)  
    },
})

const upload = multer({
    storage: storage
})

//isValidUser.hasCookies,
router.get('/', magazineController.getMagazines);
router.post('/images', upload.single("upload"), magazineController.uploadImage)
router.post('/', isValidUser.hasCookies, magazineController.createMagazine);
router.put('/:magazineId', isValidUser.hasCookies, magazineController.patchMagazine);
//수정 필요!
router.put('/:magazineId/like', magazineController.updateMagazineLike)
router.delete('/:magazineId', isValidUser.hasCookies, magazineController.deleteMagazine);

module.exports = router;
