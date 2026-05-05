# <span style="color: red;">Database</span>

- Database is an organized collection of data and we can query it to retrieve specific information.
- DBMS is a software (appliaction) that allows us to create, manage, and interact with databases. so database is just a collection of data and DBMS is the software that allows us to manage and interact with that data.

- Backend will talk with dbms not database directly. Backend will send query to dbms and dbms will execute the query and return the result to backend.

- Monstly everyone loosely use the term database for dbms + database. but technically they are different things. Database is just the data and dbms is the software that manages that data.

## <span style="color: orange;">Types of Databases</span>
1. structured data: relational databases (SQL)
    
    - Database that organizes data into tables with predefined schemas. Each table has rows and columns, and relationships between tables are established using foreign keys. SQL (Structured Query Language) is used to manage and query relational databases. Examples include MySQL, PostgreSQL, and SQLite.
    - uses ACID (Atomicity, Consistency, Isolation, Durability) properties to ensure reliable transactions and data integrity.
    - Atomicity: ensures that a transaction is treated as a single unit of work, which either succeeds completely or fails completely.
    - Consistency: ensures that a transaction brings the database from one valid state to another valid state, maintaining data integrity.
    - Isolation: ensures that concurrent transactions do not interfere with each other, maintaining data consistency.
    - Durability: ensures that once a transaction is committed, it will remain so, even in the event of a system failure.

2. unstructured data: non-relational databases (NoSQL)

    - Database that does not use a fixed schema and can store data in various formats such as key-value pairs, documents, graphs, or wide-columns. NoSQL databases are designed to handle large volumes of unstructured data and provide flexibility in data modeling. Examples include MongoDB (document), Redis (key-value), Cassandra (wide-column), and Neo4j (graph).
    - uses BASE (Basically Available, Soft state, Eventual consistency) properties to provide high availability and scalability.
    - Basically Available: ensures that the system is available for read and write operations, even in the presence of failures.
    - Soft state: allows the state of the system to change over time, even without input, due to eventual consistency.
    - Eventual consistency: ensures that, given enough time, all replicas of the data will eventually become consistent, but it does not guarantee immediate consistency.


## <span style="color: orange;">Why video/img is Unstructure?</span>
- Video is unstructured data because we cannot query specific information from video like give me a video that contains a cat. 
- Let's say we store video in database and we will not query video but we have to perform query on other data and to perform query on other data that row will be put in memory and if video is stored in that row then it will consume a lot of memory very less row will be put in memory so the large size of the video is also a problem.
- That is why we store video in file storage and store the reference of that video in database (URL).
- we can store very low size image in database if we want even in sql database we can store image as blob but it is not recommended because of the performance issue. it is better to store image in file storage and store the reference of that image in database.

## <span style="color: orange;">video/img is Semistrcuture?</span>
- Video and Image are semistructured data because it has metadata + data.
- Metadata means data about data. for example, for video metadata can be title, creating time, description, length, resolution, etc. 
- data is the actual video file or Image.
- so metadata is structured and we can perform query on metadata so we store the actual video/image in other file but we store metadata in database.

## <span style="color:orange">How are the data stored in disk?</span>

- Does rows of data stored one after another in disk? I mean one row then other row and so on like array?
- answer is No they cannot be stored like that because the size of each row is different and it will be hard to find the start of each row in disk.
- also if we want to add a new column to the table we will have to change the size of each row and that will be a nightmare because in array we have to move all the data to make space for the new column.
- they are stored in pages and each page has a fixed size (for example 8KB) and each page can store multiple rows of data.
- each page has a header that contains information about the page such as the number of rows in the page and the offset of each row in the page.
- when we want to read a row from the table we first read the page that contains therow and then we use the offset to find the start of the row in the page and then we read the row from the page.
- when we want to add a new column to the table we can just add the new column to the page header and then we can add the new column to each row in the page without having to move the data in the page.
- also we can have multiple pages for the same table and we can link them together using a linked list or a B-tree to make it easier to find the data in the table.
- this is how the data is stored in disk and how we can read and write data to the disk efficiently.

## <span style="color:orange">Why need non sequal database?</span>
- sequal database need normalization to avoid data redundancy and to make sure that the data is consistent and accurate.
- but non sequal database do not need normalization because they can store data in a array.
- no need of join.
- no need of foreign key.
- It follows BASE (Basically Available, Soft state, Eventual consistency) instead of ACID (Atomicity, Consistency, Isolation, Durability) which is used in sequal database.
- it is more suitable for big data and real-time applications because it can handle large amount of data and it can handle unstructured data.
- It is not suitable for applications that require complex queries and transactions because it does not support join and foreign key and it does not follow ACID properties.
- It can scale horizontal scale easily whlie sequal database can scale vertical scale easily.             
- because in sequal database we cannot put new table in new server because of the join and foreign key but in non sequal database we can put new collection or document in new server because there is no join and foreign key.

## <span style="color:orange">Non sequal database?</span>
- We call it collecation instead of table 
- we call it document instead of row 
- we call it field instead of column.
- whole deta is stored in one document and we can have nested documents and arrays in the document.

example of document in non sequal database (MongoDB):
```json
{
    "name": "John",
    "age": 30,
    "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY"
    },
    "hobbies": ["reading", "traveling", "cooking"]
}
```