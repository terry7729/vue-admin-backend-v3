  # vue-admin-backend

> A Vue.js project

## Build Setup
  vue的前端环境分为四个环境：
    1、local：本地环境
    2、dev:测试环境
    3、pre:预发环境----release
    4、pro线上环境-----master
   执行目录：
       cd script/
    
    执行命令(如)：
        ./app.sh local
        
    备注：
        我们的local文件是不会上传到git上的，所以用git clone下来的是没有local的，
        所以需要自己在环境目录中新建一个local文件夹，根据dev的目录结构进行复制并将配置条件修改成本地环境的配置