# majsoul_custrom_charactor
雀魂立绘魔改

## 1.0.0版本

使用方法：

`npm install 
`

`npm start`

未安装npm的，请自行寻找node.js官网进行安装

感谢[rin93分享的修改bgm方法](https://github.com/rin93/majsoul_custom_bgm)
感谢[小魔的魔改教程](https://lietxia.github.io/#index.md)

对rin93分享的方法做了一些改动，主要是把不熟悉的python换成了我相对熟悉的nodeJS

其实思路都是使用Header Editor进行资源的重定向，然后假设本地服务器提供目标资源

文件中的header_editor_rules.json基本就是照搬的rin93同学的规则，只是在最下面加入了一个一姬立绘的魔改

charactors文件夹下的图片都是我随便在网上找的，请自行替换，然后在Header Editor中修改对应规则

### TO DO：
code.pathed.js目前不是动态获取和生成

匹配规则中目前只有一姬的，其他角色的暂无
