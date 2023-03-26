import express from 'express';
import fs from 'fs';
import { similarOffers } from './src/data.js';

const app = express();
const port = 3000;

app.use((req, res) => {
    const url = req.url;
    if (!fs.existsSync('photos.txt')) fs.writeFileSync('photos.txt', JSON.stringify(similarOffers));

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Content-Type', 'application/javascript; charset=utf-8');


    const dataOffers = fs.readFileSync('photos.txt', 'utf8');
    try {
        switch (url) {
            case '/':
                res.write('main');
                res.end();
                break;
            case '/offers':
                if (fs.existsSync('comments.txt')) fs.unlinkSync('comments.txt');
                res.write(dataOffers);
                res.end();
                break;
            case '/comments':
                const comments = fs.readFileSync('comments.txt', 'utf8');
                res.write(comments);
                res.end();
                break;
            case '/offer':
                if (req.method === 'POST') {
                    let body = '';
                    req.on('data', (data) => {
                        body += data.toString();
                    }).on('end', () => {
                        let data = JSON.parse(body);
                        if (fs.existsSync('comments.txt')) {
                            const dataPostOffers = fs.readFileSync('comments.txt', 'utf8');
                            let dataOffersArr = JSON.parse(dataPostOffers);
                            dataOffersArr.push(data)
                            fs.writeFileSync('comments.txt', JSON.stringify(dataOffersArr));
                        } else {
                            const dataArr = new Array(data);
                            fs.writeFileSync('comments.txt', JSON.stringify(dataArr));
                        }
                        res.write(JSON.stringify(fs.readFileSync('comments.txt')));
                    });
                }
                res.end();
                break;
            default:
                res.status(400).send('Bad Request');
                res.end();
        }
    } catch (e) {
        return e.message
    }
}).listen(port, () => {})
