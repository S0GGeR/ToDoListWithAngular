const http = require('http');
const fs = require('fs');
const path = require('path');
const connection = require('./connect');


const server = http.createServer((req,res)=> {

   let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
   const ext = path.extname(filePath);

   let ContentType = 'text/html';
   switch (ext){
      case '.css':
         ContentType = 'text/css';
         break;
      case '.js':
         ContentType = 'text/javascript';
         break;
      case '.html':
         ContentType = 'text/html';
         break;
      default:
         ContentType = '';
   }
   if(!ext){
      filePath += '.html'
   }


   console.log(ContentType);

   if  (req.method === 'GET' && req.url === '/main.js?ShowItems') {

         connection.query("SELECT * FROM itemlist " + "WHERE id != 0 ",
             function (err, items) {
                if (err)
                   res.writeHead(400,'Something wrong', {
                      'Content-Type': 'application/json'
                   });
                else {
                   res.writeHead(200,'Everything is ok!', {
                      'Content-Type': 'application/json'
                   });
                   items = JSON.stringify(items);
                   res.end(items);
                }
             });
   }
   else if  (req.method === 'POST' && req.url === '/main.js') {
      let body = '';
      req.on('data', function (data) {
         body += data;
         // Too much POST data, kill the connection!
         // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
         if (body.length > 1e6)
            req.connection.destroy();
      });
      req.on('end', function () {
         let post = JSON.parse(body);
         if(post['addItem'] !== undefined){
            connection.query("INSERT INTO itemlist (text)" + "VALUES (?)", [post['addItem']],
             function (err) {
                if (err)
                   res.writeHead(405,'Invalid input', {
                      'Content-Type': 'application/json'
                   });
                else
                   console.log("Great");
                connection.query("SELECT * FROM itemlist " + "WHERE text= ? ", [post['addItem']],
                    function (err, item) {
                       if (err)
                          throw err;
                       else
                          console.log("Great");
                       res.writeHead(200,'Everything is ok!', {
                          'Content-Type': 'application/json'
                       });
                       console.log('item');
                       item = JSON.stringify(item);
                       res.end(item);

                    });
             });


      }

   });


   }
   else if  (req.method === 'DELETE' && req.url === '/main.js') {
      let body = '';

      req.on('data', function (data) {
         body += data;
         // Too much DELETE data, kill the connection!
         // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
         if (body.length > 1e6)
            req.connection.destroy();
      });
      req.on('end', function () {
         let delItem = JSON.parse(body);
         console.log(delItem['itemID']);
         connection.query("DELETE FROM itemlist " + "WHERE id=? ", [delItem['itemID']],
             function (err) {
                if (err)
                   res.writeHead(404,'Item not found', {
                      'Content-Type': 'application/json'
                   });
                else
                   console.log("Great");
                res.writeHead(200,'Item was successfully remote', {
                   'Content-Type': 'application/json'
                });
                res.end();

             });
      });
   }
   else if  (req.method === 'PUT' && req.url === '/main.js') {
      let body = '';
      req.on('data', function (data) {
         body += data;
         // Too much PUT data, kill the connection!
         // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
         if (body.length > 1e6)
            req.connection.destroy();
      });
      req.on('end', function () {
         let putItem = JSON.parse(body);
         connection.query(" UPDATE itemlist SET text=? WHERE id =? ", [putItem['editItem'], putItem['itemID']],
             function (err) {
                if (err)
                   res.writeHead(405,'Invalid input', {
                      'Content-Type': 'application/json'
                   });
                else {
                   console.log("Item edited");
                   res.writeHead(200,'Everything is ok!', {
                      'Content-Type': 'application/json'
                   });
                   res.end();
                }

             });
      });
   }
   else {
      fs.readFile(filePath, (err, data) => {
         if (err) {

         } else {
            res.writeHead(200, {
               'Content-Type': ContentType
            });
         }
         res.end(data);
      });
   }

});





server.listen(3030, () => {
   console.log('Server has been started ....')
});

