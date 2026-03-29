const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const FILE_PATH = ["node_modules", "@bacons", "apple-targets", "ios", "ExtensionStorageModule.swift"];

function replaceOnce(source, searchValue, replaceValue) {
  if (source.includes(replaceValue)) {
    return source;
  }

  if (!source.includes(searchValue)) {
    throw new Error(`withExtensionStorageSync could not find expected source block:\n${searchValue}`);
  }

  return source.replace(searchValue, replaceValue);
}

module.exports = (config) =>
  withDangerousMod(config, [
    "ios",
    async (config) => {
      const filePath = path.join(config.modRequest.projectRoot, ...FILE_PATH);
      let source = fs.readFileSync(filePath, "utf8");

      source = replaceOnce(
        source,
        "import ExpoModulesCore\nimport WidgetKit\n",
        "import Foundation\nimport ExpoModulesCore\nimport WidgetKit\n",
      );

      source = replaceOnce(
        source,
        `        Function("remove") { (forKey: String, suiteName: String?) in
            UserDefaults(suiteName: suiteName)?.removeObject(forKey: forKey)
        }
`,
        `        Function("remove") { (forKey: String, suiteName: String?) in
            let userDefaults = UserDefaults(suiteName: suiteName)
            userDefaults?.removeObject(forKey: forKey)
            userDefaults?.synchronize()
        }
`,
      );

      source = replaceOnce(
        source,
        `        Function("reloadWidget") { (timeline: String?) in
            if let timeline = timeline {
                WidgetCenter.shared.reloadTimelines(ofKind: timeline)
            } else {
                WidgetCenter.shared.reloadAllTimelines()
            }
        }
`,
        `        Function("reloadWidget") { (timeline: String?) in
            DispatchQueue.main.async {
                if let timeline = timeline {
                    WidgetCenter.shared.reloadTimelines(ofKind: timeline)
                } else {
                    WidgetCenter.shared.reloadAllTimelines()
                }
            }
        }
`,
      );

      source = replaceOnce(
        source,
        `        Function("setArray") { (forKey: String, data: [[String: Any]], suiteName: String?) -> Bool in
            // Convert the incoming array of dictionaries directly to JSON data
            do {
                let jsonData = try JSONSerialization.data(withJSONObject: data, options: [])
                UserDefaults(suiteName: suiteName)?.set(jsonData, forKey: forKey)
                return true
            } catch {
                // If encoding fails for some reason, return false
                return false
            }
        }
`,
        `        Function("setArray") { (forKey: String, data: [[String: Any]], suiteName: String?) -> Bool in
            // Convert the incoming array of dictionaries directly to JSON data
            do {
                let jsonData = try JSONSerialization.data(withJSONObject: data, options: [])
                let userDefaults = UserDefaults(suiteName: suiteName)
                userDefaults?.set(jsonData, forKey: forKey)
                userDefaults?.synchronize()
                return true
            } catch {
                // If encoding fails for some reason, return false
                return false
            }
        }
`,
      );

      source = replaceOnce(
        source,
        `        Function("setObject") { (forKey: String, data: [String: Any], suiteName: String?) -> Bool in
            do {
                let jsonData = try JSONSerialization.data(withJSONObject: data, options: [])
                UserDefaults(suiteName: suiteName)?.set(jsonData, forKey: forKey)
                return true
            } catch {
                // If encoding fails for some reason, return false
                return false
            }
        }
`,
        `        Function("setObject") { (forKey: String, data: [String: Any], suiteName: String?) -> Bool in
            do {
                let jsonData = try JSONSerialization.data(withJSONObject: data, options: [])
                let userDefaults = UserDefaults(suiteName: suiteName)
                userDefaults?.set(jsonData, forKey: forKey)
                userDefaults?.synchronize()
                return true
            } catch {
                // If encoding fails for some reason, return false
                return false
            }
        }
`,
      );

      source = replaceOnce(
        source,
        `        Function("setInt") { (key: String, value: Int, group: String?) in
            let userDefaults = UserDefaults(suiteName: group)
            userDefaults?.set(value, forKey: key)
        }
`,
        `        Function("setInt") { (key: String, value: Int, group: String?) in
            let userDefaults = UserDefaults(suiteName: group)
            userDefaults?.set(value, forKey: key)
            userDefaults?.synchronize()
        }
`,
      );

      source = replaceOnce(
        source,
        `        Function("setString") { (key: String, value: String, group: String?) in
            let userDefaults = UserDefaults(suiteName: group)
            userDefaults?.set(value, forKey: key)
        }        
`,
        `        Function("setString") { (key: String, value: String, group: String?) in
            let userDefaults = UserDefaults(suiteName: group)
            userDefaults?.set(value, forKey: key)
            userDefaults?.synchronize()
        }        
`,
      );

      fs.writeFileSync(filePath, source);
      return config;
    },
  ]);
