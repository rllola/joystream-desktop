#create a keychain
KEY_CHAIN=joystream-build.keychain
security create-keychain -p travis $KEY_CHAIN

# Make the keychain the default so identities are found
security default-keychain -s $KEY_CHAIN

# Unlock the keychain
security unlock-keychain -p travis $KEY_CHAIN

# Set keychain locking timeout to 3600 seconds
security set-keychain-settings -t 3600 -u $KEY_CHAIN

# download encrypted certs
curl -O $OSX_CERT_BASE_URL/osx-application.p12
curl -O $OSX_CERT_BASE_URL/osx-installer.p12

# import certs
KEYCHAIN_FILE=~/Library/Keychains/$KEY_CHAIN
security import ./osx-application.p12 -k $KEYCHAIN_FILE -P $OSX_CERT_PASSWORD -T /usr/bin/codesign
security import ./osx-installer.p12 -k $KEYCHAIN_FILE -P $OSX_CERT_PASSWORD -T /usr/bin/codesign

# remove certs
rm -fr *.p12
