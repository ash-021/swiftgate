'use server';

export async function sendInviteLink(phoneNumber: string) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKeySid = process.env.TWILIO_API_KEY_SID;
    const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;

    if (!accountSid || !apiKeySid || !apiKeySecret) {
      throw new Error('Twilio credentials are not fully configured.');
    }

    // 1. Revert the sender: Hardcode the From parameter to the legacy sandbox
    const from = 'whatsapp:+14155238886';
    const to = phoneNumber.startsWith('whatsapp:') ? phoneNumber : `whatsapp:${phoneNumber}`;

    // 2. Auth Setup
    const auth = Buffer.from(`${apiKeySid}:${apiKeySecret}`).toString('base64');

    // 3. Payload
    const params = new URLSearchParams();
    params.append('To', to);
    params.append('From', from);
    params.append('Body', 'Welcome to SwiftGate Hotel! Please complete your express check-in here: https://app.swiftgate.in/checkin/demo-token');

    // 4. Fetch Call
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send invite via Twilio API');
    }

    return { success: true, messageId: data.sid };
  } catch (error: any) {
    console.error('Failed to send WhatsApp invite:', error);
    return { success: false, error: error.message || 'Failed to send invite' };
  }
}
