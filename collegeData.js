const fs = require("fs");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

// Initialize function to load students and courses
module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/courses.json', 'utf8', (err, courseData) => {
            if (err) {
                return reject("Unable to load courses");
            }

            fs.readFile('./data/students.json', 'utf8', (err, studentData) => {
                if (err) {
                    return reject("Unable to load students");
                }

                try {
                    dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                    resolve();
                } catch (parseErr) {
                    reject("Error parsing JSON data");
                }
            });
        });
    });
};

// Helper to check if data is initialized
function ensureInitialized() {
    if (!dataCollection) {
        throw new Error("Data not initialized");
    }
}

// Get all students
module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        try {
            ensureInitialized();
            if (dataCollection.students.length === 0) {
                return reject("Query returned 0 results");
            }
            resolve(dataCollection.students);
        } catch (err) {
            reject(err.message);
        }
    });
};

// Get all TAs
module.exports.getTAs = function () {
    return new Promise((resolve, reject) => {
        try {
            ensureInitialized();
            const filteredStudents = dataCollection.students.filter(student => student.TA === true);
            if (filteredStudents.length === 0) {
                return reject("Query returned 0 results");
            }
            resolve(filteredStudents);
        } catch (err) {
            reject(err.message);
        }
    });
};

// Get all courses
module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        try {
            ensureInitialized();
            if (dataCollection.courses.length === 0) {
                return reject("Query returned 0 results");
            }
            resolve(dataCollection.courses);
        } catch (err) {
            reject(err.message);
        }
    });
};

// Get student by number
module.exports.getStudentByNum = function (studentNum) {
  return new Promise((resolve, reject) => {
      if (!dataCollection) {
          reject("Data not initialized");
          return;
      }

      const student = dataCollection.students.find(s => s.studentNum == studentNum);

      if (!student) {
          reject("Student not found");
          return;
      }

      resolve(student);
  });
};


// Get students by course
module.exports.getStudentsByCourse = function (course) {
    return new Promise((resolve, reject) => {
        try {
            ensureInitialized();
            const filteredStudents = dataCollection.students.filter(student => student.course == course);
            if (filteredStudents.length === 0) {
                return reject("Query returned 0 results");
            }
            resolve(filteredStudents);
        } catch (err) {
            reject(err.message);
        }
    });
};

// Add a student
module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        try {
            ensureInitialized();
            studentData.TA = studentData.TA === "true"; // Convert to boolean
            studentData.studentNum = dataCollection.students.length + 1; // Assign unique studentNum
            dataCollection.students.push(studentData);
            resolve();
        } catch (err) {
            reject(err.message);
        }
    });
};

// Update a student
module.exports.updateStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        try {
            ensureInitialized();
            const index = dataCollection.students.findIndex(student => student.studentNum == studentData.studentNum);
            if (index < 0) {
                return reject("Student not found");
            }
            dataCollection.students[index] = { ...dataCollection.students[index], ...studentData }; // Update fields
            resolve();
        } catch (err) {
            reject(err.message);
        }
    });
};

// Get a course by ID
module.exports.getCourseById = function (id) {
    return new Promise((resolve, reject) => {
        try {
            ensureInitialized();
            const course = dataCollection.courses.find(course => course.courseId == id);
            if (!course) {
                return reject("Query returned 0 results");
            }
            resolve(course);
        } catch (err) {
            reject(err.message);
        }
    });
};
