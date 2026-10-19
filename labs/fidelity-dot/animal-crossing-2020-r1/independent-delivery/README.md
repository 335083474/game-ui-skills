# ACNH-pockets-v0.3

Animal Crossing: New Horizons / 集合啦！动物森友会，2020 Nintendo Switch方向的第一口袋代表屏候选。
当前reviewerAccepted=false、customerReady=false、未上架。不扩完整Skill、多屏或下一游戏。

## 确切基准

接收方冻结v0.2：17文件、2860022字节，ZIP SHA256：
20c1e51f028215294597747ad499258e1e1e9456606cebc5e705f49106b19d35

P2-AC-02滚动条/画幅问题已由接收方实际关闭。其已测client1265无横滚；client945时舞台不足正确inert；client965时启用且底部完整。v0.3保留该resize函数和重算监听，不将既有通过范围冒充新版本已回归。

P1-AC-01仍待验收，本版只修蝎子在槽内的可见体量。

## 变更与继承

替换5文件：
- index.html：版本标题v0.3；详情图片增加同类取景容器
- pockets.css：蝎子专用归一取景规则；工具仍用原contain
- pockets.js：槽位插入取景容器、详情同步icon键及修订注释
- README.md
- COMPONENTS.md

原字节继承12文件：
- pockets-data.js
- assets/scorpion.png
- assets/background.png
- assets/pocket-panel.svg
- assets/hand.svg
- assets/shovel.svg
- assets/axe.svg
- assets/slingshot.svg
- assets/watering-can.svg
- assets/fishing-rod.svg
- assets/ladder.svg
- assets/net.svg

原v0.1/v0.2包不覆盖；接收方在新副本原样组装并生成新清单/ZIP。没有新PNG，也没有重新生图或重编码。当前蝎子仍是已实收ACNH_scorpion_v02_final.png：1150×1367 RGBA、734454字节。其原始字节保持不变，两个显示位置共用该文件及同一取景公式。

历史整屏study不属于17文件运行包，不作为v0.3实际合成证据。

## 取景修订

使用接收方测得的alpha≥128主体范围(221,286)–(925,1162)，主体704×876；不用alpha>0的极淡外围当主体。

统一逻辑取景：原PNG内x185、y245、width780、height960。范围右965、下1205，主体四边分别保留36、40、41、43px余量。

槽位取景容器55.25×68，置于原64×68按钮中央；详情91×112。两处图像左/上偏移和宽/高百分比一致，由同一CSS选择器应用。比例严格对应原PNG，不横向拉扁；只以overflow:hidden裁去外部透明/极淡留白。

按接收方主体测量推导，槽内主体约49.87×62.05逻辑px；这是数学推导，不是dot运行测量或视觉通过。
黄底48×58、40槽坐标、背景、数据、控件及选中环不变。

## 打开与依赖

保存17文件及相对assets路径，在现代桌面浏览器打开index.html，或由接收方用既有静态HTTP预览。无构建、安装、服务器、外部字体、API或账户。

需要dialog/showModal、inert、Blob、现代DOM及CSS。字体采用本机Arial Rounded MT Bold/Trebuchet MS/Arial/sans-serif，非官方字体，未分发字体二进制。

1280×720逻辑舞台；按clientWidth/clientHeight与存在时visualViewport的较小范围计算，最大1倍、向下取整。横屏且实际舞台至少960×540才启用；不足或竖屏显示限制并inert。编辑器仍在舞台外，纵向滚动条可见，无overflow-x:hidden掩盖裁切。

## 数据和操作保持

JSON schemaVersion=1、version="ACNH-pockets-v0.1"保持，与界面修订版本分开。旧合法JSON直接复用。

顶层：schemaVersion/version/selectedId/items。
每项：id/slot/name/icon/quantity/dimmed/description。

- 0–40项；slot唯一整数0–39
- id唯一，1–40位ASCII字母数字/下划线/连字符，首位字母或数字
- name≤300、description≤20000 UTF-16单位，全文/导出保留原值
- quantity整数0–9999；1不显示数量，其他值为独立DOM
- dimmed布尔值，true不可选；全部淡化或空集合选择null
- 白名单icon：scorpion/shovel/axe/slingshot/wateringCan/fishingRod/ladder/net
- 选择项消失或不可用时回到首个可用项；没有则null
- 拒绝额外/缺少字段、错类型、重复ID/slot、非法路径、越界数值、坏JSON及超过1000000字符输入；旧数据保留

Load current JSON→编辑→Validate and apply JSON→Export JSON。刷新恢复启动文件，无隐式持久化。
鼠标、方向近邻、Home/End选择；Enter/Space/A/Select和全文按钮查看完整文字。Confirm/+只记录本地确认，不删除、转移或交易物品。B/Esc/Cancel关闭，Open保留选择重开。全文关闭恢复可见焦点。

空集合/全淡化隐藏标签和手势，禁用Confirm/Select/全文；编辑器仍可用。更换工具图标时不套用蝎子取景规则。

## 原作与来源

https://interfaceingame.com/screenshots/animal-crossing-new-horizons-pocket-inventory/
https://interfaceingame.com/wp-content/uploads/animal-crossing-new-horizons/animal-crossing-new-horizons-pocket-inventory.jpg

作品页标注2020 Nintendo Switch；具体截图构建、日期未知。
接收方原图1280×720，310328字节，SHA256：
bd3493c03d0c7913e92c3184c7ea5103aee935550877b3ab8ca07cbd3df21f62

dot实际查看过原图和接收方运行截图。原图reference-only，不分发、不裁图标。附件工具可视副本310323字节与原文件不同，不沿用原SHA。

源码及SVG为dot普通聊天新写；蝎子/背景为此前内置生图生成近似，精确模型未知。v0.3只以CSS对该新生成蝎子取景，没有处理原作截图。
背景人物/树木/建筑、字体和蝎子画法仍非官方精确复刻，商业及公开再分发权利未确认。

## 待验收

- 33个槽位的主体占比、钳/腿/尾小尺寸辨识度与参考对照
- 详情与槽位取景一致，透明边缘及取景边界无误裁主体
- 更换scorpion与工具时正确切换取景规则
- 长文、数量、0/1/40、全淡化、删除选中、非法导入及真实导出回归
- 原通过的clientWidth画幅场景复验，确认无无关回归

dot未运行、截图、打ZIP或计算新版本哈希；不自签关闭P1-AC-01，不把图片附件/公式当验收。