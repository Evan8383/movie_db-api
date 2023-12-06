const express = require('express');
const app = express();
const PORT = 3005
const mysql = require('mysql2');

app.use(express.json())

const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'root',
        database: 'movie_db'
    },
    console.log(`Connected to the courses_db database.`)
).promise();

app.get('/api/movies', async (req, res)=>{
    const [results, info] = await db.query('SELECT * from movies')
    res.json(results)
})
app.get('/api/movie-reviews', async (req, res)=>{
    const [results, info] = await db.query('SELECT movies.movie_name, review.review from review JOIN movies ON movie_id=movies.id')
    res.json(results)
    console.table(results)
})
app.post('/api/add-movie', async (req, res)=>{
    const { movie_name } = req.body 

    const [results, info] = await db.query('INSERT INTO movies (movie_name) VALUES (?)', movie_name)
    res.json(results)
})

app.put('/api/review/:id', async (req,res)=>{
    const movie_id = req.params.id
    const { updateReview } = req.body 
    const [results, info] = await db.query('UPDATE review SET review=? WHERE movie_id=?', [updateReview, movie_id])
    res.json(results)
})
app.delete('/api/movie/:id', async (req,res)=>{
    const movie_id = req.params.id
    const [results, info] = await db.query('DELETE FROM movies WHERE id=?', [movie_id])
    res.json(results)
})


app.get('*', (req, res)=>{
    res.json('404 - nothing here!')
})

app.listen(PORT, () => {
    console.log('server running on http://localhost:3005')
})