import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { appConfig } from './config';
import { DownloadFileDto } from './interfaces';
import { GetSignedUrlConfig } from '@google-cloud/storage';

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: appConfig.storageBucketName,
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

/**
 * function for downloading files. Returns the URL to download the file (url will expires in 3 hours)
 * @name /getFileFromEnvelope
 * @function
 * @param {functions.https.Request} req
 * @param {functions.Response} res
 */
export const getFileFromEnvelope = functions.https.onRequest(async (request, response) => {
  const payload: DownloadFileDto = {
    envelope: request.query.envelope as string,
    document: request.query.document as string,
  };
  const urlOptions: GetSignedUrlConfig = {
    version: 'v4',
    action: 'read',
    expires: appConfig.urlConfigExpires,
  };

  const [url] = await bucket.file(`envelopes/${payload.envelope}/${payload.document}`).getSignedUrl(urlOptions);

  response.json({ url });
});

/**
 * function to get users open envelops. Returns an array of available envelops for current user
 * @name /getMyOpenEnvelops
 * @function
 * @param {functions.https.Request} req
 * @param {functions.Response} res
 */
export const getMyOpenEnvelops = functions.https.onRequest(async (request, response) => {
  const envelopesRef = db.collection('envelopes');

  const envelopes = await envelopesRef.where('users', 'array-contains', request.query.id).get();
  const mappedEnvelopes = envelopes.docs.map((envelope) => envelope.data());

  response.json(mappedEnvelopes);
});
