# vscode-DOSBox

提供一个在VSCode中运行DOSBox及其变体的接口

## 支持的DOSBox和VSCode平台

- [JSDos](https://js-dos.com/): 支持包括web端的所有平台
- [DOSBox](https://www.dosbox.com/): windows系统下打包了可执行文件，linux和macOS系统需要手动安装
- [DOSBox-x](https://dosbox-x.com/): windows系统下打包了可执行文件，linux和macOS系统需要手动安装
- [MSDos-player](http://takeda-toshiya.my.coocan.jp/msdos/index.html): windows系统下打包了可执行文件，其他平台无相应程序

## 功能

- 提供打开相关DOS模拟器的简单接口，参看 [api.ts](src/api.ts)
- 提供打开相关DOS模拟器的简单命令，可以在命令面板测试与调用

## 安装依赖

### Windows系统用户

所有的可执行文件都已经打包在安装包中。可以通过修改设置来使用不同的模拟器

### 在mac平台使用homebrew安装DOSBox和DOSBox-x (推荐)

```sh
brew install dosbox
brew install dosbox-x
```

[homebrew](https://brew.sh/)官网有安装homebrew的详细教程，[tuna](https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/)也提供了镜像安装和换源方法。

### 在mac平台从dmg文件安装DOSBox

1. 从DOSBox的[官网](https://www.dosbox.com/download.php?main=1)下载DMG文件
2. 点击dmg文件
3. 将程序拖拽到`/Applications`文件夹
4. 在VSCode中添加如下设置，配置用于打开DOSBox的命令

```json
"vscode-dosbox.command.dosbox":"open -a dosbox --args",
```

### 在mac平台从zip文件安装DOSBox-x

1. 从dosbox-x的 [官网](https://dosbox-x.com) 下载zip压缩包文件
2. 解压并将需要的话`.app`文件拖拽到 `/Applications`文件夹
3. 按照[macOS的文档](https://support.apple.com/zh-cn/HT202491)设置安全选项
   1. 在“系统偏好设置”中，前往“安全性与隐私”。
   1. 点按“通用”面板中的“仍要打开”按钮，以确认您打算打开或安装这个 App。
4. 在VSCode中添加如下设置，配置用于打开DOSBox的命令

```json
"vscode-dosbox.command.dosboxX":"open -a dosbox-x --args",
```

### 在Linux平台安装dosbox

Ubuntu等可以使用apt的发行版可以使用如下命令安装

```sh
sudo apt install dosbox
```

参看[DOSBox's website](https://www.dosbox.com/download.php?main=1)

### 在Linux平台安装dosbox-x

根据[dosbox-x's instructions](https://github.com/joncampbell123/dosbox-x/blob/master/INSTALL.md#linux-packages-flatpak-and-more),
我们可以使用[flatpak](https://www.flatpak.org/setup/)来安装 DOSBox-X.

```sh
# install flatpak
sudo apt install flatpak
# use flatpak to install DOSBox-X
flatpak install flathub com.dosbox_x.DOSBox-X
```

最后在VSCode的设置中添加如下内容

```json
"vscode-dosbox.command.dosboxX":"flatpak run com.dosbox_x.DOSBox-X",
```

## 插件设置

该插件主要包括如下设置:

* `vscode-dosbox.command.dosbox`:  自定义打开dosbox的命令
* `vscode-dosbox.command.dosboxX`: 自定义打开dosbox-x的命令

## 报告问题

在[github issues](https://github.com/dosasm/vscode-dosbox/issues)中，提交遇到的问题。

## Release Notes

