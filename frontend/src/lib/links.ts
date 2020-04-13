export const redirect = (url: string, tab?: boolean): void => {
  if (tab) {
    window.open(url, "_blank");
    return;
  }

  window.open(url, "_self");
};
