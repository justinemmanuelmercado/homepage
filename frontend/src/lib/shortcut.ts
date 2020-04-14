export const OPEN_LINK_SHORTCUT_KEYS = ["1", "2", "3", "4", "5"];

export const generalMovement = {
  PREV: ["left", "a"],
  NEXT: ["right", "d"],
  OPEN_PAGE: [
    ...OPEN_LINK_SHORTCUT_KEYS,
    ...OPEN_LINK_SHORTCUT_KEYS.map(n => `shift+${n}`)
  ]
};
