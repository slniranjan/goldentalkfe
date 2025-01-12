import React, {useState, useEffect} from "react";
import "./Payments.css";
import {baseUrl} from "../../assets/assets.js"; // Import the CSS file

const UpcomingPayments = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data from the endpoint
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(baseUrl + "students/notifications");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const jsonData = await response.json();
                // Extract necessary fields
                const formattedData = jsonData.map((item) => ({
                    firstPaymentAmount: item.firstPaymentAmount,
                    firstPaymentDate: new Date(item.firstPaymentDate).toLocaleDateString(),
                    nextPaymentDate: new Date(item.nextPaymentDate).toLocaleDateString(),
                    studentId: item.studentResponseDto?.studentId || "N/A",
                    whatsAppNum: item.studentResponseDto?.whatsAppNum || "N/A",
                    section: item.studentResponseDto?.section || "N/A",
                    course: item.studentResponseDto?.course || "N/A",
                }));
                setData(formattedData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Render loading, error, or table
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (

        <div className="table-container">
            <h1 className='header-style'>Upcoming Payments</h1>
            <table className="payment-table">
                <thead>
                <tr>
                    <th>First Payment Amount</th>
                    <th>First Payment Date</th>
                    <th>Next Payment Date</th>
                    <th>Student ID</th>
                    <th>WhatsApp Number</th>
                    <th>Section</th>
                    <th>Course</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
                        <td>{row.firstPaymentAmount}</td>
                        <td>{row.firstPaymentDate}</td>
                        <td>{row.nextPaymentDate}</td>
                        <td>{row.studentId}</td>
                        <td>{row.whatsAppNum}</td>
                        <td>{row.section}</td>
                        <td>{row.course}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UpcomingPayments
