// 色の糸 - 12色のパレット定義（日本の伝統色名）
export interface PaletteColor {
  colorId: string;
  hex: string;
  defaultName: string;
}

export const PALETTE: PaletteColor[] = [
  { colorId: 'sakura', hex: '#F8C8D8', defaultName: '桜色' },
  { colorId: 'shu', hex: '#E67370', defaultName: '朱色' },
  { colorId: 'yamabuki', hex: '#F5C242', defaultName: '山吹' },
  { colorId: 'moegi', hex: '#A8D672', defaultName: '萌黄' },
  { colorId: 'asagi', hex: '#6FC0C9', defaultName: '浅葱' },
  { colorId: 'gunjo', hex: '#4A6FB5', defaultName: '群青' },
  { colorId: 'fuji', hex: '#B79FD4', defaultName: '藤色' },
  { colorId: 'namari', hex: '#8B8B8B', defaultName: '鉛色' },
  { colorId: 'kikyo', hex: '#6B5B95', defaultName: '桔梗' },
  { colorId: 'cha', hex: '#8B5E3C', defaultName: '茶' },
  { colorId: 'kuro', hex: '#1A1A1A', defaultName: '黒' },
  { colorId: 'shiro', hex: '#F5F5F5', defaultName: '白' },
];

// テーマ色
export const THEME = {
  background: '#FBF7F2',  // クリーム白
  card: '#FFFFFF',
  text: '#2F2A26',        // ダークブラウン
  textSub: '#8B8378',
  border: '#E8E0D6',
  accent: '#2F2A26',
};

export const hexById = (id: string): string => {
  return PALETTE.find(c => c.colorId === id)?.hex || '#CCCCCC';
};
