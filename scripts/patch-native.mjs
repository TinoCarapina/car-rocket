// Run after `cap add`. Adds AdMob ids, portrait lock and ad permissions to the native projects.
import fs from 'node:fs';
const cfgSrc = fs.readFileSync('www/config.js', 'utf8');
const cfg = new Function('window', cfgSrc + ';return window.VG_CONFIG')({});
const edit = (file, fn) => { if (!fs.existsSync(file)) return; const a = fs.readFileSync(file, 'utf8'), b = fn(a); if (a !== b) fs.writeFileSync(file, b); console.log('patched', file); };

edit('android/app/src/main/AndroidManifest.xml', x => {
  if (!x.includes('APPLICATION_ID')) x = x.replace('</application>', `    <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="${cfg.admobAppId.android}"/>\n    </application>`);
  if (!x.includes('screenOrientation')) x = x.replace('<activity', '<activity\n            android:screenOrientation="portrait"');
  if (!x.includes('permission.AD_ID')) x = x.replace('</manifest>', '    <uses-permission android:name="com.google.android.gms.permission.AD_ID"/>\n</manifest>');
  return x;
});

edit('ios/App/App/Info.plist', x => {
  if (!x.includes('GADApplicationIdentifier')) x = x.replace(/<\/dict>\s*<\/plist>/, `\t<key>GADApplicationIdentifier</key>\n\t<string>${cfg.admobAppId.ios}</string>\n\t<key>NSUserTrackingUsageDescription</key>\n\t<string>This identifier is used to show you more relevant ads.</string>\n\t<key>SKAdNetworkItems</key>\n\t<array>\n\t\t<dict><key>SKAdNetworkIdentifier</key><string>cstr6suwn9.skadnetwork</string></dict>\n\t</array>\n</dict>\n</plist>`);
  x = x.replace(/(<key>UISupportedInterfaceOrientations<\/key>\s*<array>)[\s\S]*?(<\/array>)/, '$1\n\t\t<string>UIInterfaceOrientationPortrait</string>\n\t$2');
  return x;
});

// Signed release bundle (.aab) for Google Play: reads the upload key from environment variables set by the GitHub workflow.
edit('android/app/build.gradle', x => {
  if (x.includes('KEYSTORE_PATH')) return x;
  x = x.replace('versionCode 1', 'versionCode Integer.parseInt(System.getenv("VERSION_CODE") ?: "1")');
  x = x.replace('    buildTypes {\n        release {\n            minifyEnabled false',
`    signingConfigs {
        release {
            if (System.getenv("KEYSTORE_PATH")) {
                storeFile file(System.getenv("KEYSTORE_PATH"))
                storePassword System.getenv("KEYSTORE_PASSWORD")
                keyAlias System.getenv("KEY_ALIAS")
                keyPassword System.getenv("KEY_PASSWORD")
            }
        }
    }
    buildTypes {
        release {
            if (System.getenv("KEYSTORE_PATH")) { signingConfig signingConfigs.release }
            minifyEnabled false`);
  if (!x.includes('signingConfigs')) console.warn('WARNING: could not add signing config to build.gradle');
  return x;
});
