# QR Profile Generator

## 1) Create a Google Sheet

1. Create a new Google Sheet.
2. Open `Extensions → Apps Script`.
3. Paste the code from `google-apps-script/Code.gs` and save it.
4. Select `Deploy → New deployment → Web app`.
5. Choose `Execute as: Me` and `Who has access: Anyone`, then deploy.
6. Copy the generated Web app URL.

## 2) Add the endpoint to the site

Add the URL to this line in `app.js`:

```js
const GOOGLE_SHEET_ENDPOINT = 'YOUR-GOOGLE-APPS-SCRIPT-WEB-APP-URL';
```

Open `index.html` in a browser. Form submissions will be saved to the `Responses` tab in Google Sheets.

## 3) Test

If the endpoint is empty, the QR Code will still be generated in Demo mode. After adding the URL, submit the form again. If the Apps Script deployment changes, create a new version from `Deploy → Manage deployments → Edit` and redeploy.

> Note: The QR Code contains personal information. Share it only with trusted people. For production use, add authentication and access control to the Google Apps Script.
