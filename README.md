# Better-Vue3-Vite-application
在GitHub上[原作](https://github.com/caolib/vue3-vite)的基础上进行项目的迭代开发

版本信息：
<br>nvm版本为20.17.0
<br>node版本为1.2.2
<br>IDEA 2024.1
<br>maven 3.9.9
<br>MySQL 8.0
<br>vue 3

一、修改部分主要集中在前端，如下：
  1. 在 ```main.js``` 中，配合Element Plus的按需导入，新增:

```
import { ElLoading, ElNotification } from 'element-plus';
 
app.use(ElLoading) 
app.use(ElNotification) 
```
  2. 修改后的Vue代码需要新模块，在项目目录下打开命令行，执行以下语句：
```
npm install -D sass
```
二、使用教程
  1. 打开```"D:\STUDY\25up\Course3\new-project\vue3-vite"```目录，右键打开命令行，运行：
```npm run dev```即可运行前端
<br>  2. 使用IDEA打开项目（带黑点的文件夹即是项目目录文件），用maven导入依赖
<br>  3. 设置中选择JDK 17，运行src/main/java/com/clb目录下的```BookApplication.java```文件，即可运行后端
<br>  4. 数据库需要打开application-dev.yml文件把账户和密码改成你自己的，同时修改数据库名称；Redis无需密码，修改application-dev.yml文件对应配置即可
<br>  ps：其实这部分基础配置可以去看原作的ReadMe教程，如果想使用本项目的前端页面可以在成功部署原作的基础上执行命令：
  ```git clone https://github.com/therain2020/Better-Vue3-Vite-application.git```
  将本仓库中的前端项目替换原作中的前端项目即可
<br>[个人博客链接](https://therain2020.github.io/)