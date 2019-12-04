# 前端开发Docker入门

本文主要为不了解docker的前端人员提供一份前端学习入门，篇幅有点长，还请读者细细实践阅读

主要内容：

* docker的基本概念

* docker部署网站

* 必备技巧：开机启动，常用shell

涉及技术栈：github CI，git actions，Nginx反向代理，docker-compose

当前的问题：

手动部署成本太高，代码需要经过本地开发，编译，上传，测试，提交等过程

项目环境维护困难，项目环境问题

因此一个新的技术方案-----docker，解决以上存在的问题

## 镜像与容器

docker有两个重要概念。

一个是容器（container）：容器像一个虚拟机，容器中运行一个完成的操作系统，可以在容器中装node，可以执行 ***npm install***，当然可以做一切当前操作系统能做的事情。

另外一个就是镜像（Image）：镜像是一个文件，用来创建容器。

在window操作系统中，容器（container）就是window系统，镜像（Image）就是一个“Win7旗舰版.rar”文件。

在docker中，我们操作的真实操作系统为“宿主机”（Host）

## 安装 Docker

下载：

* [Mac 版本](https://download.docker.com/mac/stable/Docker.dmg)
* [window 版本](https://download.docker.com/win/stable/Docker%20for%20Windows%20Installer.exe)
* [Linux](https://get.docker.com/)

本文采用 **Mac** 版本进行什么

## 运行docker

问题：容器运行程序，容器是哪里来的？创建容器的镜像又是哪里来的？

镜像是通过 **Dockerfile** 文件来的，特别像前端工程项目中的 **package.json** 文件

所以docker的存在的创建关系

```js
Dockerfile：功能类似 **package.json**

Image: 类似 **Win7旗舰版.rar**

Container: 一个完成的操作系统
```

## 创建文件

第一步：新建一个目录，这里使用一个 **vue cli 3** 的项目目录为例子,即本文示例目录

```js
  ├─ .github  // github actionss
  ├─ public   // vue
  │ ├─ favicon.ico
  │ └─ index.html
  ├─ src      // vue 源码
  │ ├─ ...
  ├─ ...      // other files
  ├─ .travis.yml  // github CI
  ├─ .docker-compose.yml  //docker-compose 类似 pm2
  ├─ Dockerfile   // 创建镜像的文件
  ├─ package.json  // package.json 项目相关配置
  ├─ proxy.config.js  // 代理配置
  ├─ vhost.nginx.conf  // nginx的配置拓展
  └─ vue.config.js   // vue的配置文件
```

好了，以上目录除了vue脚手架的目录外，涉及到的其他目录会在后续说明。

既然是创建文件，目录也生成了，这里面 **Dockerfile** 肯定是重点啦～

Dockerfile文件的内容：（本地先执行**npm run build**产生**dist目录**）

```js
  FROM nginx

  COPY ./dist /usr/share/nginx/html/

  EXPOSE 80
```

## 打包镜像

安装**Docker**后，我们就可以使用docker了

在项目目录下执行 docker 命令

```js
  docker image build ./ -t docker-demo:1.0.1
```

命令含义是说明？

基于当前目录 **./** 打包一个镜像，镜像的名字是**docker-demo**，版本号是**1.0.1**。该命令会自动寻在Dockerfile来打包一个镜像。（**docker images**命令可以查看宿主机已有的镜像）

执行打包命令后，命令行会的到如下输出：

```js
  Sending build context to Docker daemon  8.065MB
  Step 1/4 : FROM nginx
  ---> 231d40e811cd
  Step 2/4 : COPY ./dist /usr/share/nginx/html/
  ---> 4de51ea6907c
  Step 3/4 : COPY ./vhost.nginx.conf /etc/nginx/conf.d/docker-demo.conf
  ---> b5797dce58bf
  Step 4/4 : EXPOSE 80
  ---> Running in 8e49e15c32d0
  Removing intermediate container 8e49e15c32d0
  ---> 0b778105b11a
  Successfully built 0b778105b11a
  Successfully tagged docker-demo:1.0.1
```

Dockerfile 内容说明：

* FROM nginx：基于哪个镜像，这里是基于nginx镜像（docker官方提供一些基础镜像，本地没有docker会去自动下载到本地）
* COPY ./dist /usr/share/nginx/html/：将宿主机中的./dist文件复制进容器里的/usr/share/nginx/html/
* EXPOSE 80：容器对外暴露80端口

## 运行容器

```js
  docker container create -p 8081:80 docker-demo:1.0.1
  docker container start xxx    # xxx 为上一条命令运行得到的结果，即容器id
```

接下来就可以在浏览器打开**127.0.0.1:**，这个时候应该能看到目录内容**index.html**内容了

在上边第一个命令中，我们使用 **docker container create** 来创建基于 **docker-demo:1.0.1** 镜像的一个容器，使用 **-p** 来指定端口绑定——将容器中的 **80** 端口绑定在宿主机的 **8081** 端口。执行完该命令，会返回一个容器ID
第二个命令则是启动这个容器
启动后，就能通过访问本机 **8081** 端口来达到访问容器内**80** 端口的效果了（docker container ls命令可以查看当前运行的容器）

容器运行后可以通过如下命令进入容器内部

```js
  docker container exec -it xxx /bin/bash  # xxx 为容器ID
```

原理实际上是启动了容器内的/bin/bash，此时你就可以通过bash shell与容器内交互了。就像远程连接了SSH一样.

总结下

1. 写一个 Dockerfile
2. 使用 **docker image build** 来将Dockerfile打包成镜像
3. 使用 **docker container create** 来根据镜像创建一个容器
4. 使用 **docker container start** 来启动一个创建好的容器

```js

  host

    Dockerfile  -> image build
                        |
                        v
                      Image -> container create
                                    |
                                    v
                                container -> :80
                                              |
                                              v
                                            8081

  host

```

## 项目部署

在没迁移 Docker 之前，若我想更新线上内容时，需要：

1. 本地npm run build打包产出静态文件
2. 手动通过 FTP 上传到服务器
3. git push更新 Github 源码

稍微有点麻烦，因此这样改：

1. 执行git push
2. 自动检测到 github 有代码更新，自动打包出一个 Docker 镜像
3. CI 编译完成后，SSH 登录 VPS，删掉现有容器，用新镜像创建一个新容器

实现自动化可持续部署：
当进行修改时，可以免测。改完直接**git push**，而不必本地 **npm run build**

## Github中的CI

首先是让 Github 在每次更新代码时打包出一个镜像

在 Github，可以有免费的 CI 资源用，它就是 [Travis CI](https://www.travis-ci.org/)

在项目中根目录中添加 **.travis.yml文件**，内容如下：

```js
  language: node_js
  node_js:
    - "12"
  services:
    - docker

  before_install:
    - npm install

  script:
    # 打包项目
    - npm run build
    # 登录docker官网
    - echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin 
    # 打包当前目录为镜像文件
    - docker build -t hkmaster/docker-demo:latest .
    # 将镜像推送到docke官网
    - docker push hkmaster/docker-demo:latest
```

使用 **npm run build** 编译静态产出后，打包一个镜像并且 push 到远程。这里又一些细节需要说明一下

1. 为了能够让镜像上传到服务器，你需要[hub.docker.com](https://hub.docker.com/)中注册一个账号，然后替换代码中的 **hkmaster/docker:latest** 为 **用户名/包名:latest** 即可

2. 使用 Github 登录 [Travis CI](https://www.travis-ci.org/) 后，在左边点击+加号添加自己的 Github 仓库后，需要移步到 Setting 为项目添加**DOCKER_USERNAME**和**DOCKER_PASSWORD**环境变量。这样保证我们可以秘密的登录 Docker Hub 而不被其他人看到自己的密码。

按照 **.travis.yml** 的命令次序，在打包镜像时，**npm run build** 已经执行过了，项目产出已经有了(同本地执行**npm run build** )。不必在 **Docker** 容器中运行 **npm install** 和 **npm run build** 之类的

自动化以后，[Travis CI](https://www.travis-ci.org/)可以看到每次执行的日志，[hub.docker.com](https://hub.docker.com/)也可以找到你上传的docker文件

若编译出的站点是一个 **SPA** 单页应用，需要增加额外的 Nginx 配置来保证请求都能打到index.html。下边是写的 **vhost.nginx.conf** Nginx 配置文件，将不访问文件的请求全部重定向到/index.html：

```js
  server {
      listen 80;
      server_name localhost;
      location / {
          root /usr/share/nginx/html;
          index index.html index.htm;
          proxy_set_header Host $host;

          if (!-f $request_filename) {
            rewrite ^.*$ /index.html break;
          }

      }

      error_page 500 502 503 504 /50x.html;
      location = /50x.html {
          root /usr/share/nginx/html;
      }
  }
```

然后Dockerfile进行调整，如下
将

```js
  FROM nginx

  COPY ./dist /usr/share/nginx/html/

  EXPOSE 80
```

改为

```js
  FROM nginx

  COPY ./dist /usr/share/nginx/html/
  COPY ./vhost.nginx.conf /etc/nginx/conf.d/docker-demo.conf

  EXPOSE 80
```

然后执行git push后，你可以在 Travis CI 看到 CI hkmaster/docker-demo:latest这个镜像。本地可以试试看该镜像工作是否正常：

```js
  docker image pull hkmaster/docker-demo:latest
  docker container create -p 8081:80 hkmaster/docker-demo:latest
  docker container start xxx # xxx 为上一条命令执行的返回值
```

## Nginx 反向代理

调整Nginx代理，由于8081在线上服务器，用户访问，不加端口无法直接访问，需要的Nginx进行端口映射

```js
                 Nginx:80
      -             -            -
      |             |            |
      container:1   container2   container3
      port:8081     port:8082    port:8083
```

服务器以 **Ubuntu** 为例，使用 **apt** 安装

```js
  apt update # 更新软件包
  apt-get install nginx # 安装 Nginx
  systemctl status nginx # 查看 Nginx 状态
```

然后本地通过浏览器访问**服务器**的公网 IP 可用看到 Nginx 的欢迎页面。

接下来，服务器配置nginx。

在服务器目录 **/etc/nginx/conf.d** 创建一个 **vhost.conf**，vhost.conf内容如下

```js
server {
    listen 80;
    server_name xxx.com;

    location / {
        proxy_pass http://127.0.0.1:8081;
    }
}
```

配置的意思是，监听来自 80 端口的流量，若访问域名是pea3nut.info（替换为你自己的域名），则全部转发到**http://127.0.0.1:8082**中。

代理将服务器 **80** 端口转发到 **8081** 端口，即服务器 container的 **80** 端口映射到服务器的 **8081** 端口。

```js
服务器 80 ->  服务器 8081 <-> container:80
```

这样访问服务器的80端口就等同于访问container中的内容了
配置完成后，重启 Nginx 服务器。若是 **Ubuntu** 可以使用**systemctl restart nginx**命令，不同 Linux 发行版稍有不同。

访问域名 **xxx.com** 和 **服务器公网IP:8082** 是同样效果

## 更新部署

1. 本地修改，执行 **git push** 
2. travis 编译完成
3. 登录服务器，执行
  
```js
docker image pull hkmaster/docker-demo:latest
docker container create -p 8082:80 docker-demo # 得到 yyy
docker container stop xxx # xxx 为当前运行的容器ID，可用 docker container ls 查看
docker container start yyy # yyy 第二条命令返回值
```

## 实施过程总结

1. 编写 Dockerfile 文件
2. 在 CI 时自动打包镜像
3. 在服务器增加一个 Nginx 反向代理

Tips: 你可能发现了 Dockerfile 中的ENTRYPOINT命令必须指定一个前台进程。若你的 Nodejs 应用是使用 PM2 进行保活的，你需要替换**pm2 start app.js**为**pm2-docker app.js**

## docker-compose

**Dockerfile** 与 **docker-compose** 的关系类同 **nodejs** 与 **pm2** 的关系

docker-compose 是 Docker 官方提供的一个 Docker 管理工具。若你是通过桌面端的 Docker 安装包安装的 Docker，它是会默认为你安装 docker-compose 的。可以试试如下命令：

```js
curl -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

docker-compose 和 Docker 差不多，也是只要一份文件就能跑起来。docker-compose 主要的作用就是能够让你不必手敲那么多 Docker 命令

在服务器的一个目录中建立**docker-compose.yml**,本文就在示例根目录建立**docker-compose.yml**做参考,内容如下：

```js
version: "3"
services:
  startup:
    image: hkmaster/docker-demo:latest
    ports:
      - "8081:80"
    restart: always
    container_name: myNginx2
```

在目录执行命令

```js
docker-compose up startup
```

docker-compose 会自动去拉镜像，创建容器，将容器中的**80**端口映射为宿主机的**8081**端口。**restart**字段还要求 **docker-compose** 当发现容器意外挂掉时重新启动容器，类似于 **pm2**，所以你不必再在容器内使用 **pm2**

如果想要更新一个镜像创建新容器，只需要：

```js
docker-compose pull startup
docker-compose stop startup
docker-compose rm startup
docker-compose up -d startup # -d 代表后台运行
```

## Volume

在打包时，有一些敏感数据不需要放入项目中，也不想别人看到。可以使用**Volume**做目录映射

在本地建立 **./blog/mysql-data** 目录存储 MySQL 数据，建立 **./blog/wordpress** 目录存储 WordPress 源码。然后修改**docker-compose.yml**如下：

```js
version: "3"
services:
  startup:
    image: hkmaster/docker-demo:latest
    ports:
      - "8081:80"
    volumes:
      # nginx 配置映射 <本地目录:contaienr目录>
      - /data/nginx/html:/usr/share/nginx/html
      - /data/nginx/conf/nginx.conf:/etc/nginx/nginx.conf
      - /data/nginx/conf.d:/etc/nginx/conf.d
      - /data/nginx/logs:/var/log/nginx
      - ./blog/mysql-data:/var/lib/mysql
      - ./blog/wordpress:/app
    restart: always
    container_name: myNginx2
```

docker 文档
[https://docs.docker.com/](https://docs.docker.com/)

写给前端的Docker实战教程
[https://juejin.im/post/5d8440ebe51d4561eb0b2751](https://juejin.im/post/5d8440ebe51d4561eb0b2751)

项目实践docker-demo镜像地址：
[https://hub.docker.com/repository/docker/hkmaster/docker-demo](https://hub.docker.com/repository/docker/hkmaster/docker-demo)

项目实践Git仓库：
[https://github.com/huangxok/docker-demo](https://github.com/huangxok/docker-demo)

travis地址：
[https://www.travis-ci.org/](https://www.travis-ci.org/)

docker volume:
[https://www.jianshu.com/p/e11e01b9d675](https://www.jianshu.com/p/e11e01b9d675)

本项目README.md为**[github actions](https://github.com/huangxok/docker-demo/blob/master/README.md)**使用
