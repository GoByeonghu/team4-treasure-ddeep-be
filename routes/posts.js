const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const {getTime} = require("../utils/util");

const {listupPosts, readPost, createPost, modifyPost, deletePost} = require("../controllers/posts");

// 업로드 디렉토리가 존재하는지 확인하고, 없으면 생성
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// multer 설정
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        const filename = getTime() + '_' + file.originalname;
        cb(null, filename);
    }
})

const upload = multer({storage});


router.get('/', listupPosts);

router.get('/:id', readPost);

router.post('/',upload.single('post_image_path') ,createPost);

router.patch('/', upload.single('post_image_path'), modifyPost);

router.delete('/', deletePost);

module.exports = router;