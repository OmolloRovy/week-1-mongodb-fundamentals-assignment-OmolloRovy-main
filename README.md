# 📚 MongoDB Bookstore Query Script

This Node.js script demonstrates how to interact with a MongoDB database using the official MongoDB Node.js driver. It connects to a MongoDB Atlas database and performs a range of operations on a `books` collection within the `plp_bookstore` database.

It includes basic querying, projection, sorting, pagination, updates, deletions, aggregations, indexing, and performance analysis.

---

## 🚀 Features

- ✅ Connects to MongoDB Atlas or local instance
- 🔍 Query by genre, author, and published year
- 📄 Projection of selected fields (e.g., title, author, price)
- 📊 Sorting by price (ascending and descending)
- 📚 Pagination (5 books per page)
- ✏️ Updates a book’s price
- 🗑️ Deletes a book by title
- 📈 Aggregation pipelines for:
  - Average price by genre
  - Most prolific author
  - Book count by decade
- ⚙️ Index creation (single and compound)
- 📉 Performance analysis using `.explain()`

---

## ⚙️ Setup Instructions

### 1. Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- A MongoDB Atlas account or a local MongoDB instance

Ensure your `books` collection contains documents in this format:

```json
{
  "title": "1984",
  "author": "George Orwell",
  "genre": "Fiction",
  "published_year": 1949,
  "price": 9.99,
  "in_stock": true,
  "pages": 328
}
