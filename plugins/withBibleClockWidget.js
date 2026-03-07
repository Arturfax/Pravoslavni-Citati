const { withXcodeProject, withDangerousMod } = require("@expo/config-plugins");
const path = require("path");
const fs = require("fs");

const WIDGET_TARGET_NAME = "BibleClockWidget";
const WIDGET_SOURCE_DIR = path.join(
  __dirname,
  "..",
  "ios-widgets",
  "BibleClockWidget"
);

/**
 * Copies widget source files into the iOS project directory.
 */
function withWidgetFiles(config) {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const iosProjectRoot = config.modRequest.platformProjectRoot;
      const destDir = path.join(iosProjectRoot, WIDGET_TARGET_NAME);

      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      const files = fs.readdirSync(WIDGET_SOURCE_DIR);
      for (const file of files) {
        const src = path.join(WIDGET_SOURCE_DIR, file);
        const dest = path.join(destDir, file);
        fs.copyFileSync(src, dest);
      }

      return config;
    },
  ]);
}

/**
 * Adds the WidgetKit extension target to the Xcode project.
 */
function withWidgetXcodeTarget(config) {
  return withXcodeProject(config, async (config) => {
    const xcodeProject = config.modResults;
    const appBundleId = config.ios?.bundleIdentifier ?? "com.app";
    const widgetBundleId = `${appBundleId}.widget`;

    // Avoid adding duplicate targets on repeated prebuild runs
    const existingTargets = xcodeProject.pbxNativeTargetSection();
    const alreadyAdded = Object.values(existingTargets).some(
      (t) => t && t.name === WIDGET_TARGET_NAME
    );
    if (alreadyAdded) {
      return config;
    }

    // ---- Add target ----
    const widgetTarget = xcodeProject.addTarget(
      WIDGET_TARGET_NAME,
      "app_extension",
      WIDGET_TARGET_NAME,
      widgetBundleId
    );

    // ---- Add build phases ----
    xcodeProject.addBuildPhase(
      [`${WIDGET_TARGET_NAME}/BibleClockWidget.swift`],
      "PBXSourcesBuildPhase",
      "Sources",
      widgetTarget.uuid
    );

    xcodeProject.addBuildPhase(
      [],
      "PBXFrameworksBuildPhase",
      "Frameworks",
      widgetTarget.uuid
    );

    xcodeProject.addBuildPhase(
      [],
      "PBXResourcesBuildPhase",
      "Resources",
      widgetTarget.uuid
    );

    // ---- Add file group ----
    xcodeProject.addPbxGroup(
      ["BibleClockWidget.swift", "Info.plist"],
      WIDGET_TARGET_NAME,
      WIDGET_TARGET_NAME
    );

    // ---- Build settings for every configuration of the new target ----
    const buildConfigs = xcodeProject.pbxXCBuildConfigurationSection();
    for (const key of Object.keys(buildConfigs)) {
      const cfg = buildConfigs[key];
      if (
        cfg &&
        cfg.buildSettings &&
        (cfg.buildSettings.PRODUCT_NAME === `"${WIDGET_TARGET_NAME}"` ||
          cfg.buildSettings.PRODUCT_NAME === WIDGET_TARGET_NAME)
      ) {
        Object.assign(cfg.buildSettings, {
          ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES: "NO",
          CLANG_ENABLE_MODULES: "YES",
          INFOPLIST_FILE: `"${WIDGET_TARGET_NAME}/Info.plist"`,
          IPHONEOS_DEPLOYMENT_TARGET: "16.0",
          LD_RUNPATH_SEARCH_PATHS: '"$(inherited) @executable_path/Frameworks @executable_path/../../Frameworks"',
          MARKETING_VERSION: "1.0.0",
          CURRENT_PROJECT_VERSION: "1",
          PRODUCT_BUNDLE_IDENTIFIER: `"${widgetBundleId}"`,
          PRODUCT_NAME: `"${WIDGET_TARGET_NAME}"`,
          SKIP_INSTALL: "YES",
          SWIFT_EMIT_LOC_STRINGS: "YES",
          SWIFT_VERSION: "5.0",
          TARGETED_DEVICE_FAMILY: '"1,2"',
        });
      }
    }

    return config;
  });
}

/**
 * Main export — compose both modifiers.
 */
module.exports = function withBibleClockWidget(config) {
  config = withWidgetFiles(config);
  config = withWidgetXcodeTarget(config);
  return config;
};
