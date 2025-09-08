# DocuSecure

A secure web application for storing and managing documents with user authentication and cloud storage integration.

## 🚀 Live Demo
**Deployed Application:** http://docusecure.ap-south-1.elasticbeanstalk.com/

## 📋 Overview
DocuSecure is a Node.js web application that provides a secure platform for users to upload, store, and manage their documents. The application features user authentication, file upload capabilities, and integrates with AWS S3 for reliable cloud storage.

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** Passport.js with local strategy
- **File Storage:** AWS S3
- **Template Engine:** EJS
- **File Upload:** Multer
- **Containerization:** Docker

## ✨ Features
- 🔐 User registration and authentication
- 📁 Secure document upload and storage
- ☁️ AWS S3 integration for file storage
- 🔒 Session-based authentication
- 📱 Responsive web interface
- 🐳 Docker support for easy deployment

## 📦 Prerequisites
- Docker CLI and Docker Desktop
- Node.js 16.17.1+ (if running without Docker)
- MongoDB instance
- AWS S3 bucket and credentials

## 🚀 Local Setup

### Using Docker (Recommended)
1. **Clone the repository**
   ```bash
   git clone https://github.com/sanjay-gangishetty/docusecure.git
   cd docusecure
   ```

2. **Configure environment variables**
   ```bash
   cp sample.env .env
   ```
   Update `.env` with your configuration:
   ```env
   SECRET_KEY=your-session-secret-key
   MONGO_LINK=your-mongodb-connection-string
   BUCKET_NAME=your-s3-bucket-name
   ACCESS_KEY=your-aws-access-key
   SECRET_ACCESS_KEY=your-aws-secret-access-key
   REGION=your-aws-region
   ```

3. **Run the application**
   ```bash
   bash setup.sh
   ```

### Manual Setup
1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables** (same as above)

3. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The application will be available at `http://localhost:3000`

## 🔧 Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `SECRET_KEY` | Session secret key for authentication | Yes |
| `MONGO_LINK` | MongoDB connection string | Yes |
| `BUCKET_NAME` | AWS S3 bucket name | Yes |
| `ACCESS_KEY` | AWS Access Key ID | Yes |
| `SECRET_ACCESS_KEY` | AWS Secret Access Key | Yes |
| `REGION` | AWS region for S3 bucket | Yes |

## 📁 Project Structure
```
docusecure/
├── app.js              # Main application file
├── package.json        # Node.js dependencies
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Docker Compose setup
├── setup.sh           # Setup script
├── views/             # EJS templates
├── public/            # Static assets
└── .env              # Environment variables (create from sample.env)
```

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the ISC License.

## 👨‍💻 Author
**Sanjay Kumar**

---
Made with ❤️ for secure document management
