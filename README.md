# Product Manager

A backend system that provides users with the best product recommendations across Jumia, Amazon, and Noon.

## Overview

Product Manager is a Node.js backend application designed to handle product data scraped from various online stores. It provides a unified interface to search for products, view detailed information, and compare identical products across multiple retailers.

## Features

- **Multi-store product aggregation** – Stores product data scraped from multiple online stores
- **Product search** – Search across all aggregated products
- **Product details** – Retrieve full details for a specific product by ID
- **Product comparison** – Compare the same product across different stores
- **Wishlist support** – Add products to a wishlist and retrieve wishlist status with product queries

## Tech Stack

- **Node.js** – Runtime environment
- **Express.js** – Web framework
- **Sequelize** – Object Relational Mapper
-  **Database** –  Microsoft SQL Server

## Project Structure

```
product-manager/
├── Controllers/          # Request handlers and business logic
├── DataBase/             # Database connection and configuration
├── GlobalFunctions/      # Shared utility functions
├── Middlewares/          # Express middlewares (auth, error handling, etc.)
├── Models/               # Database models/schemas
├── Routes/               # API route definitions
├── app.js                # Application entry point
├── Data.7z               # Compressed product dataset
├── Product Manager API Collection.json  # API collection (Postman/Insomnia)
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Seif302010/product-manager.git
   cd product-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables — create a `.env` file:
   ```env
   PORT=3000
   DATABASE_URL=your_database_connection_string
   ```

4. Extract the product dataset from `Data.7z` before running the project for the first time.

5. Start the server:
   ```bash
   npm start
   ```
## API Reference

A full API collection is included in `Product Manager API Collection.json`. Import it into Postman or Insomnia to explore and test the endpoints.

## Data

The `Data.7z` archive contains the scraped product dataset. It uses the file `Updated_project_Products_Datasets.json` as the primary data source.

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

No license specified in this repository.

## Authors

**Seif302010**

- GitHub: [@Seif302010](https://github.com/Seif302010)
- GitHub: [@Abdelrahman20202020000](https://github.com/Abdelrahman20202020000)
