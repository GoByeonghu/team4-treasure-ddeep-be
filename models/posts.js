const db = require("../configs/db.config");
const bcrypt = require('bcrypt');

module.exports = {
    listupGlobal: async () => {
        const SQL = "select id, nickname, location, title, content, post_image_path, DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at from posts where deleted_at is null";
        try{ //200
            const results = await db.query(SQL);
            return results[0];
        } catch(err){ //400
            console.log(`error occured in model.listupGlobal - ${err}`)
            return false;
        }
    },
    listupLocational: async (location) => {
        const SQL = `select id, nickname, location, title, content, post_image_path, DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at from posts where location = ? and deleted_at is null`;
        try{ //200
            const results = await db.query(SQL, [location]);
            return results[0];
        } catch(err){ //400
            console.log(`error occured in model.listupLocational - ${err}`)
            return false;
        }
    },
    readPost: async(id) => {
        const SQL = `select id, nickname, location, title, content, post_image_path, DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS formatted_updated_at from posts where id = ? and deleted_at is null`;
        try{
            const result = await db.query(SQL, [id]);
            if(result[0][0]){ //200
                return result[0][0];
            } else if(!result[0][0]){ //404
                return -1;
            }
        } catch(err){
            console.log(`error occured in model.readPost - ${err}`)
            return false;
        }
    },
    createPost: async(data) => {
        const SQL = `insert into posts values(null, ?, ?, ?, ?, ?, now(), now(), null, ?)`;
        const nickname = data.nickname;
        const location = data.location;
        const title = data.title;
        const content = data.content;
        const post_image_path = data.post_image_path;
        const password = data.password;

        try { //201
            const result = await db.query(SQL, [nickname, location, title, content, post_image_path, password]);
            return true
        }
        catch(err){ //400
            console.log(`error occured in model.createPost - ${err}`)
            return false;
        }
    },
    modifyPost: async(data) => {
        let SQL = 'update posts set ';
        const params = [];
        if(data.title){
            SQL += 'title = ?, ';
            params.push(data.title);
        }
        if(data.content){
            SQL += 'content = ?, ';
            params.push(data.content);
        }
        if(data.post_image_path){
            SQL += 'post_image_path = ?, ';
            params.push(data.post_image_path);
        }
        SQL = SQL.slice(0, -2);
        SQL += ' where id = ?';
        params.push(data.id);

        console.log(SQL)

        const SQLA = `select password from posts where id = ? and deleted_at is null`;
        try{
            const encryptPassword = await db.query(SQLA, [data.id]);
            const auth = bcrypt.compare(data.password, encryptPassword[0][0].password);
            if(!auth){ //401
                return -2;
            }
        } catch(err){
            console.log(`error occured in model.modifyPost_auth - ${err}`)
            return false;
        }

        try{
            const result = await db.query(SQL, params);
            if(result){
                return true;
            } else if(!result){
                return -1;
            }
        } catch(err){ //400
            console.log(`error occured in model.modifyPost - ${err}`)
            return false;
        }
    },
    deletePost: async(data) => {
        const SQLA = `select password from posts where id = ? and deleted_at is null`;
        try{
            const encryptPassword = await db.query(SQLA, [data.id]);
            const auth = bcrypt.compare(data.password, encryptPassword[0][0].password);
            if(!auth){ //401
                return -2;
            }
        } catch(err){
            console.log(`error occured in model.deletePost_auth - ${err}`)
            return false;
        }

        const SQL = `update posts set deleted_at = now() where id = ?`;
        try{
            const result = await db.query(SQL, [data.id]);
            if(result){ //200
                return true;
            } else if(!result){ //404
                return -1;
            }
        } catch(err){ //400
            console.log(`error occured in model.deletePost - ${err}`)
            return false;
        }
    }
}