const { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, SASProtocol, StorageSharedKeyCredential } = require('@azure/storage-blob');

// Supports connection string or account/key
function getBlobService() {
  const conn = process.env.BLOB_CONNECTION_STRING;
  if (conn && conn.startsWith('DefaultEndpointsProtocol')) {
    return BlobServiceClient.fromConnectionString(conn);
  }
  const account = process.env.BLOB_ACCOUNT;
  const key = process.env.BLOB_KEY;
  if (account && key) {
    const url = `https://${account}.blob.core.windows.net`;
    const cred = new StorageSharedKeyCredential(account, key);
    return new BlobServiceClient(url, cred);
  }
  throw new Error('Blob credentials not configured.');
}

async function generateUploadUrl(filename) {
  const containerName = process.env.BLOB_CONTAINER || 'uploads';
  const service = getBlobService();
  const container = service.getContainerClient(containerName);
  await container.createIfNotExists();
  const blobClient = container.getBlockBlobClient(filename);

  const startsOn = new Date(Date.now() - 60 * 1000);
  const expiresOn = new Date(Date.now() + 15 * 60 * 1000);

  const sas = await blobClient.generateSasUrl({
    permissions: BlobSASPermissions.parse('cwr'),
    startsOn,
    expiresOn,
    protocol: SASProtocol.Https
  });

  return sas;
}

module.exports = { getBlobService, generateUploadUrl };
