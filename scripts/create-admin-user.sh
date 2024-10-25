#!/bin/bash

# Exit on any error except the conditional check
set -e

# Check if PASSWORD environment variable is set
if [ -z "$PASSWORD" ]; then
  echo "PASSWORD environment variable is not set. Exiting."
  exit 1
fi

# Check if AWS credentials are set
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ] || [ -z "$AWS_REGION" ]; then
  echo "AWS credentials or region are not set. Exiting."
  exit 1
fi

# Function to set up Node.js and install bcrypt
setup_node() {
  # Install Node Version Manager (nvm) if not already installed
  if [ ! -d "$HOME/.nvm" ]; then
    echo "Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
  fi

  # Load nvm and install the desired Node.js version
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

  # Install Node.js if it's not already installed
  nvm install 20.11.0
  nvm use 20.11.0

  # Install bcrypt
  npm install bcrypt
}

# Set up Node.js and install bcrypt
setup_node

# Function to hash the password using Node.js and bcrypt
hash_password() {
  node -e "
    const bcrypt = require('bcrypt');
    const password = process.env.PASSWORD;
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) throw err;
      console.log(hash);
    });
  "
}

# Get the hashed password
hashed_password=$(hash_password)

# Try to insert the user into DynamoDB conditionally
set +e  # Disable exit on error to handle the conditional check gracefully
put_result=$(aws dynamodb put-item \
  --table-name User \
  --item "{
    \"userId\": {\"S\": \"$(uuidgen)\"},
    \"email\": {\"S\": \"admin@admin.com\"},
    \"emailVerified\": {\"BOOL\": true},
    \"firstName\": {\"S\": \"Admin\"},
    \"lastName\": {\"S\": \"Admin\"},
    \"mobile\": {\"S\": \"\"},
    \"password\": {\"S\": \"$hashed_password\"},
    \"roles\": {\"L\": [{\"S\": \"admin\"}]},
    \"lastLoggedIn\": {\"N\": \"0\"},
    \"failedLogins\": {\"N\": \"0\"},
    \"suspended\": {\"BOOL\": false},
    \"mfa\": {
      \"M\": {
        \"preference\": {\"S\": \"\"},
        \"recoveryCodes\": {\"L\": []},
        \"app\": {
          \"M\": {
            \"secret\": {\"S\": \"\"},
            \"subscriber\": {\"S\": \"\"},
            \"verified\": {\"BOOL\": false}
          }
        },
        \"sms\": {
          \"M\": {
            \"subscriber\": {\"S\": \"\"},
            \"verified\": {\"BOOL\": false}
          }
        },
        \"email\": {
          \"M\": {
            \"subscriber\": {\"S\": \"\"},
            \"verified\": {\"BOOL\": false}
          }
        }
      }
    }
  }" \
  --condition-expression "attribute_not_exists(email)" 2>&1)
exit_code=$?
set -e  # Re-enable exit on error

# Check the result and log appropriately
if [ $exit_code -eq 0 ]; then
  echo "User created successfully."
elif [[ $put_result == *"ConditionalCheckFailedException"* ]]; then
  echo "User already exists, skipping insert."
else
  echo "An error occurred while trying to insert the user: $put_result"
  exit $exit_code
fi
