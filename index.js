const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const db = require("./db");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Meathods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use(express.json());

const courses = [];

const password = "ankit@brokod.com";

app.post("/api/dbtable/register", (req, res) => {
  if (req.body.pass == password) {
    db.connect(function (err) {
      var sql =
        "CREATE TABLE users (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), phone VARCHAR(255), updated_at DATE, created_at DATE)";
      db.query(sql, function (err, result) {
        if (err) {
          res.send({ message: "something went wrong", errorCode: err});
        } else {
          res.send({ message: "table created successfully" });
        }
      });
    });
  } else {
    res.send({ message: "Unauthorized"});
  }
});

app.post("/api/signup", (req, res) => {
  if(req.body.pass == password) {
    db.connect(function(err) {
      todayDate = new Date();
      var sql = `INSERT INTO users (name, email, phone, updated_at, created_at) VALUES ("${req.body.name}", "${req.body.email}", "${req.body.phone}", "${todayDate}", "${todayDate}")`;
      db.query(sql, function (err, result) {
       if(err) {
        res.send({message: "something went wrong", errorCode : err})
       } else {
        res.send({message: 'User created successfully'});
       }
      });
    });
  } else {
    res.send({message: 'Unathorized'});
  }
});

app.get("/api/users", (req, res) => {
  db.connect(function(err) {
    db.query("SELECT * FROM users", function (err, result, fields) {
      if (err) throw err;
        res.send(result)
    });
  });
})

app.post("/api/deleteuser", (req, res) => {
  db.connect(function(err) {
    var sql = `DELETE FROM users WHERE id = ${req.body.id}`;
    db.query(sql, function (err, result) {
      if (err) throw err;
      res.send({'messge': 'deleted successully'});
    });
  });
})

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.post("/api/courses", (req, res) => {
  if (!req.body.name) {
    res.status(400).send({ message: "Course Name Required" });
    return;
  } else if (req.body.name.length < 3) {
    res.send({ message: "Course Name Must Be Min 3 Letters" });
    return;
  } else if (req.body.name && req.body.name.length >= 3) {
    const course = {
      id: courses.length + 1,
      name: req.body.name,
    };
    courses.push(course);
    res.send({ message: "Course added", course });
  }
});

// /api/courses/1
app.get("/api/courses/:id", (req, res) => {
  // res.send(courses[req.params.id])
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The course not found");
  } else {
    res.send(course);
  }
});

app.put("/api/course/:id", (req, res) => {
  //Look up the course
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  //If not existing, return 404
  if (!course) {
    res.status(404).send({ message: "Course Not Found" });
    return;
  } else if (!req.body.name) {
    res.status(404).send({ message: "Course Name Required" });
    return;
  } else if (req.body.name.length < 3) {
    res
      .status(404)
      .send({ message: "Course Name Should Be Atleast 3 Letters" });
    return;
  } else {
    course.name = req.body.name;
    res.send({ message: "Course Updated Successfully", course });
  }
});

app.delete("/api/course/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  if (!course) {
    res.status(404).send({ message: "Course Not Found" });
    return;
  } else {
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send({ message: "course deleted succesfully", course });
  }
});

// app.get('/api/posts/:year/:month', (req, res) => {
//     // res.send(req.params);
//     res.send(req.query);
// })

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});