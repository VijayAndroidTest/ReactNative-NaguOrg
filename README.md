# Nagu Organics Android App

## Setup Instructions
1. Clone this repository.
2. Run `npm install` to install dependencies.
3. **Environment Setup**:
   - Create a file at `android/gradle.properties`.
   - Add your keystore credentials in the following format:
     ```properties
     MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
     MYAPP_RELEASE_KEY_ALIAS=my-key-alias
     MYAPP_RELEASE_STORE_PASSWORD=your_password
     MYAPP_RELEASE_KEY_PASSWORD=your_password
     ```
   - Place your `my-release-key.keystore` file in the `android/app/` folder.
