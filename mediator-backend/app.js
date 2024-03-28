import express from 'express';
import { execFile } from 'child_process';

const app = express();
const port = 5000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

app.get('/', (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    if (!req.query.arg){
        res.status(200).send("please give arg");
        console.log(`Called with no arg`);
        return;
    }
    execFile('../hello', [req.query.arg], (error, stdout, stderr) => {
        if (error) {
            throw error;
        }
        res.status(200).json({ans: stdout});
    })
    console.log(`Called with ${req.query.arg}`);
});

app.get('/goodbye', (req, res) => {
    res.status(200).send('leaving so soon?');
});
