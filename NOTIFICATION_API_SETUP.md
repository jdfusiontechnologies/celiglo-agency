# Celiglo Agency Limited — SMS & Email API Integration Guide

This guide details how to link **Africa's Talking SMS API** and **Email Delivery (SendGrid / Resend / SMTP)** to your Celiglo Agency Limited platform.

---

## 1. Africa's Talking SMS API (Kenya)

### Step 1: Create an Africa's Talking Account
1. Visit [https://africastalking.com](https://africastalking.com) and register an account.
2. Under the Africa's Talking dashboard:
   - For initial testing, toggle to **Sandbox** mode (Username: `sandbox`).
   - For live sending to Safaricom, Airtel, and Telkom numbers in Kenya, select your live team/app.
3. Generate an API Key under **Settings → API Key** (starts with `atsk_...`).
4. (Optional) Request a branded Alphanumeric Sender ID (e.g. `CELIGLO`) approved by the Communications Authority of Kenya (CAK).

---

### Step 2: Configure via Admin Console
1. Log into your Celiglo Executive / Admin Portal (`/portal` or top right **Sign In** as Administrator).
2. Go to **SMS & Notifications → Live SMS & Email API Gateway Settings**.
3. Fill in:
   - **Africa's Talking Username**: `sandbox` or your live account username.
   - **Africa's Talking API Key**: Your `atsk_...` key.
   - **Sender ID**: Your approved alphanumeric sender ID (or leave blank for standard gateway code).
4. Click **Save Live API Credentials**.

---

### Step 3: Backend Production Code (PHP & Node.js)

#### Option A: PHP cURL Implementation (for XAMPP / cPanel / Apache)
Save this inside `php-source/includes/notifications.php`:

```php
<?php
/**
 * Send SMS via Africa's Talking API
 */
function sendAfricasTalkingSMS($phoneNumber, $messageText, $apiKey, $username, $senderId = '') {
    // Kenyan phone formatting (+254...)
    $phone = preg_replace('/[^0-9]/', '', $phoneNumber);
    if (str_starts_with($phone, '07') || str_starts_with($phone, '01')) {
        $phone = '+254' . substr($phone, 1);
    } elseif (!str_starts_with($phone, '+')) {
        $phone = '+' . $phone;
    }

    $url = ($username === 'sandbox')
        ? 'https://api.sandbox.africastalking.com/version1/messaging'
        : 'https://api.africastalking.com/version1/messaging';

    $postData = [
        'username' => $username,
        'to'       => $phone,
        'message'  => $messageText,
    ];
    if (!empty($senderId)) {
        $postData['from'] = $senderId;
    }

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apiKey: ' . $apiKey,
        'Content-Type: application/x-www-form-urlencoded',
        'Accept: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return [
        'success'  => ($httpCode === 200 || $httpCode === 201),
        'response' => json_decode($response, true)
    ];
}
```

#### Option B: Node.js / Express Server Implementation
If running full-stack Node.js server:

```typescript
import axios from 'axios';

export async function sendSms(to: string, message: string, apiKey: string, username: string, senderId?: string) {
  const url = username === 'sandbox'
    ? 'https://api.sandbox.africastalking.com/version1/messaging'
    : 'https://api.africastalking.com/version1/messaging';

  const params = new URLSearchParams();
  params.append('username', username);
  params.append('to', to);
  params.append('message', message);
  if (senderId) params.append('from', senderId);

  const res = await axios.post(url, params.toString(), {
    headers: {
      'apiKey': apiKey,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    }
  });

  return res.data;
}
```

---

## 2. Gmail Integration (Using jdfusiontechnologies@gmail.com)

If you do not want to use a domain email (`@celiglo.co.ke`) and prefer using your Gmail account (`jdfusiontechnologies@gmail.com`), follow these exact steps:

### Why an "App Password" is Required
Google **does not allow** your standard personal account password to be used in automated scripts or third-party SMTP dispatch. Instead, Google issues a dedicated **16-character App Password**.

### Step-by-Step Instructions:
1. **Enable 2-Step Verification** on your Google Account:
   - Visit [https://myaccount.google.com/security](https://myaccount.google.com/security).
   - Under *"How you sign in to Google"*, verify that **2-Step Verification** is turned **ON**.
2. **Generate your 16-character App Password**:
   - Go directly to: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
   - In the *"App name"* box, enter **Celiglo Agency**.
   - Click **Create**.
   - Google will show a yellow/white pop-up with a 16-character password (e.g., `abcd efgh ijkl mnop`).
   - Copy this 16-character code.
3. **Link it to Celiglo Agency**:
   - Log into the **Admin Portal** on this website.
   - Go to **SMS & Notifications → Live SMS & Email API Gateway Settings**.
   - Under **2. Real Email Dispatch Gateway**:
     - **Email Provider**: Select `Gmail (Official: jdfusiontechnologies@gmail.com)`.
     - **From Gmail Address**: `jdfusiontechnologies@gmail.com`.
     - **Gmail App Password (16 chars)**: Paste your 16-character code.
   - Click **Save Live API Credentials**.
4. **Verify Delivery**:
   - In the **Real Gmail Delivery Verifier** box, click **Send Real Test Email via Gmail**.
   - Check your Gmail inbox (`jdfusiontechnologies@gmail.com`) to confirm immediate receipt!

---

## 3. Automation Trigger on Status Change
In both the React Admin Portal and backend API, real notifications are automatically dispatched:
- **SMS**: Dispatched to the customer's phone number via Africa's Talking.
- **Email**: Dispatched directly through your connected Gmail account (`jdfusiontechnologies@gmail.com`) whenever a request is marked **Completed** or **Ready for Collection or Delivery**.
- Official slogan in every notice: `DONT MIX IT, SORT IT, TAKA NI PESA.`
