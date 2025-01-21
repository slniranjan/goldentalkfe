import React, { useState } from "react";
import "./Student.css";
import axios from "axios";
import { baseUrl } from "../../assets/assets.js";

const SecondPaymentModal = ({ student, onClose, onSave }) => {
    const [editValue, setEditValue] = useState(student.secondPaymentAmount || 0);

    const handleSecondPaymentBlur = (studentId, courseId, value) => {
        return axios
            .put(`${baseUrl}students/${studentId}/courses/${courseId}?payment=${value}`)
            .then(() => {
                // Notify parent component of the changes
                onSave(studentId, courseId, value);
            })
            .catch((error) => {
                console.error("Error updating second payment amount:", error);
            });
    };


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Update Second Payment</h2>
                <p>
                    <strong>Student:</strong> {student.firstName} {student.lastName}
                </p>
                <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() =>
                        handleSecondPaymentBlur(
                            student.studentId,
                            student.courseId, // Replace this with the actual courseId as needed
                            parseFloat(editValue)
                        )
                    }
                    placeholder="Enter Second Payment Amount"
                    style={{ width: "100%", border: "none", textAlign: "right" }}
                />
                <div className="modal-buttons">
                    <button
                        onClick={() => {
                            handleSecondPaymentBlur(
                                student.studentId,
                                student.courseId, // Replace this with the actual courseId as needed
                                parseFloat(editValue)
                            ).then(() => {
                                // Close the modal after the save operation is successful
                                onClose();
                                window.location.reload();
                            });
                        }}
                        className="save-button"
                    >
                        Save
                    </button>

                    <button onClick={onClose} className="cancel-button">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SecondPaymentModal;
