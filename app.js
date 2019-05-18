
//导入模块
const http = require('http');
const url = require('url');
const fs = require('fs');
const template = require('art-template');
const db = require('./db.json');

//创建服务器

const app = http.createServer((req,res) => {
    let urlname = url.parse(req.url,true);
    if (urlname.pathname === '/') {
        fs.readFile('./views/index.html',(err,data) => {
            var html = template.render(data.toString(),{db});
            res.end(html);
        })
    } else if (urlname.pathname.indexOf('/public') == 0) {
        fs.readFile('./' + urlname.pathname, (err,data) => {
            res.end(data);
        })
    } else if( urlname.pathname === '/post') {
        //fs读取的文件默认未buffer类型，可以通过设置字符编码，或toString方法得到字符串
        fs.readFile('./views/post.html','utf-8',(err,data) => {
            // var html = template.render(data,{});
            res.end(data);

        })
    } else if (urlname.pathname === '/add') {
        urlname.query.id = db[db.length - 1].id + 1;
        urlname.query.time = (new Date()).toLocaleString();
        db.push(urlname.query);
        var jsonStr = JSON.stringify(db,null,"  ")
        //stringify 1.需要序列换话字符串的对象 2.对序列化对象中每一项处理函数或数组 3.数字 0-10，表示空格数，字符串，字符串长度代表空格数量
        fs.writeFile('./db.json',jsonStr,(err) => {
            if (err) {
                throw err;
            } else {
                console.log('数据更新成功。')
            }
        })
        //重定向设置
        res.statusCode = 302;
        res.setHeader('Location','/');
        res.end();
    }
});

app.listen(3000,() => {
    console.log('http://127.0.0.1:3000');
});
