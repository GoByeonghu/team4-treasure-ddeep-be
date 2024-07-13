const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
// const swaggerUI = require('swagger-ui-express');
// const swaggerFile = require('./swagger/swagger-output.json');
const posts_route = require('./routes/posts');

// 포트 설정
const port = 3008;

// cors 허용
// 특정 url만 허용하려면 {origin: "주소"}를 추가
app.use(cors());

// 요청 용량 및 내장 body-parser
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb', parameterLimit: 500000}));
app.use(express.text({limit: '50mb'}));
// 기본 라우트 설정

app.get("/", (req, res) => {
    res.send("API SERVER is on Running");
})

// swagger 설정
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile, {explorer:true}));

// posts 엔드포인트 분리
app.use('/posts', posts_route);

app.use('/images', express.static('uploads'));


// 서버 동작
app.listen(port, () => {
    console.log(`API Server is running on port - ${port}`);
})