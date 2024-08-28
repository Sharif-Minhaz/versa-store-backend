# versa-store-backend an E-Commerce backend Project

Welcome to the E-Commerce Project! This Express-based application is designed to help you manage and sell products online with a multi-vendor system. 

## Getting Started

To get started with this project, follow these steps:

### Prerequisites

- **Node.js**: Ensure you have Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).
- **npm**: npm comes bundled with Node.js. Make sure you have the latest version.

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Sharif-Minhaz/versa-store-backend.git
   cd your-repo
   ```

2. **Install Dependencies**

  - Run the following command to install the required npm packages:
  
  ```bash
  npm install
  ```

3. **Set Up Environment Variables**

  - Create a .env file in the root directory of the project and add your environment variables. Follow the `default.env` file. For example:
  
  ```bash
  SECRET_KEY=
  JWT_EXPIRES_IN=
  MONGODB_URI=
  REFRESH_JWT_EXPIRES_IN=
  REFRESH_SECRET_KEY=
  .........
  ```
4. **Run the Application**

  - Start the application using npm:
  
  ```bash
  npm run dev
  ```
  - The server should now be running at `http://localhost:8080`.
