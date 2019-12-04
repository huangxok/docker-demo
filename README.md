# github actions

## github actions 是什么

持续集成由很多操作组成，比如抓取代码、运行测试、登录远程服务器，发布到第三方服务等等。GitHub 把这些操作就称为 actions。

很多操作在不同项目里面是类似的，完全可以共享。GitHub 注意到了这一点，想出了一个很妙的点子，允许开发者把每个操作写成独立的脚本文件，存放到代码仓库，使得其他开发者可以引用。

如果你需要某个 action，不必自己写复杂的脚本，直接引用他人写好的 action 即可，整个持续集成过程，就变成了一个 actions 的组合。这就是 GitHub Actions 最特别的地方。

GitHub 做了一个[官方市场](https://github.com/marketplace?type=actions)，可以搜索到他人提交的 actions。另外，还有一个 [awesome actions](https://github.com/sdras/awesome-actions) 的仓库，也可以找到不少 action。

每个 action 就是一个独立脚本，因此可以做成代码仓库，使用 **userName/repoName** 的语法引用 action。比如，**actions/setup-node**就表示**github.com/actions/setup-node**这个[仓库](https://github.com/actions/setup-node)，它代表一个 action，作用是安装 Node.js。GitHub 官方的 actions 都放在 **[github.com/actions](https://github.com/actions)** 里面。

既然 actions 是代码仓库，当然就有版本的概念，用户可以引用某个具体版本的 action。下面都是合法的 action 引用，用的就是 Git 的指针概念，详见[官方文档](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/about-actions#versioning-your-action)。

```js
actions/setup-node@74bc508 # 指向一个 commit
actions/setup-node@v1.0    # 指向一个标签
actions/setup-node@master  # 指向一个分支
```

## 基本概念

GitHub Actions 有一些自己的术语。

* （1）**workflow** （工作流程）：持续集成一次运行的过程，就是一个 workflow。

* （2）**job** （任务）：一个 workflow 由一个或多个 jobs 构成，含义是一次持续集成的运行，可以完成多个任务。

* （3）**step**（步骤）：每个 job 由多个 step 构成，一步步完成。

* （4）**action** （动作）：每个 step 可以依次执行一个或多个命令（action）。

## workflow 文件

GitHub Actions 的配置文件叫做 workflow 文件，存放在代码仓库的 **.github/workflows** 目录。

workflow 文件采用 [YAML格式](http://www.ruanyifeng.com/blog/2016/07/yaml.html)，文件名可以任意取，但是后缀名统一为.yml，比如foo.yml。一个库可以有多个 workflow 文件。GitHub 只要发现.github/workflows目录里面有.yml文件，就会自动运行该文件。

workflow 文件的配置字段非常多，详见[官方文档](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions)。下面是一些基本字段。

* （1）name

name字段是 workflow 的名称。如果省略该字段，默认为当前 workflow 的文件名。

```js
name: GitHub Actions Demo
```

* （2）on

on字段指定触发 workflow 的条件，通常是某些事件。

```js
on: push
```

上面代码指定，push事件触发 workflow。

on字段也可以是事件的数组。

```js
on: [push, pull_request]
```

上面代码指定，**push**事件或**pull_request**事件都可以触发 workflow。

完整的事件列表，请查看官方文档。除了代码库事件，GitHub Actions 也支持外部事件触发，或者定时运行。

* （3）on.<push|pull_request>.<tags|branches>

指定触发事件时，可以限定分支或标签。

```js
on:
  push:
    branches:
      - master
```

上面代码指定，只有master分支发生push事件时，才会触发 workflow。

* （4）jobs.<job_id>.name

workflow 文件的主体是jobs字段，表示要执行的一项或多项任务。

jobs字段里面，需要写出每一项任务的job_id，具体名称自定义。job_id里面的name字段是任务的说明。

```js
jobs:
  my_first_job:
    name: My first job
  my_second_job:
    name: My second job
```

上面代码的jobs字段包含两项任务，job_id分别是my_first_job和my_second_job。

* （5）jobs.<job_id>.needs

needs字段指定当前任务的依赖关系，即运行顺序。

```js
jobs:
  job1:
  job2:
    needs: job1
  job3:
    needs: [job1, job2]
```

上面代码中，job1必须先于job2完成，而job3等待job1和job2的完成才能运行。因此，这个 workflow 的运行顺序依次为：job1、job2、job3。

* （6）jobs.<job_id>.runs-on

runs-on字段指定运行所需要的虚拟机环境。它是必填字段。目前可用的虚拟机如下。

```js
ubuntu-latest，ubuntu-18.04或ubuntu-16.04
windows-latest，windows-2019或windows-2016
macOS-latest或macOS-10.14
```

下面代码指定虚拟机环境为ubuntu-18.04。

```js
runs-on: ubuntu-18.04
```

* （7）jobs.<job_id>.steps

**steps**字段指定每个 Job 的运行步骤，可以包含一个或多个步骤。每个步骤都可以指定以下三个字段。

```js
jobs.<job_id>.steps.name：步骤名称。
jobs.<job_id>.steps.run：该步骤运行的命令或者 action。
jobs.<job_id>.steps.env：该步骤所需的环境变量。
```

下面是一个完整的 workflow 文件的范例。

```js
name: Greeting from Mona
on: push

jobs:
  my-job:
    name: My Job
    runs-on: ubuntu-latest
    steps:
    - name: Print a greeting
      env:
        MY_VAR: Hi there! My name is
        FIRST_NAME: Mona
        MIDDLE_NAME: The
        LAST_NAME: Octocat
      run: |
        echo $MY_VAR $FIRST_NAME $MIDDLE_NAME $LAST_NAME.
    - name: Checkout code
      uses: actions/checkout@master
    - name: Create Release
      id: create_release
      uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # This token is provided by Actions, you do not need to create your own token
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: |
            Changes in this Release
            - First Change
            - Second Change
          draft: false
          prerelease: false
```

上面代码中，steps字段只包括一个步骤。该步骤先注入四个环境变量，然后执行一条 Bash 命令。

## 发布项目到Github Pages

* 第一步：构建成果发到 GitHub 仓库，因此需要 GitHub 密钥。按照[官方文档](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line)，生成一个密钥。然后，将这个密钥储存到当前仓库的**Settings/Secrets**里面。

* 第二步：在项目中的 **package.json** 中添加 **“homepage”**，表示发布应用后的根目录 如下代码：

```js
{
  "name": "test"
  ...
  "homepage": "https://[username].github.io/github-actions-demo"
}
```

将 **[username]** 替换成你的github用户名，参考 **package.json**

* 第三步：在仓库目录 **.github/workflow** 中生成一个workflow文件，文件名随意取，示例用 **ci.yml**

这里采用一个别人写好的action：[JamesIves/github-pages-deploy-action](https://github.com/marketplace/actions/deploy-to-github-pages)

```js
name: GitHub Actions Build and Deploy Demo
on:
  push:
    branches:
      - master
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@master

    - name: Build and Deploy
      uses: JamesIves/github-pages-deploy-action@master
      env:
        ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
        BRANCH: gh-pages
        FOLDER: build
        BUILD_SCRIPT: npm install && npm run build
```

workflow文件要点：

```js
  1.整个流程在master分支发生push事件时触发。
  2.只有一个job，运行在虚拟机环境ubuntu-latest。
  3.第一步是获取源码，使用的 action 是actions/checkout。
  4.第二步是构建和部署，使用的 action 是JamesIves/github-pages-deploy-action。
  5.第二步需要四个环境变量，分别为 GitHub 密钥、发布分支、构建成果所在目录、构建脚本。
  其中，只有 GitHub 密钥是秘密变量，需要写在双括号里面，其他三个都可以直接写在文件里, secrets.ACCESS_TOKEN的 ACCESS_TOKEN是当前仓库的密钥名称 。
```

* 第四步，保存上面的文件后，将整个仓库推送到 GitHub。

GitHub 发现了 workflow 文件以后，就会自动运行。你可以在网站上实时查看运行日志，日志默认保存30天。
等到 workflow 运行结束，访问 GitHub Page，会看到构建成果已经发上网了，
以后每次修改后推送源码，GitHub Actions 都会自动运行，将构建产物发布到网页。

## 参考链接

[github actions官网](https://help.github.com/en/actions/automating-your-workflow-with-github-actions)
[本项目测试示例](https://github.com/huangxok/docker-demo)

## Docker Container

[Docker相关内容](https://juejin.im/post/5d8440ebe51d4561eb0b2751)
[Docke实践步骤](https://github.com/huangxok/docker-demo/blob/master/Docker.md)

## 项目代码运行

### Project setup

```js
npm install
```

### Compiles and hot-reloads for development

```js
npm run serve
```

### Compiles and minifies for production

```js
npm run build
```

### Lints and fixes files

```js
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
