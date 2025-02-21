import express from 'express';
import { db } from './db.js';

const app = express();
//parse jason
app.use(express.json());
const PORT = 3000;

/* //INDEX
app.get('/', (req, res) => {
    res.send('Hello world');
});

app.get('/to-do', (req, res) => {
    res.send('This is to-do homepage');
});
 */

//get-users
app.get('/get-users', (req, res) => {
    const query = "SELECT * FROM users";
    db.query(query)
        .then(users => {
            res.status(200).json({ users: users.rows })
        });
});
 
//get-titles
app.get('/get-titles', (req, res) => {
    const query = "SELECT * FROM titles";
    db.query(query)
        .then(titles => {
            res.status(200).json({ titles: titles.rows })
        });
});

//get-lists
app.get('/get-lists', (req, res) => {
    const query = "SELECT * FROM lists";
    db.query(query)
        .then(lists => {
            res.status(200).json({ lists: lists.rows })
        });
});

//post-users
app.post('/check-user', (req, res) => {
    const { username, password } = req.body;

    const query = "SELECT * FROM users WHERE username=$1 AND password=$2";
    
    db.query(query, [username, password])
    .then(result => {
        if(result.rowCount > 0) {
            res.status(200).json({ exist: true});
        }
        else {
            res.status(200).json({ exist: false});
        }
    })

});

//add register
app.post('/register', (req, res) => {
    const { username, password, fname, lname } = req.body;

    const query = "INSERT INTO users (username, password, fname, lname) VALUES ($1,$2,$3,$4)";
    db.query(query, [username, password, fname, lname])
    .then(result => {
        res.status(200).json({ success: true });
    });

});

//post-titles
app.post('/check-titles', (req, res) => {
    const { username, title } = req.body;

    const query = "SELECT * FROM titles WHERE username=$1 AND title=$2";
    
    db.query(query, [username, title])
    .then(result => {
        if(result.rowCount > 0) {
            res.status(200).json({ exist: true});
        }
        else {
            res.status(200).json({ exist: false});
        }
    })

});

/* //add titles
app.post('/add-titles', (req, res) => {
    const { id, username, title, date_modified, status } = req.body;

    const query = "INSERT INTO titles (id, username, title, date_modified, status) VALUES ($1,$2,$3,$4,$5)";
    db.query(query, [id, username, title, date_modified, status])
    .then(result => {
        res.status(200).json({ success: true });
    });

}); */

//post-lists
app.post('/check-lists', (req, res) => {
    const { title_id, list_desc } = req.body;

    const query = "SELECT * FROM lists WHERE title_id=$1 AND list_desc=$2";
    
    db.query(query, [title_id, list_desc])
    .then(result => {
        if(result.rowCount > 0) {
            res.status(200).json({ exist: true});
        }
        else {
            res.status(200).json({ exist: false});
        }
    })

});

/* //add lists
app.post('/add-lists', (req, res) => {
    const { id, title_id, list_desc, status } = req.body;

    const query = "INSERT INTO lists (id, title_id, list_desc, status) VALUES ($1,$2,$3,$4)";
    db.query(query, [id, title_id, list_desc, status])
    .then(result => {
        res.status(200).json({ success: true });
    });

}); */

/* //add to do
app.post('/add-to-do', (req, res) => {
    //object destructuring
    const { fname, lname } = req.body;
    res.send(`Hello ${fname} ${lname}`);
});

//update to do
app.get('/update-to-do', (req, res) => {
    res.send('This is update to-do homepage');
});

//delete to do
app.get('/delete-to-do', (req, res) => {
    res.send('This is delete to-do homepage');
}); */

//add titles and lists
/* app.post('/add-to-do', (req, res) => {
    const { username, title, date_modified, title_id, list_desc, status } = req.body;

    const query1 = "INSERT INTO titles (username, title, date_modified, status) VALUES ($1,$2,$3,$4)";
    db.query(query1, [username, title, date_modified, status])
    .then(result => {
        res.status(200).json({ success: true });
    });
    const query2 = "INSERT INTO lists (title_id, list_desc, status) VALUES ($1,$2,$3);
    db.query(query2, [title_id, list_desc, status ])
    .then(result => {
        res.status(200).json({ success: true });
    });

});  */

