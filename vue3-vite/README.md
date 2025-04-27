[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=cascadia+code&size=38&duration=3500&pause=1000&color=00ADFF&center=true&vCenter=true&random=false&width=1000&height=100&lines=Book+lending+management+system;图书借阅管理系统)](https://git.io/typing-svg)

<div style="text-align: center;">
  <img src="https://img.shields.io/github/v/release/tankingcao/vue3-vite?include_prereleases&display_name=release&labelColor=red&cacheSeconds=3600" alt="GitHub Release"/>
  <img src="https://img.shields.io/badge/vue-v3.3.11-blue?style=plastic&logo=vue.js&logoColor=%234FC08D&labelColor=white" alt="Vue"/>
  <img src="https://img.shields.io/badge/ElementPlus-v2.3.1-blue?style=plastic&labelColor=white" alt="ElementPlus"/>
  <img src="https://img.shields.io/badge/Axios-v1.6.5-white?style=plastic&logo=axios&logoColor=%235A29E4" alt="Axios"/>
  <img src="https://img.shields.io/badge/nodejs-blue?logo=node.js&logoColor=green&labelColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/vite-blue?logo=vite&logoColor=green&labelColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/pinia-red" alt="Pinia"/>
</div>

> [!important]
>
> 简介：图书借阅管理系统前端，使用vue3框架
>
> **这是对应的 [后端项目地址](https://github.com/caolib/java_design)**

## 快速使用

### 1.进入项目根目录，使用npm命令下载项目所需的依赖模块

> [!caution]
>
> :boom:**注意：要先安装nodejs，最好以管理员身份执行命令！！！**:boom:

```cmd
npm install
```

### 2.修改配置文件

打开`vite.config.js`文件,可以自行修改前端地址，也可以修改向后端请求的地址，但是要相应地修改后端项目的启动路径

```js
//代理http请求，解决跨域问题
server: {
    // 前端项目启动路径，localhost:5173
    host: 'localhost',
    port: 5173,
    proxy: {
        '/api': { //匹配请求路径中含有 /api 的请求
            target: 'http://localhost:8080', //后端服务地址
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '') //去除路径中的/api，还原请求路径
        }
    }
},
```

### 3.执行命令，启动项目

```cmd
npm run dev
```

## 项目目录结构

- `components`：公共组件，包括顶部导航和侧栏
- `css`：全局样式
- `methods`：前端所有向后端发送的请求api
- `router`：界面路由
- `stores`：pinia存储
- `util`：工具方法
- `views`：页面
- `main.js`：入口文件，app的初始化
- `package.json`：项目的各种依赖，执行脚本等
- `vite.config.js`：项目配置文件

![image](https://github.com/user-attachments/assets/5f309b3a-f6cc-4cd1-90e5-29927150b2bf)
