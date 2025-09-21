import { env } from '../env.js';
import { Vonage } from '@vonage/server-sdk';
import { Channels } from '@vonage/verify2';

const vonage = new Vonage({
  apiKey: env.VONAGE_API_KEY,
  apiSecret: env.VONAGE_API_SECRET,
  applicationId: env.VONAGE_APPLICATION_ID,
  privateKey: env.VONAGE_PRIVATE_KEY,
});

export async function sendSmsCode(phoneNumber: string) {
  const to = `${env.VONAGE_COUNTRY_CODE}${phoneNumber}`;
  return await vonage.verify2.newRequest({
    brand: env.VONAGE_BRAND_NAME,
    workflow: [
      {
        channel: Channels.SMS,
        to,
      },
    ],
    codeLength: 6,
  });
}

export async function verifySmsCode(requestId: string, code: string) {
  return await vonage.verify2.checkCode(requestId, code);
}
