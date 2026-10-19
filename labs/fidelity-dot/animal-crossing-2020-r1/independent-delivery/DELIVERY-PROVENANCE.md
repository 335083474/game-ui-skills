# Delivery来源与继承 · repair-r1

## 准确输入链
1. dot原两页ACNH套件，经接收方原样组装和有限实测：
   32个内容文件 + 1个MANIFEST.json = 33文件。
   ZIP SHA256:
   0ffc664bd5076fab3b7587921d1a4ad0e250d83691a14f57defd529c66728a5b
   接收方报告5862489字节。
2. 全新普通网页临时上下文只拿上述确切ZIP及新需求，首次产出：
   ACNH-islander-delivery-research-v0.1.zip
   40文件，5875703字节，SHA256:
   594204e907348490e95c0e3d9ccac90a0e809b4f7f987054c30caaa5dd3567bd
   33输入文件逐字节继承，新增7文件。
   原文“输入ZIP32项”不准确，现更正为32内容+1manifest。
3. 接收方实际运行：默认视觉语言和部分交互通过，
   12项溢出、动态焦点丢失、9999排版失败；独立首轮退回。
4. dot按该缺陷单撰写repair-r1。接收方复验尚待进行。
   不得把这条链改成“首次独立原样一次通过”。

## 作者范围
独立上下文原作：
delivery.html、delivery.css、delivery.js、delivery-data.js、
DELIVERY-README.md、DELIVERY-PROVENANCE.md、DELIVERY-MANIFEST.json。
独立上下文具体模型未暴露，记录UNKNOWN。
其源码/文档中的原作者自测陈述属于原作者，不是dot的执行证据。

dot本轮替换：
delivery.css：分页内容区、固定名称/库存行、四位数量独立操作排布、诊断样式。
delivery.js：分页渲染和跨页导航、逻辑焦点及局部滚动恢复、溢出诊断、
弹窗回焦点防抢占；原验证器和数据上限保留。
DELIVERY-README.md：当前实现、使用与待验说明。
DELIVERY-PROVENANCE.md：本文件，修正来源与数量。
dot新增：
DELIVERY-REPAIR-r1.md：边界/焦点通用补充与本次改动清单。

dot没有改delivery.html、delivery-data.js、两份历史manifest、原33文件或素材。
接收方未代画/代改设计代码；其职责为原文接收、组包、哈希、实际测试和发布。
本次没有由dot启动执行器、Codex任务、子Agent、PC操作或付费。

## 素材依赖
delivery.html使用assets/background.png。
delivery.js白名单：
seed→assets/shop-seed.svg
sapling→assets/shop-sapling.svg
kit→assets/customization-kit.png
shovel→assets/shovel.svg
net→assets/net.svg
rod→assets/fishing-rod.svg
axe→assets/axe.svg
ladder→assets/ladder.svg
slingshot→assets/slingshot.svg
wateringCan→assets/watering-can.svg
delivery.css使用assets/hand.svg。
全部从已冻结两页包原字节继承，没有新图像模型产物或截图裁片。

字体仍为系统Arial Rounded MT Bold / Trebuchet MS / Arial / sans-serif，
中文取决于系统回退，不是官方字库。无字体文件新增。
生成PNG、直接写SVG与未知权利范围详见继承SOURCES.md；
没有把新功能中的中文名称、岛民设定或交付逻辑宣称为官方游戏资料。

## Manifest范围
MANIFEST.json仅覆盖原32内容文件，是原33文件输入包的清单。
DELIVERY-MANIFEST.json是原独立初稿的历史输入/新增哈希记录，
其中修订前delivery.css/js/文档哈希不适用于repair-r1。
两者继续原字节保留；新包应由接收方另建当前清单，
明确历史清单范围，不能冒称旧清单已校验修订文件。

新副本在原40文件上替换4份、新增1份，因此在接收方新清单之前是41文件。
dot未计算新ZIP/新文件哈希；以接收方实际计算值为准。
旧33/40文件ZIP保持不变。

## 使用与验收边界
这是同视觉语言的新功能研究演示，不是游戏原有页面的原作截图复制。
原作参考仅私下对照，不混入分发候选。
版权/商标/生成素材/字体的商业或公开再分发许可未确认。
reviewerAccepted=false、customerReady=false、未上线。
只在接收方给出确切冻结版本和实际测试范围后记录相应结论，
不能从素材一致或源码数量推导整包通过。
