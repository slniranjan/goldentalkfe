import React, {useEffect, useState} from 'react'
import "../Student.css"
import {baseUrl, sectionIdIelts, sectionNameIelts} from "../../../assets/assets.js";
import axios from "axios";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentRegisterIelts = () => {

    const sectionName = sectionNameIelts;
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        whatsAppNumber: "",
        nic: "",
        email: "",
        address: {
            street: "N/A",
            city: "N/A",
            district: "",
            province: "N/A",
        },
        sectionId: sectionIdIelts,
        courseId: "",
        payment: {
            firstPaymentAmount: "",
            secondPaymentAmount: "",
        },
        earlyBird: false
    });


    const [errors, setErrors] = useState({});
    const [setSelectedOption] = useState("");
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);

    useEffect(() => {
        // Fetch courses from the API
        axios
            .get(baseUrl + "courses/section/" + sectionIdIelts)
            .then((response) => {
                setCourses(response.data);
            })
            .catch((error) => {
                console.error("Error fetching courses:", error);
            });
    }, []);


    // Validation logic
    const validate = () => {
        const newErrors = {};

        if (!formData.firstName) newErrors.firstName = "First name is required.";
        if (!formData.lastName) newErrors.lastName = "Last name is required.";

        if (!formData.whatsAppNumber) {
            newErrors.whatsAppNumber = "Phone number is required.";
        } else if (!/^\+\d{1,15}$/.test(formData.whatsAppNumber)) {
            newErrors.whatsAppNumber = "Enter a valid phone number (e.g., +94712345678).";
        }

        if (!formData.nic) newErrors.nic = "NIC is required.";
        // Check NIC
        if (!formData.nic.trim() || 10 <= formData.nic.length <= 12) {
            newErrors.nic = "NIC must be between 10 to 12 characters.";
        }
        if (!formData.email) {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email Id (e.g., test@example.com).";
        }

        if (!formData.address.street) newErrors.street = "Street is required.";
        if (!formData.address.city) newErrors.city = "City is required.";
        if (!formData.address.district) newErrors.district = "District is required.";
        if (!formData.address.province) newErrors.province = "Province is required.";

        if (!formData.sectionId) newErrors.sectionId = "Section ID is required.";
        if (!formData.courseId) newErrors.courseId = "Course ID is required.";

        if (!formData.payment.firstPaymentAmount) {
            newErrors.firstPaymentAmount = "Payment amount is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle input changes
    const handleChange = (e) => {
        const {name, value} = e.target;
        /*Convert String to Int*/
        if (name.includes("payment.")) {
            // Extract the payment key (e.g., "firstPaymentAmount", "secondPaymentAmount")
            const key = name.split(".")[1];
            // Convert value to an integer or set to empty string if invalid
            const intValue = value === "" ? "" : parseInt(value, 10);

            setFormData((prev) => ({
                ...prev,
                payment: {...prev.payment, [key]: intValue},
            }));
        } else if (name === "sectionId") {
            // Convert the value to an integer
            const intValue = parseInt(value, 10) || ""; // Use empty string if value is NaN
            setFormData((prev) => ({
                ...prev,
                [name]: intValue,
            }));
        } else if (name.includes("address.")) {
            const key = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                address: {...prev.address, [key]: value},
            }));
        } else if (name.includes("payment.")) {
            const key = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                payment: {...prev.payment, [key]: value},
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            console.log("Form submitted:", formData);
            try {
                const response = await fetch(
                    baseUrl + "students",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                    }
                );

                // Log the response status
                console.log("Response status:", response.status);

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
                    } else {
                        toast.error("Unexpected error format", {
                            position: "top-right",
                            autoClose: 3000,
                            theme: "colored",
                        });
                    }
                }


                if (response.ok) {

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

                    const responseData = await response.json();
                    // Log the success response
                    console.log("Response data:", responseData);
                    // setMessage("Form submitted successfully!");
                } else {
                    const errorData = await response.json();
                    // Log the error response
                    console.log("Error response data:", errorData);
                    // setMessage(`Error: ${errorData.message}`);

                }
            } catch (error) {
                // Log the error details
                console.error("Error during submission:", error);

                // setMessage(`Error: ${error.message}`);
                if (error.response && error.response.status === 409) {
                    // Display backend error message
                    console.log(error.response.data.errorMessage); // This is the error message from backend
                    setErrors({ email: error.response.data.errorMessage }); // If you want to display in form
                } else {
                    console.error("Error:", error);
                }
            }
            // alert("Form submitted successfully!");
        } else {
            // alert("Please fix the errors in the form.");
            toast.error("Please fill the all required fields.", {
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
            <form onSubmit={handleSubmit}>
                <h1>Student Registration - IELTS</h1>

                {/* Personal Details */}
                <label>First Name</label>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                />
                {errors.firstName && <span className="error">{errors.firstName}</span>}

                <label>Middle Name</label>
                <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                />

                <label>Last Name</label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                />
                {errors.lastName && <span className="error">{errors.lastName}</span>}

                {/* NIC */}
                <label htmlFor="nic">NIC:</label>
                <input
                    type="text"
                    id="nic"
                    name="nic"
                    value={formData.nic}
                    onChange={handleChange}
                />
                {errors.nic && <p className="error">{errors.nic}</p>}

                {/*Email*/}
                <label htmlFor="email">Email:</label>
                <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                {errors.email && <p className="error">{errors.email}</p>}

                <label>WhatsApp Number</label>
                <input
                    type="text"
                    name="whatsAppNumber"
                    value={formData.whatsAppNumber}
                    onChange={handleChange}
                />
                {errors.whatsAppNumber && (
                    <span className="error">{errors.whatsAppNumber}</span>
                )}

                {/* Address Section */}
                {/*<label>Street</label>*/}
                {/*<input*/}
                {/*    type="text"*/}
                {/*    name="address.street"*/}
                {/*    value={formData.address.street}*/}
                {/*    onChange={handleChange}*/}
                {/*/>*/}
                {/*{errors.street && <span className="error">{errors.street}</span>}*/}

                {/*<label>City</label>*/}
                {/*<input*/}
                {/*    type="text"*/}
                {/*    name="address.city"*/}
                {/*    value={formData.address.city}*/}
                {/*    onChange={handleChange}*/}
                {/*/>*/}
                {/*{errors.city && <span className="error">{errors.city}</span>}*/}

                <label>District</label>
                <input
                    type="text"
                    name="address.district"
                    value={formData.address.district}
                    onChange={handleChange}
                />
                {errors.district && <span className="error">{errors.district}</span>}

                {/*<label>Province</label>*/}
                {/*<input*/}
                {/*    type="text"*/}
                {/*    name="address.province"*/}
                {/*    value={formData.address.province}*/}
                {/*    onChange={handleChange}*/}
                {/*/>*/}
                {/*{errors.province && <span className="error">{errors.province}</span>}*/}

                {/* Course Details */}
                <label>Section Name</label>
                <input
                    type="text"
                    name="sectionId"
                    value={sectionName}
                    // onChange={handleChange}
                    readOnly // Lock the field

                />
                {errors.sectionId && <span className="error">{errors.sectionId}</span>}

                <label>Course Name</label>
                <select
                    id="courseDropdown"
                    onChange={(e) => {
                        const courseId = parseInt(e.target.value, 10); // Convert string to integer
                        setSelectedCourseId(courseId);
                        setFormData((prev) => ({
                            ...prev,
                            courseId: courseId,
                        }));
                    }}
                    defaultValue=""
                >
                    <option value="" disabled>
                        -- Choose a Course --
                    </option>
                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.courseName}
                        </option>
                    ))}
                </select>
                {errors.courseId && <span className="error">{errors.courseId}</span>}

                {/* Payment Details */}
                <label>Payment Amount</label>
                <input
                    type="number"
                    name="payment.firstPaymentAmount"
                    value={formData.payment.firstPaymentAmount}
                    onChange={handleChange}
                />
                {errors.firstPaymentAmount && (
                    <span className="error">{errors.firstPaymentAmount}</span>
                )}

                {/*<label>Second Payment Amount</label>*/}
                {/*<input*/}
                {/*    type="number"*/}
                {/*    name="payment.secondPaymentAmount"*/}
                {/*    value={formData.payment.secondPaymentAmount}*/}
                {/*    onChange={handleChange}*/}
                {/*/>*/}

                <label htmlFor="earlyBird">Early Bird</label>
                    <input
                        type="checkbox"
                        id="earlyBird"
                        name="earlyBird"
                        checked={formData.earlyBird}
                        onChange={handleChange}
                    />

                <button type="submit" className="submit-button">
                    Submit
                </button>
            </form>
            <ToastContainer/>
        </div>
    )
}

export default StudentRegisterIelts
