// queries.js - Modified for Node.js execution

// Import MongoDB client
const { MongoClient } = require('mongodb');

// Connection URI (your MongoDB Atlas connection string)
const uri = 'mongodb+srv://masimevanistelrooy:TjSnnEYxbh8Am54b@cluster0.3tgl1i4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const dbName = 'plp_bookstore';
const collectionName = 'books';

// --- Main execution function ---
async function runQueries() {
  let client; // Declare client variable to be accessible in the finally block
  try {
    // 1. Establish connection to MongoDB Atlas
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB Atlas!');

    // 2. Get the database and collection instances
    const db = client.db(dbName); 
    const collection = db.collection(collectionName); 

    console.log(`--- Executing queries on database: ${dbName} and collection: ${collectionName} ---`);

    // 1. Find all books in a specific genre ('Fiction')
    console.log('\n1. Books in Fiction genre:');
    const fictionBooks = await collection.find({ genre: 'Fiction' }).toArray();
    console.log(JSON.stringify(fictionBooks, null, 2));

    // 2. Find books published after a certain year (2010)
    console.log('\n2. Books published after 2010:');
    const booksAfter2010 = await collection.find({ published_year: { $gt: 2010 } }).toArray();
    console.log(JSON.stringify(booksAfter2010, null, 2));

    // 3. Find books by a specific author ('George Orwell')
    console.log('\n3. Books by George Orwell:');
    const georgeOrwellBooks = await collection.find({ author: 'George Orwell' }).toArray();
    console.log(JSON.stringify(georgeOrwellBooks, null, 2));

    // 4. Find books that are both in stock and published after 2010
    console.log('\n4. Books in stock and published after 2010:');
    const inStockAfter2010 = await collection.find({
      in_stock: true,
      published_year: { $gt: 2010 }
    }).toArray();
    console.log(JSON.stringify(inStockAfter2010, null, 2));

    // --- Queries with Projection ---
    console.log('\n--- Queries with Projection (Title, Author, Price Only) ---');

    // 1. Books in Fiction genre (with projection)
    console.log('\n1. Books in Fiction genre (Projected):');
    const fictionProjected = await collection.find(
      { genre: 'Fiction' },
      { title: 1, author: 1, price: 1, _id: 0 }
    ).toArray();
    console.log(JSON.stringify(fictionProjected, null, 2));

    // 2. Books published after 2010 (with projection)
    console.log('\n2. Books published after 2010 (Projected):');
    const after2010Projected = await collection.find(
      { published_year: { $gt: 2010 } },
      { title: 1, author: 1, price: 1, _id: 0 }
    ).toArray();
    console.log(JSON.stringify(after2010Projected, null, 2));

    // 3. Books by George Orwell (with projection)
    console.log('\n3. Books by George Orwell (Projected):');
    const georgeOrwellProjected = await collection.find(
      { author: 'George Orwell' },
      { title: 1, author: 1, price: 1, _id: 0 }
    ).toArray();
    console.log(JSON.stringify(georgeOrwellProjected, null, 2));

    // --- Queries with Sorting ---
    console.log('\n--- Queries with Sorting ---');

    // 1. All books sorted by price ascending (lowest to highest)
    console.log('\n1. All books sorted by price (Ascending):');
    const sortedPriceAsc = await collection.find({}, { title: 1, price: 1, _id: 0 }).sort({ price: 1 }).toArray();
    console.log(JSON.stringify(sortedPriceAsc, null, 2));

    // 2. All books sorted by price descending (highest to lowest)
    console.log('\n2. All books sorted by price (Descending):');
    const sortedPriceDesc = await collection.find({}, { title: 1, price: 1, _id: 0 }).sort({ price: -1 }).toArray();
    console.log(JSON.stringify(sortedPriceDesc, null, 2));

    // --- Queries with Pagination (5 books per page) ---
    console.log('\n--- Queries with Pagination (5 books per page) ---');

    // Page 1 (first 5 books)
    console.log('\nPage 1 (first 5 books, sorted by title):');
    const page1Books = await collection.find(
      {},
      { title: 1, author: 1, _id: 0 }
    )
    .sort({ title: 1 })
    .skip(0)
    .limit(5)
    .toArray();
    console.log(JSON.stringify(page1Books, null, 2));

    // Page 2 (next 5 books)
    console.log('\nPage 2 (next 5 books, sorted by title):');
    const page2Books = await collection.find(
      {},
      { title: 1, author: 1, _id: 0 }
    )
    .sort({ title: 1 })
    .skip(5)
    .limit(5)
    .toArray();
    console.log(JSON.stringify(page2Books, null, 2));

    // --- Update and Delete Operations (Exercise caution!) ---
    console.log('\n--- Update and Delete Operations (Exercise caution!) ---');
    // IMPORTANT: These commands modify your data. Run them carefully or comment out if not needed.

    // 1. Update the price of a specific book (e.g., '1984' to 11.99)
    console.log('\n1. Updating price of "1984" to 11.99:');
    const updateResult = await collection.updateOne(
      { title: '1984' },
      { $set: { price: 11.99 } }
    );
    console.log(updateResult);
    console.log('Verify update for "1984":');
    const updatedBook = await collection.find({ title: '1984' }, { title: 1, price: 1, _id: 0 }).toArray();
    console.log(JSON.stringify(updatedBook, null, 2));


    // 2. Delete a book by its title (e.g., 'Moby Dick')

    console.log('\n2. Deleting "Moby Dick":');
    const deleteResult = await collection.deleteOne({ title: 'Moby Dick' });
    console.log(deleteResult);
    console.log('Verify deletion for "Moby Dick":');
    const mobyDickAfterDelete = await collection.find({ title: 'Moby Dick' }).toArray();
    console.log(JSON.stringify(mobyDickAfterDelete, null, 2));


    // --- Aggregation Pipelines ---
    console.log('\n--- Aggregation Pipelines ---');

    // 1. Calculate the average price of books by genre
    console.log('\n1. Average price of books by genre:');
    const avgPriceByGenre = await collection.aggregate([
      {
        $group: {
          _id: "$genre",
          averagePrice: { $avg: "$price" },
          totalBooks: { $sum: 1 }
        }
      },
      {
        $sort: { averagePrice: -1 }
      }
    ]).toArray();
    console.log(JSON.stringify(avgPriceByGenre, null, 2));

    // 2. Find the author with the most books in the collection
    console.log('\n2. Author with the most books:');
    const topAuthor = await collection.aggregate([
      {
        $group: {
          _id: "$author",
          bookCount: { $sum: 1 }
        }
      },
      {
        $sort: { bookCount: -1 }
      },
      {
        $limit: 1
      }
    ]).toArray();
    console.log(JSON.stringify(topAuthor, null, 2));

    // 3. Group books by publication decade and count them
    console.log('\n3. Books grouped by publication decade:');
    const booksByDecade = await collection.aggregate([
      {
        $project: {
          publication_decade: {
            $concat: [
              { $toString: { $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10] } },
              "s"
            ]
          },
          title: 1
        }
      },
      {
        $group: {
          _id: "$publication_decade",
          bookCount: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]).toArray();
    console.log(JSON.stringify(booksByDecade, null, 2));

    // --- Indexing ---
    console.log('\n--- Indexing ---');

    // 1. Create an index on the 'title' field for faster searches
    console.log('\n1. Creating index on "title":');
    const indexTitleResult = await collection.createIndex({ title: 1 });
    console.log(indexTitleResult);

    // 2. Create a compound index on 'author' and 'published_year'
    console.log('\n2. Creating compound index on "author" and "published_year":');
    const indexAuthorYearResult = await collection.createIndex({ author: 1, published_year: -1 });
    console.log(indexAuthorYearResult);

    // Verify indexes (optional)
    console.log('\nVerifying existing indexes:');
    const existingIndexes = await collection.indexes();
    console.log(JSON.stringify(existingIndexes, null, 2));

    // --- Demonstrate Performance Improvement with explain() ---
    console.log('\n--- Demonstrating Performance Improvement with explain() ---');

    // Query 1: Search by title (should use 'title' index - IXSCAN)
    console.log('\nExplain for title search ("1984"):');
    const explainTitleSearch = await collection.find({ title: '1984' }).explain('executionStats');
    console.log(JSON.stringify(explainTitleSearch, null, 2));

    // Query 2: Search by author and published_year (should use compound index - IXSCAN)
    console.log('\nExplain for author and published_year search ("George Orwell", after 1940):');
    const explainAuthorYearSearch = await collection.find({ author: 'George Orwell', published_year: { $gt: 1940 } }).explain('executionStats');
    console.log(JSON.stringify(explainAuthorYearSearch, null, 2));

    // Query 3: Search by author only (should still use compound index - IXSCAN)
    console.log('\nExplain for author search ("J.R.R. Tolkien"):');
    const explainAuthorOnlySearch = await collection.find({ author: 'J.R.R. Tolkien' }).explain('executionStats');
    console.log(JSON.stringify(explainAuthorOnlySearch, null, 2));

    // Example of a query that would likely result in a COLLSCAN if no relevant index exists
    console.log('\nExplain for a query likely to be a COLLSCAN (e.g., by pages):');
    const explainCollScan = await collection.find({ pages: { $gt: 500 } }).explain('executionStats');
    console.log(JSON.stringify(explainCollScan, null, 2));

  } catch (error) {
    console.error('Error running queries:', error);
  } finally {
    // 3. Close the connection
    if (client) {
      await client.close();
      console.log('Connection to MongoDB Atlas closed.');
    }
  }
}

// Execute the main function
runQueries();