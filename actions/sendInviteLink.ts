'use server';

import twilio from 'twilio';

export async function sendInviteLink(phoneNumber: string) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKeySid = process.env.TWILIO_API_KEY_SID;
    const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    if (!accountSid || !apiKeySid || !apiKeySecret || !fromNumber) {
      throw new Error('Twilio credentials are not fully configured.');
    }

    // Initialize Twilio Client using API Key
    const client = twilio(apiKeySid, apiKeySecret, { accountSid });

    // Ensure the phone number starts with 'whatsapp:' format if not already
    const to = phoneNumber.startsWith('whatsapp:') ? phoneNumber : `whatsapp:${phoneNumber}`;
    
    // The Twilio from number must also be in 'whatsapp:' format
    const from = fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`;

    const message = await client.messages.create({
      contentSid: 'HXfe5ab5f00277942d4d4200328b4d403c',
      contentVariables: JSON.stringify({
        "1": "https://app.localhost:3000/checkin/demo-token",
        "2": "SwiftGate Express"
      }),
      from,
      to,
    });

    return { success: true, messageId: message.sid };
  } catch (error: any) {
    console.error('Failed to send WhatsApp invite:', error);
    return { success: false, error: error.message || 'Failed to send invite' };
  }
}
