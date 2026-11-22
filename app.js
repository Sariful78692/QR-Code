const GOOGLE_SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyTa7tjMuCxboQyrp3mm5gP2rf1dejq4HKAGAqaRycAv3u7fxj0R9uScQBavAbCwEvi/exec';
const form = document.getElementById('profileForm');
const contactFields = document.getElementById('contactFields');
const menuItems = document.querySelectorAll('.menu-item');
const statusEl = document.getElementById('status');
const qrStage = document.getElementById('qrStage');
const downloadBtn = document.getElementById('downloadBtn');
let qrImageUrl = '';
let qrFileName = 'qr-porichoypotro.png';
let selectedMenuType = 'profile';
const profileFieldIds = ['name', 'dob', 'documentLast4', 'customText', 'address'];
const menuFieldTemplates = {
  whatsapp: '<label for="contactValue">WhatsApp Number</label><input id="contactValue" name="contactValue" type="tel" placeholder="e.g. +91 98765 43210"><label for="contactMessage">Message (optional)</label><input id="contactMessage" name="contactMessage" type="text" placeholder="Hello...">',
  facebook: '<label for="contactValue">Facebook Profile URL</label><input id="contactValue" name="contactValue" type="url" placeholder="https://facebook.com/your-profile">',
  website: '<label for="contactValue">Website URL</label><input id="contactValue" name="contactValue" type="url" placeholder="https://example.com">',
  email: '<label for="contactValue">Email Address</label><input id="contactValue" name="contactValue" type="email" placeholder="you@example.com"><label for="contactMessage">Email Subject (optional)</label><input id="contactMessage" name="contactMessage" type="text" placeholder="Subject">',
  wifi: '<label for="wifiSsid">Wi-Fi Name (SSID)</label><input id="wifiSsid" name="wifiSsid" type="text" placeholder="Network name" required><label for="wifiPassword">Wi-Fi Password</label><input id="wifiPassword" name="wifiPassword" type="text" placeholder="Password"><label for="wifiSecurity">Security</label><select id="wifiSecurity" name="wifiSecurity"><option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">No password</option></select>'
};
menuItems.forEach((item) => item.addEventListener('click', () => {
  selectedMenuType = item.dataset.type;
  menuItems.forEach((menuItem) => menuItem.classList.toggle('active', menuItem === item));
  contactFields.innerHTML = menuFieldTemplates[selectedMenuType] || '';
  profileFieldIds.forEach((id) => {
    const field = document.getElementById(id);
    const label = field?.previousElementSibling;
    const isProfile = selectedMenuType === 'profile';
    if (field) {
      field.closest('label')?.classList.toggle('hidden-field', !isProfile);
      field.classList.toggle('hidden-field', !isProfile);
      field.required = isProfile && id !== 'customText';
    }
    if (label?.tagName === 'LABEL') label.classList.toggle('hidden-field', !isProfile);
  });
}));

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const record = { ...data, type: selectedMenuType, createdAt: new Date().toISOString() };
  statusEl.className = 'status';
  statusEl.textContent = 'Generating QR Code...';
  renderQr(record);
  if (!GOOGLE_SHEET_ENDPOINT) {
    statusEl.className = 'status success';
    statusEl.textContent = 'Demo mode: Add a Google Sheet URL to save information.';
    return;
  }
  try {
    await fetch(GOOGLE_SHEET_ENDPOINT, { method: 'POST', mode: 'no-cors', body: JSON.stringify(record) });
    statusEl.className = 'status success';
    statusEl.textContent = 'Information saved successfully.';
  } catch (error) {
    statusEl.className = 'status error';
    statusEl.textContent = 'QR created, but it was not saved to Google Sheets. Check the URL or deployment.';
  }
});

function renderQr(record) {
  qrStage.innerHTML = '';
  const content = [
    ...(selectedMenuType === 'profile' ? [] : ['QR Profile', `Type: ${selectedMenuType}`]),
    `Name: ${record.name}`,
    `Date of Birth: ${record.dob}`,
    `Documents Number (Last 4 digits): ${record.documentLast4}`,
    `Custom Text: ${record.customText || ''}`,
    record.contactValue ? `Contact: ${record.contactValue}` : '',
    record.contactMessage ? `Message/Subject: ${record.contactMessage}` : '',
    `Address: ${record.address}`
  ].join('\n');
  const wifiContent = selectedMenuType === 'wifi'
    ? `WIFI:T:${record.wifiSecurity || 'WPA'};S:${escapeWifi(record.wifiSsid)};P:${escapeWifi(record.wifiPassword)};;`
    : content;
  qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&ecc=H&margin=0&data=${encodeURIComponent(wifiContent)}`;
  const safeName = (record.name || 'profile')
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 80) || 'profile';
  qrFileName = `${safeName}-QR.png`;
  const image = document.createElement('img');
  image.src = qrImageUrl;
  image.alt = 'Generated QR Code';
  image.width = 220;
  image.height = 220;
  image.onload = () => { downloadBtn.disabled = false; };
  qrStage.appendChild(image);
  document.getElementById('resultInfo').hidden = false;
  document.getElementById('resultName').textContent = record.name;
  document.getElementById('resultMeta').textContent = `Date of Birth: ${record.dob} · Documents Number: ${record.documentLast4}`;
}

function escapeWifi(value = '') {
  return value.replace(/([\\;,:])/g, '\\$1');
}

downloadBtn.addEventListener('click', async () => {
  if (!qrImageUrl) return;
  downloadBtn.disabled = true;
  const originalText = downloadBtn.textContent;
  downloadBtn.textContent = 'Downloading...';
  try {
    const response = await fetch(qrImageUrl, { mode: 'cors' });
    if (!response.ok) throw new Error('QR image download failed');
    const blobUrl = URL.createObjectURL(await response.blob());
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = qrFileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    // Do not open a new tab when the provider blocks a cross-origin download.
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = qrFileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    downloadBtn.disabled = false;
    downloadBtn.textContent = originalText;
  }
});

