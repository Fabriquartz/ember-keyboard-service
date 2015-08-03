export default function parseKeyShorthand(key, options) {
  key.split('+').forEach((k) => {
    switch (k) {
      case 'nctrl':
        options.useCmdOnMac = true;
        /* falls through */
      case 'ctrl':
        options.requireCtrl = true;
        break;

      case 'meta':
      case 'cmd':
        options.requireMeta  = true;
        break;

      case 'alt':
      case 'option':
        options.requireAlt = true;
        break;

      case 'shift':
        options.requireShift = true;
        break;

      default: key = k;
    }
  });

  return key;
}
