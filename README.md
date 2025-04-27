# Better-Vue3-Vite-application
在GitHub上[原作](https://github.com/caolib/vue3-vite)的基础上进行项目的迭代开发

版本信息：
<br>nvm版本为20.17.0
<br>node版本为1.2.2
<br>

一、配置更改
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

二、优化后的效果图如下