/* app.post('/add-to-do', async (req, res) => {
    const { username, title, lists } = req.body;
    const date_modified = new Date().toISOString(); // Auto-generate date_modified
    const status = "true"; // Auto-set status to true

    try {
        // Insert into titles table (title will be used as title_id in lists)
        const query1 = "INSERT INTO titles (username, title, date_modified, status) VALUES ($1, $2, $3, $4)";
        await db.query(query1, [username, title, date_modified, status]);

        // Extract list_desc array and insert each item using title as title_id
        const listItems = lists[0].list_desc; // Extract the array of descriptions
        const query2 = "INSERT INTO lists (title_id, list_desc, status) VALUES ($1, $2, $3)";

        for (const desc of listItems) {
            await db.query(query2, [title, desc, status]); // Use title as title_id
        }

        res.status(200).json({ success: true, message: "Successfully Added" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}); */

app.post('/add-to-do', async (req, res) => {// dyay method na ket post, tas route nga add-to-do nga agcacatch ti request ken response
    try {
        const { username, title, lists } = req.body; //aggapo yanti request body idjay insomia, which is jay json chuchu
        const date_modified = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const status = "true"; //naideclare nga automatic dyay status na

        // Insert into 'titles' and return the generated ID
        const titleInsertQuery = `  
            INSERT INTO titles (username, title, date_modified, status) 
            VALUES ($1, $2, $3, $4) RETURNING id
        `; // etuy ket dyay query tapos ag-insert dyay values nga inpasam yanti table nga title nga adda ti columns na nga
        const titleResult = await db.query(titleInsertQuery, [username, title, date_modified, status]);

        // Retrieve the generated title_id, detuy ket dyay id nga naggapo yanti title idyay table nga title
        const title_id = titleResult.rows[0].id;

        // Insert each list item with the correct title_id
        const listInsertQuery = "INSERT INTO lists (title_id, list_desc, status) VALUES ($1, $2, $3)";
        for (const desc of lists[0].list_desc) {
            await db.query(listInsertQuery, [title_id, desc, status]);
        }

        res.json({ success: true, message: "Successfully Added" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

//update status
app.post('/update-status', async (req, res) => {
    try {
        const { title_id, id, status } = req.body; // Extract title_id, id, and status from the request body
        
        // Update the status of the specific list in the 'lists' table
        const updateStatusQuery = "UPDATE lists SET status = $1 WHERE title_id = $2 AND id = $3";
        await db.query(updateStatusQuery, [status, title_id, id]);

        res.json({ success: true, message: "List status successfully updated." });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

//delete to do
app.post('/delete-to-do', async (req, res) => {
    try {
        const { title_id } = req.body; // Extract title_id from the 'data' property
        
        // First, delete the associated lists
        const deleteListsQuery = "DELETE FROM lists WHERE title_id = $1";
        await db.query(deleteListsQuery, [title_id]);

        // Then, delete the title
        const deleteTitleQuery = "DELETE FROM titles WHERE id = $1";
        await db.query(deleteTitleQuery, [title_id]);

        res.json({ success: true, message: "To-do Successfully deleted." });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

//update-to-do
app.post('/update-to-do', async (req, res) => {
    try {
        const { title, list } = req.body; // Extract title and list from the request body
        const date_modified = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
        const status = "true";

        // Update the 'titles' table with the new title and date_modified
        const titleUpdateQuery = `
            UPDATE titles
            SET title = $1, date_modified = $2
            WHERE id = $3
        `;
        await db.query(titleUpdateQuery, [title, date_modified, title]); // Use the 'title' as ID here (adjust if needed)

        // Delete old list items associated with this title
        const deleteOldListsQuery = "DELETE FROM lists WHERE title_id = $1";
        await db.query(deleteOldListsQuery, [title]); // Assuming 'title' here is used as 'title_id'—if not, adjust

        // Insert the new list items
        const listInsertQuery = "INSERT INTO lists (title_id, list_desc, status) VALUES ($1, $2, $3)";
        for (const list_desc of list) {
            await db.query(listInsertQuery, [title, list_desc, status]); // Insert the new list items with the same title_id
        }

        res.json({ success: true, message: "To do successfully updated" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});