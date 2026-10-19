/* Independent fictional demonstration data; all asset references are files from the frozen package. */
window.HK_EXPEDITION_INITIAL = {
  schema: "hk-expedition-result-v1",
  title: "远征结算",
  outcome: "success",
  selected: 0,
  results: {
    success: { heading: "远征告捷", note: "风声渐息，旅者带着拾得的遗物返回。" },
    failure: { heading: "远征失利", note: "脚步止于深处，但残存的记忆仍可带走。" }
  },
  stats: [
    {label: "本次时间", value: "00:42:18"},
    {label: "击败数", value: "37"},
    {label: "收获", value: "540 吉欧"}
  ],
  rewards: [
    {id:"reward-1", name:"幽深之徽", icon:"assets/inventory/crest.svg", description:"在远征尽头找到的微光徽记。\n\n它记录了旅者曾越过的寂静门扉；此处仅作结算演示，不赋予真实游戏能力。"},
    {id:"reward-2", name:"残存吉欧", icon:"assets/inventory/geo.svg", description:"从破碎石匣中收集的货币碎片。即使远征失败，旅途所得仍值得回望。"},
    {id:"reward-3", name:"古旧卷页", icon:"assets/inventory/scroll.svg", description:"一张边缘磨损的卷页，记着一段没有署名的路。翻阅它不会改变真实存档。"},
    {id:"reward-4", name:"回响之灵", icon:"assets/inventory/spirit.svg", description:"幽暗中凝结的回响，像要指引下一次出发。"}
  ]
};
