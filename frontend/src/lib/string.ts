export function getDomain(url: string): string {
  const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
  if (
    match != null &&
    match.length > 2 &&
    typeof match[2] === "string" &&
    match[2].length > 0
  ) {
    const hostName = match[2];
    let domain = hostName;

    if (hostName != null) {
      const parts = hostName.split(".").reverse();

      if (parts != null && parts.length > 1) {
        domain = parts[1] + "." + parts[0];

        if (
          hostName.toLowerCase().indexOf(".co.uk") !== -1 &&
          parts.length > 2
        ) {
          domain = parts[2] + "." + domain;
        }
      }
    }

    return domain.split(".")[0];
  } else {
    return url;
  }
}

export const truncateText = (text: string, length = 50): string => {
  if (text.length < length) {
    return text;
  }

  return `${text.substring(0, length)}...`;
};
