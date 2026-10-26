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
