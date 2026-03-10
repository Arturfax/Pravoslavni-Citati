Pod::Spec.new do |s|
  s.name = "WidgetPreferences"
  s.version = "1.0.0"
  s.summary = "Shared widget preferences for Pravoslavni Citati"
  s.description = "Expo module that stores the selected widget quote in the shared app group and refreshes WidgetKit timelines."
  s.author = ""
  s.homepage = "https://docs.expo.dev/modules/"
  s.platform = :ios, "15.1"
  s.source = { git: "" }
  s.static_framework = true

  s.dependency "ExpoModulesCore"

  s.pod_target_xcconfig = {
    "DEFINES_MODULE" => "YES",
    "SWIFT_COMPILATION_MODE" => "wholemodule"
  }

  s.source_files = "ios/**/*.{h,m,mm,swift,hpp,cpp}"
end
