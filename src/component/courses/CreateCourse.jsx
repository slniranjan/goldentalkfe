import React, { useState } from "react";
import axios from "axios";
import "./Course.css";
import {baseUrl, sectionIdIelts, sectionNameIelts} from "../../assets/assets.js";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateCourse = () => {
    const sectionName = sectionNameIelts;
    const [formData, setFormData] = useState({
        category: "",
        name: "",
        fee: "",
        sectionId: sectionIdIelts,
        installment: false,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        let formErrors = {};
        if (!formData.category) formErrors.category = "Category is required";
        if (!formData.name) formErrors.name = "Name is required";
        if (!formData.fee || isNaN(formData.fee) || formData.fee <= 0)
            formErrors.fee = "Fee must be a positive number";
        if (!formData.sectionId || isNaN(formData.sectionId) || formData.sectionId <= 0)
            formErrors.sectionId = "Section ID must be a positive integer";

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        // Convert fee and sectionId to integers
        const courseData = {
            ...formData,
            fee: parseInt(formData.fee, 10), // Convert fee to integer
            sectionId: parseInt(formData.sectionId, 10), // Convert sectionId to integer
        };

        // If validation is successful, submit the form
        axios
            .post(baseUrl + "courses", courseData)
            .then((response) => {
                toast.success("Course Created successfully!", {
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
                    category: "",
                    name: "",
                    fee: "",
                    sectionId: "",
                    installment: false,
                });
            })
            .catch((error) => {
                console.error("Error adding course:", error);
            });
    };

    return (
        <div className="course-container">
            <h1 className="header-style-1">Course Details</h1>
            <form onSubmit={handleSubmit} className="course-form">
                <h1>Course Register</h1>
                <div className="form-group">
                    <label>Category</label>
                    <select
                        id="section-select"
                        name="category"    // ✅ Added name attribute to bind with formData
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="">-- Select Category --</option>
                        <option value="simple">Simple</option>
                        <option value="package">Package</option>
                        <option value="seminar">Seminar</option>
                    </select>


                    <p>Selected Section: {formData.category}</p>
                    {errors.category && <div className="error">{errors.category}</div>}
                </div>

                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <div className="error">{errors.name}</div>}
                </div>

                <div className="form-group">
                    <label>Fee</label>
                    <input
                        type="number"
                        name="fee"
                        value={formData.fee}
                        onChange={handleChange}
                        min="1"
                    />
                    {errors.fee && <div className="error">{errors.fee}</div>}
                </div>

                <div className="form-group">
                    <label>Section Name</label>
                    <input
                        type="text"
                        name="sectionName"
                        value={sectionName}
                        // onChange={handleChange}
                        // min="1"
                        readOnly
                    />
                    {errors.sectionId && <div className="error">{errors.sectionId}</div>}
                </div>

                <div className="inline-checkbox">
                    <label htmlFor="installment">Installment</label>
                    <input
                        type="checkbox"
                        id="installment"
                        name="installment"
                        checked={formData.installment}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">Submit</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default CreateCourse;
