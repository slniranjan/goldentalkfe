import React, {useEffect, useState} from "react";
import "../Teacher.css";
import {baseUrl, sectionNameIelts} from "../../../assets/assets.js";
import axios from "axios";
import Select from 'react-select';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TeacherRegisterIelts = () => {
    const sectionName = sectionNameIelts;
    const [errors, setErrors] = useState({}); // To track validation errors
    const [message, setMessage] = useState("");
    const [options, setOptions] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        nic: "",
        phoneNumber: "",
        sectionId: 1,
        courseIds: [],
        qualifications: [{qualification: "", institute: ""}],
    });

    useEffect(() => {
        // Fetch data from the API
        const fetchCourses = async () => {
            try {
                const response =
                    await axios.get(baseUrl + 'courses/section/1');
                const courses = response.data;

                // Map courses to dropdown options
                const formattedOptions = courses.map(course => ({
                    value: course.id,
                    label: `${course.courseName} - ${course.category}`,
                }));

                setOptions(formattedOptions);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    // Handle selection change
    const handleSelectionChange = (selectedOptions) => {
        setSelectedCourses(selectedOptions.map(option => option.value));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: name === "sectionId" ? parseInt(value, 10) || "" : value, // Convert `sectionId` to an integer
        }));
    };

    // Handle changes in qualification table
    const handleQualificationChange = (index, field, value) => {
        const updatedQualifications = [...formData.qualifications];
        updatedQualifications[index][field] = value;

        setFormData((prev) => ({
            ...prev,
            qualifications: updatedQualifications,
        }));
    };

    // Remove a row from the qualifications table
    const removeQualificationRow = (index) => {
        const updatedQualifications = [...formData.qualifications];
        updatedQualifications.splice(index, 1);

        setFormData((prev) => ({
            ...prev,
            qualifications: updatedQualifications,
        }));
    };

    const addQualificationRow = () => {
        setFormData({
            ...formData,
            qualifications: [
                ...formData.qualifications,
                {qualification: "", institute: ""},
            ],
        });
    };

    const validateForm = () => {
        const newErrors = {};

        // Check name
        if (!formData.name.trim()) {
            newErrors.name = "Name is required.";
        }

        // Check NIC
        if (!formData.nic.trim() || formData.nic.length < 10) {
            newErrors.nic = "NIC must be at least 10 characters.";
        }

        // Check Phone Number
        // if (!formData.phoneNumber.trim() ||
        //     /^\\+[1-9]\\d{1,14}$/.test(formData.phoneNumber)
        // ) {
        //     newErrors.phoneNumber = "Enter a valid phone number (e.g., +94712345678).";
        // }

        if (!formData.phoneNumber) {
            newErrors.phoneNumber = "WhatsApp number is required.";
        } else if (/^\\+[1-9]\\d{1,14}$/.test(formData.whatsAppNumber)) {
            newErrors.phoneNumber = "Enter a valid phone number (e.g., +94712345678).";
        }

        // Check Section ID
        // Check Section ID
        if (!formData.sectionId || formData.sectionId.toString().trim() === "") {
            newErrors.sectionId = "Section ID is required.";
        }

        // Check Qualifications
        formData.qualifications.forEach((qualification, index) => {
            if (!qualification.qualification.trim()) {
                newErrors[`qualification-${index}`] = "Qualification is required.";
            }
            if (!qualification.institute.trim()) {
                newErrors[`institute-${index}`] = "Institute is required.";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Form is valid if no errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                // Update the formData with selected course IDs
                const updatedFormData = {
                    ...formData,
                    courseIds: selectedCourses, // Include selected course IDs
                };

                const response = await fetch(baseUrl + "teachers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedFormData), // Use the updated formData
                });

                if (response && response.status === 409) {
                    const errorData = await response.json();  // Correctly parse the JSON response

                    // Show the error message in the toast
                    toast.error(errorData.errorMessage, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                }

                if (response && response.status === 400) {
                    const errorData = await response.json(); // Parse the JSON response

                    console.log(errorData)

                    // Assuming you want to show the error message from the first object in the array
                    if (Array.isArray(errorData) && errorData.length > 0) {
                        const firstErrorMessage = errorData[0]?.errorMessage || "Unknown error occurred";

                        // Show the error message in the toast
                        toast.error(firstErrorMessage, {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                        });
                    } else if (!errorData?.errorMessage?.trim()) {
                        toast.error(errorData.errorMessage, {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                        });
                    } else {
                        toast.error("Unexpected error format", {
                            position: "top-right",
                            autoClose: 3000,
                            theme: "colored",
                        });
                    }
                }

                if (response.ok) {
                    // setMessage("Form submitted successfully!");
                    toast.success("Form submitted successfully!", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    setFormData({
                        name: "",
                        nic: "",
                        phoneNumber: "",
                        sectionId: "",
                        courseIds: [],
                        qualifications: [{ qualification: "", institute: "" }],
                    });
                    setSelectedCourses([]); // Reset selected courses
                    setErrors({});
                } else {
                    // setMessage("An error occurred while submitting the form.");
                    const errorData = await response.json();  // Correctly parse the JSON response

                    // Show the error message in the toast
                    toast.error(errorData.errorMessage, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                }
            } catch (error) {
                console.error("Error during submission:", error);
            }
        } else {
            toast.error("Please fix the validation errors.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    };


    return (
        <div className="form-container">
            {message && <div className="error-message">{message}</div>}
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <h1>Teachers Registration - IELTS</h1>

                    {/* Name */}
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    {errors.name && <p className="error">{errors.name}</p>}

                    {/* NIC */}
                    <label htmlFor="nic">NIC:</label>
                    <input
                        type="text"
                        id="nic"
                        name="nic"
                        value={formData.nic}
                        onChange={handleInputChange}
                    />
                    {errors.nic && <p className="error">{errors.nic}</p>}

                    {/* Phone Number */}
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                    />
                    {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}

                    {/* Section ID */}
                    {/*<label htmlFor="sectionId">Section ID:</label>*/}
                    {/*<input*/}
                    {/*    type="text"*/}
                    {/*    id="sectionId"*/}
                    {/*    name="sectionId"*/}
                    {/*    value={formData.sectionId}*/}
                    {/*    readOnly*/}
                    {/*/>*/}
                    {/*{errors.sectionId && <p className="error">{errors.sectionId}</p>}*/}
                    <label>Section Name:</label>
                    <input
                        type="text"
                        name="sectionName"
                        value={sectionName}
                        readOnly
                    />
                    {errors.sectionId && <p className="error">{errors.sectionId}</p>}

                    {/*Course Section */}
                    <label>
                        Course IDs (comma-separated):
                        <Select
                            options={options}
                            isMulti
                            onChange={handleSelectionChange}
                            placeholder="Select courses"
                        />
                        {errors.courseIds && <p className="error">{errors.courseIds}</p>}
                    </label>

                    {/* Qualifications */}
                    <fieldset>
                        <legend>Qualifications:</legend>
                        <table className="qualification-table">
                            <thead>
                            <tr>
                                <th>Qualification</th>
                                <th>Institute</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {formData.qualifications.map((qualification, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="text"
                                            value={qualification.qualification}
                                            onChange={(e) =>
                                                handleQualificationChange(
                                                    index,
                                                    "qualification",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {errors[`qualification-${index}`] && (
                                            <p className="error">{errors[`qualification-${index}`]}</p>
                                        )}
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={qualification.institute}
                                            onChange={(e) =>
                                                handleQualificationChange(index, "institute", e.target.value)
                                            }
                                        />
                                        {errors[`institute-${index}`] && (
                                            <p className="error">{errors[`institute-${index}`]}</p>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            onClick={() => removeQualificationRow(index)}
                                            className="remove-btn"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <button type="button" onClick={addQualificationRow} className="add-btn">
                            Add Row
                        </button>
                    </fieldset>
                </fieldset>

                <button type="submit" className="submit-btn">
                    Submit
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default TeacherRegisterIelts;
