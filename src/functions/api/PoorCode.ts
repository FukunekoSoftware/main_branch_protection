import * as express from "express";
const app = express();

app.get("/", function (req, res) {
    let userName = req.query.userName;
    // This is an example of a potential Cross-Site Scripting (XSS) vulnerability.
    // The user input is directly sent back in the response without any sanitization.
    res.send("Hello " + userName);
});

app.listen(3000);