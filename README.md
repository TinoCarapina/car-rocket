# Car Rocket: Android + iOS

## 1. Install once
- Node.js 20 or newer (nodejs.org)
- Android: Android Studio (it includes the JDK and SDK)
- iOS: a Mac with Xcode and CocoaPods (`sudo gem install cocoapods`)

## 2. Set up (in this folder)
    npm install
    npm run setup

This creates the android/ (and on a Mac, ios/) projects, adds the AdMob ids, locks portrait,
generates icons and splash screens, and syncs the game into the apps.

## 3. Run and build
    npm run android      # opens Android Studio -> Run on a phone, or Build > Generate Signed Bundle (.aab)
    npm run ios          # opens Xcode -> Run, or Product > Archive to upload to App Store Connect

After any change to www/index.html run `npm run sync`.

## 4. Before you publish (important)
1. Change `appId` in capacitor.config.json (now com.voltglide.app) BEFORE step 2. It cannot be changed after release.
2. AdMob: create the app + 2 ad units (interstitial, rewarded) per platform, put the ids in www/config.js, set testMode to false, run `npm run setup` again (or edit the manifest/Info.plist ids).
3. Remove ads: create a non-consumable product in Google Play and App Store Connect, connect both in RevenueCat, create entitlement `no_ads`, put the public SDK keys in www/config.js.
4. Both stores require a privacy policy URL because the app uses ads.
5. iOS: add the remaining SKAdNetwork ids from Google's AdMob iOS guide to Info.plist.

## Sharing
After every game the player can share a result image (last frame, score, car) and any unlocked car.
It uses the phone share sheet (Instagram, TikTok, Facebook, X, WhatsApp...) via @capacitor/share + @capacitor/filesystem.
Put your store link in `shareUrl` in www/config.js once the app is live. Run `npm run sync` after pulling changes.

## Playable link + APK without any store (GitHub, free)
1. Create a free GitHub account and a PUBLIC repository (e.g. car-rocket).
2. In this folder run:
       git init && git add . && git commit -m "Car Rocket" && git branch -M main
       git remote add origin https://github.com/YOUR_NAME/car-rocket.git && git push -u origin main
3. Repo > Settings > Pages > Source: GitHub Actions. Then Actions > "Build Car Rocket" > Run workflow.
4. After a few minutes:
   - Play link: https://YOUR_NAME.github.io/car-rocket/  (anyone can open it; on phones "Add to Home Screen" installs it)
   - APK: repo > Releases > latest > car-rocket.apk (direct link works for everyone while the repo is public)
Optional: put the play link into `shareUrl` in www/config.js so the app shares it too.
Instead of GitHub you can also drag the contents of www/ (car-rocket-web.zip) onto https://app.netlify.com/drop.
The APK is debug-signed with test ads; it installs on Android after allowing "install unknown apps".
