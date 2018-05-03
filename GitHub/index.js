const querystring = require('querystring');

const express = require('express');
const request = require('request');

var app = express();

var githubConfig = {
    // 客户ID
    client_ID: '66212aa2c8c2293b9020',
    // 客户密匙
    client_Secret: 'aa91b86146ed547109aeed0ef22013aa18d4e870',
    // 获取 access_token
    // eg: https://github.com/login/oauth/access_token?client_id=7***************6&client_secret=4***************f&code=9dbc60118572de060db4&redirect_uri=http://manage.hgdqdev.cn/#/login
    access_token_url: 'https://github.com/login/oauth/access_token',
    // 获取用户信息
    // eg: https://api.github.com/user?access_token=86664b010dbb841a86d4ecc38dfeb8ac673b9430&scope=&token_type=bearer
    user_info_url: 'https://api.github.com/user?',
    // 回调地址
    redirect_uri: 'https://saltfish666.github.io'
}

app.get("/gitblog/login",async function(req,res){
    
    //获得回调函数 GET 请求中的 code
	let code = req.query.code
    console.log(code)

    //简单的检查code参数，但是对于好像没必要
	if (code == undefined) {
        res.set('Content-Type','text/json; charset=utf-8');
        res.end(JSON.stringify({
            msg: '请传入code',
            status: 103
        }));
        return;
    }

    await request.post(githubConfig.access_token_url, {
    	form:{
    		"client_id": githubConfig.client_ID,
            "client_secret": githubConfig.client_Secret,
            "code": code,
            "redirect_uri": githubConfig.redirect_uri}
        },function(error, response, body) {
            let access_token = querystring.parse(body)["access_token"]
            if(access_token == undefined){
                res.send(body)
            }
            res.redirect(302, githubConfig.redirect_uri + "?token="+access_token)
        })

})


app.listen(8099,function(){
	console.log('listening localhost:8099')
})