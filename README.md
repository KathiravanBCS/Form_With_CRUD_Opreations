# Student Form with CRUD Operations

A React application for managing student records with Create, Read, Update, and Delete (CRUD) functionality. Student data is saved in JSON format to a text file.


## Features

- **Add Student Records**: Complete form with validation
- **Edit/Update Records**: Modify existing student information
- **Delete Records**: Remove students from the system
- **Data Export**: Save all student records to a JSON text file
- **Responsive Design**: Works on both desktop and mobile devices
- **Form Validation**: Ensures data integrity with client-side validation

## Data Structure

Student data is saved in the following JSON format:

```json
[
  {
    "studentId": "abc123",
    "firstName": "John",
    "lastName": "Doe",
    "studentEmail": "john@example.com",
    "studentPhone": "9876543210",
    "gender": "male",
    "address": {
      "fullAddress": "123/A, Main Street, Downtown Area",
      "town": "Chennai",
      "pincode": "600001"
    }
  }
]
