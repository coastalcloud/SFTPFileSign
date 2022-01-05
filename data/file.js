/**
 * @author Osvaldo Parra <osvaldo.parra@coastalcloud.us>
 */

'use strict';
const dotEnv = require('dotenv').config();
var Mockgen = require('./mockgen.js');
const fs = require('fs');
const Client = require('ssh2-sftp-client');
const Readable = require('stream').Readable;
const openpgp = require('openpgp');
const { body } = require('swagmock/lib/generators/paramtypes');
const { file } = require('swagmock/lib/generators');
/**
 * Operations on /file
 */
module.exports = {
    /**
     * summary: 
     * description: 
     * parameters: directory, env, host, port, fileName, file
     * produces: application/json
     * responses: 200, 500
     * operationId: postFile
     */
    post: {
        200: async function (req, res, callback) {
            const sftp = new Client();

            //----------- START PGP KEY GENERATION ----------------
            // NOTE : For PGP Key Generation WITH Expiry dates see link in README
            /*
             const { privateKey, publicKey } = await openpgp.generateKey({
                type: 'rsa', // Type of the key
                rsaBits: 2048, // RSA key size 
                userIDs: [{ name: 'name', email: 'test@coastalcloud.us' }], // you can pass multiple user IDs
                passphrase: 'sc2eUmmzxqj4mBxy' // protects the private key
            });

            try {
                fs.writeFileSync('./coastalcloud_pgp_prod', privateKey)
                fs.writeFileSync('./coastalcloud_pgp_prod.pub', publicKey)
                //file written successfully
              } catch (err) {
                console.error(err)
              }

              */
            //const unarmoredPgpPublic = await openpgp.readKey({ armoredKey: publicKey });
            //----------- END PGP KEY GENERATION ----------------

            var sshPrivateKey = process.env.PRIVATE_SSH.replace(/\\n/g, '\n');
            var pgpPrivateKey = process.env.PRIVATE_PGP.replace(/\\n/g, '\n');
            var pgpPassphrase = process.env.PRIVATE_PGP_PASSPHRASE.replace(/\\n/g, '\n');
            
            const unarmoredPgpPrivate = await openpgp.decryptKey({
                privateKey: await openpgp.readPrivateKey({ armoredKey: pgpPrivateKey }),
                passphrase: pgpPassphrase
            });
        
            
            var inputData = req.body.file;
            var unsignedFile = new Readable();
            unsignedFile.push(inputData); 
            unsignedFile.push(null);

            const message = await openpgp.createMessage({ binary: unsignedFile }); // or createMessage({ text: ReadableStream<String> })
            const signatureArmored = await openpgp.sign({
                message,
                signingKeys: unarmoredPgpPrivate
            });
        
            // ------------------------- ENCRYPTION/DECRYPTION STARTS -----------------------
            /*
             const encryptedData = await openpgp.encrypt({
                message: await openpgp.createMessage({ text: inputData}), // input as Message object, encrypt inputFile
                encryptionKeys: unarmoredPgpPublic,
            });

            console.log('encrypted ' + encrypted);

            const message = await openpgp.readMessage({
                armoredMessage: encryptedData // parse armored message
            });
            const decrypted = await openpgp.decrypt({
                message,
                decryptionKeys: unarmoredPgpPrivate
            });

            const chunks = [];
            for await (const chunk of decrypted.data) {
                chunks.push(chunk);
            }
            const finalDecryptedMessage = chunks.join('');
            console.log('decrypted message' + finalDecryptedMessage);
            */
            // ------------------------- ENCRYPTION/DECRYPTION ENDS -----------------------

            const authorizedResult = await sftp.connect({
                host: `${req.query.host}`,
                port: `${req.query.port}`,
                username: `${req.query.username}`,
                privateKey: sshPrivateKey
            }).then(() => {
                return sftp.put(signatureArmored, `/${req.query.directory}/${req.query.fileName}`);
            }).then(data => {
                console.log(data, 'the data info');
                sftp.end();
                res.status(200).send('success');
            }).catch(err => {
                console.log(err, 'catch error');
                callback(err);
            });
          
            
        },
        500: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/file',
                operation: 'post',
                response: '500'
            }, callback);
        }
    }
};
