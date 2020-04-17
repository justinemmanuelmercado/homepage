/**
 * react-hotkeys library relies on
 * `key`, but `code` will be used
 * to distinguish the actual keypressed
 */
interface ShortcutKeyAndCode {
  code: string;
  key: string;
}

export const OPEN_LINK_SHORTCUT_KEYS: ShortcutKeyAndCode[] = [
  "1",
  "2",
  "3",
  "4",
  "5"
].map(d => {
  return { code: `Digit${d}`, key: d };
});

export const generalMovement = {
  PREV: ["left", "a"],
  NEXT: ["right", "d"],
  OPEN_PAGE: [
    ...OPEN_LINK_SHORTCUT_KEYS.map(n => n.key),
    ...OPEN_LINK_SHORTCUT_KEYS.map(n => `shift+${n.key}`)
  ]
};
