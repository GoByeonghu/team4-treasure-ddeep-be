const model = require('../models/posts');
const bcrypt = require('bcrypt');

// 전체 게시글 리스트 조회 /posts GET
// 지역명으로 리스트 조회 /posts?location=애월 GET
// 게시글 작성 /posts POST
// 게시글 id로 세부 조회 /posts/{id} GET
// 게시글 삭제 /posts/{id} DELETE

module.exports = {
    listupPosts: async(req, res) => {
        try {
            const {location} = req.query

            // 쿼리 파라미터의 여부에 따라 전역/ 지역 조회로 분리
            if (location) { // 지역 리스트업 조회
                const result = await model.listupLocational(location);
                if(result){
                    res.status(200).json({
                        "message":"read_loactional_posts_success",
                        "data": result
                    })
                } else if(!result){
                    res.status(400).json({"message":"read_locational_posts_failed"});
                }
            } else { // 전역 리스트업 조회
                const result = await model.listupGlobal();
                if(result){
                    res.status(200).json({
                        "message":"read_global_posts_success",
                        "data": result
                    })
                } else if(!result){
                    res.status(400).json({"message":"read_global_posts_failed"});
                }
            }
        } catch (e) {
            res.status(500).json({"message": "Internal_server_error"});
        }
    },
    readPost: async(req, res) => {
        try {
            const result = await model.readPost(req.params.id);
            if(result == -1){
                res.status(404).json({"message":"post_not_found"});
            } else if(result){
                res.status(200).json({
                    "message":"post_read_success",
                    "data": result
                });
            } else if(!result){
                res.status(400).json({"message":"post_read_failed"});
            }
        } catch (e) {
            res.status(500).json({"message": "Internal_server_error"});
        }
    },
    createPost: async(req, res) => {
        try {
            console.log(req.file.path)
            req.body.post_image_path = "/images/"+req.file.filename;
            const salt = bcrypt.genSaltSync(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
            const result = await model.createPost(req.body);
            if(result){
                res.status(201).json({"message":"post_create_success"});
            } else if(!result){
                res.status(400).json({"message":"post_create_failed"});
            }
        } catch (e) {
            console.log(e)
            res.status(500).json({"message": "Internal_server_error"});
        }
    },
    modifyPost: async(req, res) => {
        try{
            req.body.post_image_path = "/images/"+req.file.filename;
            const result = await model.modifyPost(req.body);
            if(result == -1){
                res.status(404).json({"message":"post_not_found"});
            } else if(result == -2){
                res.status(401).json({"message":"unauthorized"});
            } else if(result){
                res.status(201).json({"message":"post_modify_success"});
            } else if(!result){
                res.status(400).json({"message":"post_modify_failed"});
            }
        } catch (e) {
            console.log(e)
            res.status(500).json({"message":"Internal_server_error"});
        }
    },
    deletePost: async(req, res) => {
        try {
            const result = await model.deletePost(req.body);
            if(result == -1){
                res.status(404).json({"message":"post_not_found"});
            } else if(result == -2){
                res.status(401).json({"message":"unauthorized"});
            } else if(result){
                res.status(200).json({"message":"post_delete_success"});
            } else if(!result){
                res.status(400).json({"message":"post_delete_failed"});
            }
        } catch (e) {
            res.status(500).json({"message": "Internal_server_error"});
        }
    }
}