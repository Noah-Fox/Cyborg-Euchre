import express from 'express';
import { execFile } from 'child_process';

const app = express();
const port = 5000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

app.get('/', (req, res) => {
    if (!req.query.arg){
        res.status(200).send("please give arg");
        return;
    }
    execFile('../hello', [req.query.arg], (error, stdout, stderr) => {
        if (error) {
            throw error;
        }
        res.status(200).send(stdout);
    })
});

app.get('/goodbye', (req, res) => {
    res.status(200).send('leaving so soon?');
});
