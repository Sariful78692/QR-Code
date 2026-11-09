# QR পরিচয়পত্র জেনারেটর

## ১) Google Sheet তৈরি

1. একটি নতুন Google Sheet খুলুন।
2. `Extensions → Apps Script` এ যান।
3. `google-apps-script/Code.gs`-এর কোড paste করে Save করুন।
4. `Deploy → New deployment → Web app` নির্বাচন করুন।
5. `Execute as: Me` এবং `Who has access: Anyone` নির্বাচন করে Deploy করুন।
6. পাওয়া Web app URL কপি করুন।

## ২) Site-এ endpoint বসানো

`app.js` ফাইলে এই লাইনে URL বসান:

```js
const GOOGLE_SHEET_ENDPOINT = 'আপনার-Google-Apps-Script-Web-App-URL';
```

তারপর `index.html` ব্রাউজারে খুললেই site চলবে। ফর্ম submit করলে Google Sheet-এর `Responses` tab-এ নাম, জন্মতারিখ, ঠিকানা, ID এবং সময় জমা হবে।

## ৩) Test

প্রথমে URL খালি রেখে test করলে QR তৈরি হবে, কিন্তু সেটি Demo mode। URL বসানোর পর আবার test submission দিন। Apps Script deployment বদলালে `Deploy → Manage deployments → Edit → New version` করে redeploy করুন।

> নোট: QR Code-এর মধ্যে ব্যক্তিগত তথ্য থাকবে। তাই QR Code কেবল বিশ্বাসযোগ্য ব্যক্তির সঙ্গে শেয়ার করুন। Production ব্যবহারে Google Apps Script-এ authentication/access control যোগ করা ভালো।
