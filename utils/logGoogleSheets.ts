import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const serviceAccountAuth = new JWT({
  email: process.env.client_email!!,
  key: process.env.private_key!!,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});

const sheetID = process.env.GOOGLE_SPREADSHEET_ID!!;

export default async function storeInputInGooglSheet(method: string, fname: string, detail: string) {
  try {
    const doc = new GoogleSpreadsheet(sheetID, serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    if (!sheet) {
      throw new Error('The Google sheet does not exist!');
    }

    const time = new Date().toISOString();

    await sheet.setHeaderRow(['method', 'time', 'fname', 'detail']);
    console.log('Adding row to Google Sheet: ', { method, time, fname, detail });
    await sheet.addRow({ method, time, fname, detail });
  }
  catch(e) {
    console.error('Error storing input in Google Sheet: ', e);
  }
}