import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './Payments.css';
import {baseUrl} from "../../assets/assets.js"; // Import the CSS file

const DelayPayments = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        axios.get(baseUrl + 'students/delaying')
            .then(response => {
                setStudents(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    return (
        <div className="table-container">
            <h1 className='header-style'>Delay Payments</h1>
            <table className="payment-table">
                <thead>
                <tr>
                    <th>First Payment Amount</th>
                    <th>Next Payment Date</th>
                    <th>Student ID</th>
                    <th>WhatsApp Number</th>
                    <th>Section</th>
                    <th>Course</th>
                </tr>
                </thead>
                <tbody>
                {students.map((student, index) => (
                    <tr key={index}>
                        <td>{student.firstPaymentAmount}</td>
                        <td>{new Date(student.nextPaymentDate).toLocaleDateString()}</td>
                        <td>{student.studentResponseDto.studentId}</td>
                        <td>{student.studentResponseDto.whatsAppNum}</td>
                        <td>{student.studentResponseDto.section}</td>
                        <td>{student.studentResponseDto.course}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};


export default DelayPayments
