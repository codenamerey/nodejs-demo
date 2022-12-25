const path = require('path');
const fs = require('fs/promises');
const http = require('http');

const server = http.createServer(async(req, res) => {
    let filePath;
    let contentType;
    //Check if user asking for homepage
    if(req.url != '/') {
        filePath = path.join(__dirname, 'html', (req.url).replace('/', ''));
    }
    else {
        filePath = path.join(__dirname, 'html', 'index.html');
    }
    const extName = path.extname(filePath);
    //Fixate content type based on extension name
    switch(extName) {
        case '.html':
            contentType = 'text/html';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case 'json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }
    //Return file asked to user, throw 404 page if file non-existent, or throw error if error is something else
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        res.setHeader('Content-Type', contentType);
        res.write(content);
        res.end();
    }

    catch(err) {
        const errorPage = path.join(__dirname, 'html', '404.html');
        if (err.code == 'ENOENT') {
            const errorPageContent = await fs.readFile(errorPage, 'utf-8');
            res.setHeader('Content-Type', 'text/html');
            res.write(errorPageContent);
            res.end();
        }

        else {
            res.setHeader('Content-Type', 'text/html');
            res.end(err);
        }
    }

})