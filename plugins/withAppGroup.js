const { withEntitlementsPlist } = require("@expo/config-plugins");

const APP_GROUP = "group.com.pravoslavnicitati.app";

module.exports = (config) => {
  config.ios = config.ios ?? {};
  config.ios.entitlements = config.ios.entitlements ?? {};

  const groups = Array.from(
    new Set([
      ...(config.ios.entitlements["com.apple.security.application-groups"] ?? []),
      APP_GROUP,
    ]),
  );

  config.ios.entitlements["com.apple.security.application-groups"] = groups;

  return withEntitlementsPlist(config, (mod) => {
    mod.modResults["com.apple.security.application-groups"] = groups;
    return mod;
  });
};
