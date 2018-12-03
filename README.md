# majsoul_custrom_charactor
雀魂立绘魔改

使用方法修改为：

双击运行项目中的start.bat即可自动安装依赖包和运行

如果无法正常运行，请确认你的电脑中正确安装了nodeJS

[下载地址](http://nodejs.cn/download/)

## 1.0.1 更新：

1、能够自动获取code.js并生成对应的code.patched.js
2、自动检查charactors和bgm两个文件夹是否存在，如果不存在会自动创建

## 1.0.0版本

使用方法：

`npm install 
`

安装运行依赖项

`npm start`

启动本地服务器，默认是8000端口

看到

`server is running on port 8000`

就是服务器启动成功了

未安装npm的，请自行寻找node.js官网进行安装

感谢[rin93分享的修改bgm方法](https://github.com/rin93/majsoul_custom_bgm)
感谢[小魔的魔改教程](https://lietxia.github.io/#index.md)

需要配合Header Editor的使用，请参看上面两个教程，我就不赘述了

文件中的header_editor_rules.json基本就是照搬的rin93同学的规则，只是在最下面加入了一个一姬立绘的魔改

charactors文件夹下的图片都是我随便在网上找的，请自行替换，然后在Header Editor中修改对应规则

### TO DO：
code.pathed.js目前不是动态获取和生成

匹配规则中目前只有一姬的，其他角色的暂无
