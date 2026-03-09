const { withEntitlementsPlist } = require("@expo/config-plugins");

const APP_GROUP = "group.com.pravoslavnicitati.app";

module.exports = (config) =>
  withEntitlementsPlist(config, (mod) => {
    const groups =
      mod.modResults["com.apple.security.application-groups"] ?? [];
    if (!groups.includes(APP_GROUP)) {
      groups.push(APP_GROUP);
    }
    mod.modResults["com.apple.security.application-groups"] = groups;
    return mod;
  });
