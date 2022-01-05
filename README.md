# SFTPFileSign

The NodeJS App structure was generated through Tibco NodeJS Rest API generator (uses Swagger API Swagger api [location](./config/swagger.json))

The App creates a connection to a SFTP server (using SSH Key) and uploads a signed file using PGP. Code is also available for encryption and is commented out. 

## Resources
Resources for Tibco/NodeJS integration + PGP and SSH references

Tibco/NodeJS Reference (Need Coastal Cloud google acct): 
https://docs.google.com/presentation/d/1EGpTuVN5y_wBHmSeEz8DibgSxzVDYmzDpx3SANhXh4s/edit#slide=id.gdbba7fa1eb_0_11
https://drive.google.com/file/d/1FRC8VxCAIcdvsMFuimqUIOkautRVHy8K/view

NPM PGP Reference : https://www.npmjs.com/package/openpgp#sign-and-verify-cleartext-messages
Generate PGP Key Pairs : https://codref.org/pgp
For Testing PGP Key + Signatures : https://pgptool.org/

ssh2-sftp-client Reference : https://www.npmjs.com/package/ssh2-sftp-client

SSH Key Gen via MacOS Terminal : ssh-keygen -m PEM    

## Author
Osvaldo Parra - osvaldo.parra@coastalcloud.us