const fs = require('fs');
const path = require('path');
const http = require('http');

const server = http.createServer((req, res) => {
  const reqUrl = req.url;
  let filePath = path.join(__dirname, 'View', reqUrl === '/' ? 'index.html' : reqUrl);
  const extname = path.extname(filePath);
  let contentType = 'text/html';

  if (!extname) {
    filePath += '.html';
  } else if (extname === '.css') {
    contentType = 'text/css';
  } else if (extname === '.js') {
    contentType = 'text/javascript';
  }

  if (reqUrl === '/entrada') {
    const mdFile = path.join(__dirname, 'entrada', 'texto.md');
    fs.readFile(mdFile, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Arquivo não encontrado.');
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const html = `<html><body>${data.toString()}</body></html>`;
        res.write(html);
        res.end();
      }
    });

  } else if (reqUrl === '/links') {
    const mdFile = path.join(__dirname, 'entrada', 'texto.md');
    fs.readFile(mdFile, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Arquivo não encontrado.');
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        const links = data.toString().match(/\bhttps?:\/\/\S+/gi);
        if (links) {
          res.write(links.join('\n'));
        } else {
          res.write('Arquivo não apresenta link de URL');
        }
        res.end();
      }
    });
 
  } else if (reqUrl === '/validar') {
    const mdFile = path.join(__dirname, 'entrada', 'texto.md');
    fs.access(mdFile, fs.constants.F_OK, (err) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('HTTP 200');
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('HTTP 200');
        res.end();
      }
    });
  } else {

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code == 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          const html = `<html><body>
          <h1><span style="color:#FF0000"><strong>ERRO 404</strong></span></h1>
  
       <h1><span style="color:#F0FFFF">
      <span style="background-color:#000000">Este destino n&atilde;o pode ser encontrado....</span></span></h1>
  
  </body></html>`;
          res.write(html);
          res.end();
        } else {
          res.writeHead(500, { 'Content-Type': 'text/html' });
          const html = `<html><body><h1>500 Internal Server Error</h1><p>${err}</p></body></html>`;
          res.write(html);
          res.end();
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType
    });
    res.write(content);
    res.end();
  }
});
}
});


const PORT = 4250;
const SECURE_PORT = 7777;

server.listen(PORT, () => {
console.log(`Server running at http://localhost:${PORT}`);
});

server.on('error', (err) => {
if (err.code === 'EADDRINUSE') {
server.listen(SECURE_PORT, () => {
console.log(`Server running at http://localhost:${SECURE_PORT}`);
});
} else {
console.error(err);
}
}); 