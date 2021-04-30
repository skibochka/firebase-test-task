import { getMyOpenEnvelops, getFileFromEnvelope } from './index';
import { firestore } from 'firebase-admin/lib/firestore';
import * as admin from 'firebase-admin';
import * as chai from 'chai';
import DocumentData = firestore.DocumentData;

const { expect } = chai;
const db = admin.firestore();
const expectedResult = [{
  status: 'DONE',
  users: ['abc', 'abe', 'abd'],
  docs: ['1', '2', '3'],
  id: 'kkTWtXTvl9tgD6IhTr7M',
},
{
  docs: ['7', '8', '9'],
  status: 'DONE',
  users: ['abc', 'abg', 'acd'],
  id: 'kkTWtXovl9tgD4IhTerM',
}];

describe('Functions test', () => {
  before(async () => {
    const envelopesRef = db.collection('envelopes');

    await envelopesRef.doc('kkTWtXTvl9tgD6IhTr7M').set({
      id: 'kkTWtXTvl9tgD6IhTr7M',
      users: ['abc', 'abe', 'abd'],
      docs: ['1', '2', '3'],
      status: 'DONE',
    });
    await envelopesRef.doc('kkTmtXovl9tyD6IhTr7M').set({
      id: 'kkTmtXovl9tyD6IhTr7M',
      users: ['abm', 'abe', 'abk'],
      docs: ['4', '5', '6'],
      status: 'PROGRESS',
    });
    await envelopesRef.doc('kkTWtXovl9tgD4IhTerM').set({
      id: 'kkTWtXovl9tgD4IhTerM',
      users: ['abc', 'abg', 'acd'],
      docs: ['7', '8', '9'],
      status: 'DONE',
    });
  });

  it('Test getting file from envelope', (done) => {
    const req = {
      query: {
        envelope: 1,
        document: 2,
      },
    };
    const res = {
      json: (response: { url: string }) => {
        const expectResponse = expect(response);
        expectResponse.to.have.property('url').and.to.be.a('string');
        done();
      },
    };

    getFileFromEnvelope(req as any, res as any);
  });

  it('Test getting all available envelopes', (done) => {
    const req = {
      query: {
        id: 'abc',
      },
    };
    const res = {
      json: (mappedEnvelopes: DocumentData[]) => {
        const expectResponse = expect(mappedEnvelopes);
        expectResponse.to.have.deep.members(expectedResult);
        done();
      },
    };

    getMyOpenEnvelops(req as any, res as any);
  });
});
