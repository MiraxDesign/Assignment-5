/*********************************************************************************
* WEB700 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Miracle Uchime Student ID: 133177238 Date: November 02, 2024
*
* Online (Vercel) Link: https://vercel.com/miracle-uchimes-projects/assignment4
* Online (Github) Link: https://github.com/MiraxDesign/Assignment-4
********************************************************************************/

const express = require("express");
const path = require("path");
const collegeData = require("./collegeData");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const ly = require("express-ejs-layouts");
app.use(ly);
app.set("layout", "layouts/main");

const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Middleware for active route highlighting
app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute =
    "/" + (isNaN(route.split("/")[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  next();
});

// ------------------------ Routes -------------------------

// Home route
app.get("/", (req, res) => res.render("home"));

// About route
app.get("/about", (req, res) => res.render("about"));

// Students route (handles optional course filtering)
app.get("/students", (req, res) => {
  if (req.query.course) {
    collegeData
      .getStudentsByCourse(req.query.course)
      .then((students) => res.render("students", { students, message: null }))
      .catch(() => res.render("students", { students: [], message: "No results found" }));
  } else {
    collegeData
      .getAllStudents()
      .then((students) => res.render("students", { students, message: null }))
      .catch(() => res.render("students", { students: [], message: "No results found" }));
  }
});

// Individual student route (by studentNum)
app.get("/student/:studentNum", (req, res) => {
    collegeData
        .getStudentByNum(req.params.studentNum)
        .then((student) => {
            res.render("student", { student }); // Pass the student object to the view
        })
        .catch((err) => {
            console.error(err);
            res.render("student", { student: null, message: "Student not found" }); // Handle errors
        });
});


// Add student route (GET)
app.get("/students/add", (req, res) => {
  collegeData
    .getCourses()
    .then((courses) => res.render("addStudent", { courses }))
    .catch((err) => {
      console.error(err);
      res.render("addStudent", { courses: [], message: "Unable to retrieve courses" });
    });
});

// Add student route (POST)
app.post("/students/add", (req, res) => {
  collegeData
    .addStudent(req.body)
    .then(() => res.redirect("/students"))
    .catch(() => res.status(500).send("Unable to add student"));
});

// Update student route
app.post("/student/update", (req, res) => {
  collegeData
    .updateStudent(req.body)
    .then(() => res.redirect("/students"))
    .catch(() => res.status(500).send("Unable to update student"));
});

// Courses route
app.get("/courses", (req, res) => {
  collegeData
    .getCourses()
    .then((courses) => res.render("courses", { courses }))
    .catch(() => res.render("courses", { courses: [], message: "No results found" }));
});

// Individual course route (by course ID)
app.get("/course/:id", (req, res) => {
  collegeData
    .getCourseById(req.params.id)
    .then((course) => res.render("course", { course }))
    .catch(() => res.render("course", { course: null, message: "Course not found" }));
});

// HTML Demo route
app.get("/htmlDemo", (req, res) => res.render("htmlDemo"));

// 404 Error handling route
app.use((req, res) => res.status(404).send("Page Not Found"));

// ------------------------ Initialize and Start Server -------------------------

collegeData
  .initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Failed to initialize data: ${err}`);
  });
