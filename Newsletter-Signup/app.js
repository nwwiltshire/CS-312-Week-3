const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on Heroku.");
});

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    
    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data)

    const url = "https://us14.api.mailchimp.com/3.0/lists/b65a21d421"

    const options = {
        method: "POST",
        auth: "nickw:b97e60c70094070f1e68293d82e8ba8b-us14"
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
    
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

// API Key
// b97e60c70094070f1e68293d82e8ba8b-us14
// List ID
// b65a21d421