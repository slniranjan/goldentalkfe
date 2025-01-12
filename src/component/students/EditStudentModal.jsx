import React, { useState } from "react";
import axios from "axios";
import "./Student.css";
import {baseUrl} from "../../assets/assets.js";

const EditStudentModal = ({ student, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        firstName: student.firstName,
        middleName: student.middleName,
        lastName: student.lastName,
        whatsAppNumber: student.whatsAppNum,
        sectionId: student.section.split(",").map(Number),
        courseIds: student.course.split(",").map(Number),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = () => {
        axios
            .put(baseUrl +`students/${student.studentId}`, {
                ...formData,
                address: {
                    street: "Updated Street", // Placeholder values
                    city: "Updated City",
                    district: "Updated District",
                    province: "Updated Province",
                },
            })
            .then((response) => {
                onSave(response.data);
            })
            .catch((error) => {
                console.error("Error updating student:", error);
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Student</h2>
                <form>
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Middle Name:
                        <input
                            type="text"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        WhatsApp Number:
                        <input
                            type="text"
                            name="whatsAppNumber"
                            value={formData.whatsAppNumber}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="button" onClick={handleSubmit}>
                        Save
                    </button>
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditStudentModal;
