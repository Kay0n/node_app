// Init
var express = require('express')
var path = require('path')
var app = express()
var port = 3000
var students = require("./routes/students.js")



// Load view engine
app.set("view engine", "pug");
app.set('views', path.join(__dirname, 'views'));


// Parse form input as plain text
app.use(express.urlencoded({ extended: true }));
app.use(express.json());








// Routes
app.use("/students",students)


// Static folder serve - see (https://expressjs.com/en/starter/static-files.html)
app.use(express.static('public'))

// get paramaters example
app.get('/users/:userId/books/:bookId', function (req, res) {
	res.send(req.params)
	res.send(req.query.test) // /dir?test=5    would return "5"
})


// 404 - undefined route
app.use(function(req,res){
	res.status(404);
	res.render('../views/404.pug',{query:JSON.stringify(req.query)});
});



// Start server	
app.listen(port, () => {
	console.log(`Application listening at http://localhost:${port}`)
});

