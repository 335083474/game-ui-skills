// Customer-authored upgrade contract. Local assets only; edits reload on refresh.
window.UPGRADE_DATA = {
  title: 'BOON UPGRADE', subtitle: 'Spend your Obols wisely', balance: 160,
  options: [
    {title:'Swift Passage',rarity:'Rare',icon:'components/icon-haste-ref.png',description:'Move faster through the Underworld.\nKeep your momentum.',metric:'Move speed',current:20,increment:10,unit:'%',price:60},
    {title:'Veil of Fortune',rarity:'Epic',icon:'components/icon-evasion-ref.png',description:'Evade a portion of incoming attacks. The veil protects you while moving, attacking, and recovering from a dash. Each upgrade increases the chance to avoid damage, but does not make you invulnerable. Multiple hits are evaluated separately; remain alert when surrounded. This longer description is intentionally retained in full so players can read every condition before spending their coins.',metric:'Dodge chance',current:15,increment:5,unit:'%',price:200},
    {title:'Flashing Spear',rarity:'Rare',icon:'components/icon-strike-ref.png',description:'Your strikes hit harder.\nPower favors the bold.',metric:'Strike damage',current:40,increment:20,unit:'%',price:100}
  ]
};
