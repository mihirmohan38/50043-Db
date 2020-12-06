const Express = require('express');
const app = Express();
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(Express.static(path.join(__dirname, "..", "build")));
app.use(Express.static("public"));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, "..", "build", "index.html"));
})

app.listen(port, () => {
	console.log(`Server running at port ${port}`);
})