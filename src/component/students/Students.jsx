import React, { useEffect, useState } from "react";
import { useTable } from "react-table";
import axios from "axios";
import EditStudentModal from "./EditStudentModal"; // Import the modal
import "./Student.css";
import {baseUrl} from "../../assets/assets.js";

const Students = () => {
    const [data, setData] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null); // For modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterText, setFilterText] = useState("");

    // Fetch data from API
    useEffect(() => {
        axios
            .get(baseUrl +"students?deleted=false")
            .then((response) => {
                const students = response.data.map((student) => ({
                    studentId: student.studentId,
                    firstName: student.firstName || "",
                    middleName: student.middleName || "",
                    lastName: student.lastName || "",
                    whatsAppNum: student.whatsAppNum || "",
                    section: student.section.join(", ") || "N/A",
                    course: student.course.join(", ") || "N/A",
                    paymentStatus: student.payments[0]?.paymentStatus || "N/A",
                    firstPaymentAmount: student.payments[0]?.firstPaymentAmount || 0,
                    secondPaymentAmount: student.payments[0]?.secondPaymentAmount || 0,
                }));
                setData(students);
            })
            .catch((error) => {
                console.error("Error fetching student data:", error);
            });
    }, [])


    // Handle modal open/close
    const openModal = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedStudent(null);
        setIsModalOpen(false);
    };

    // Handle editing Second Payment Amount
    const handleSecondPaymentBlur = (studentId, courseId, value) => {
        axios
            .put(
                baseUrl + `students/${studentId}/courses/${courseId}?payment=${value}`
            )
            .then(() => {
                // Update the data locally after successful PUT
                setData((prevData) =>
                    prevData.map((student) =>
                        student.studentId === studentId
                            ? { ...student, secondPaymentAmount: value }
                            : student
                    )
                );
            })
            .catch((error) => {
                console.error("Error updating second payment amount:", error);
            });
    };

    // Handle student deletion
    const handleDeleteStudent = (studentId) => {
        axios
            .delete(baseUrl + `students/${studentId}`)
            .then(() => {
                // Update the data locally after successful DELETE
                setData((prevData) => prevData.filter((student) => student.studentId !== studentId));
            })
            .catch((error) => {
                console.error("Error deleting student:", error);
            });
    };

    // Filter data based on studentId ID
    const filteredData = data.filter(student =>
        student.studentId.toString().includes(filterText)
    );

    // Define columns
    const columns = React.useMemo(
        () => [
            { Header: "First Name", accessor: "firstName" },
            { Header: "Middle Name", accessor: "middleName" },
            { Header: "Last Name", accessor: "lastName" },
            { Header: "WhatsApp Number", accessor: "whatsAppNum" },
            { Header: "Section", accessor: "section" },
            { Header: "Course", accessor: "course" },
            { Header: "Payment Status", accessor: "paymentStatus" },
            {
                Header: "First Payment Amount",
                accessor: "firstPaymentAmount",
                Cell: ({ value }) => `Rs. ${(value || 0).toFixed(2)}`,
            },
            {
                Header: "Second Payment Amount",
                accessor: "secondPaymentAmount",
                Cell: ({ row, value }) => {
                    const [editValue, setEditValue] = useState(value || 0);

                    return (
                        <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() =>
                                handleSecondPaymentBlur(
                                    row.original.studentId,
                                    1, // Replace with actual courseId if needed
                                    parseFloat(editValue)
                                )
                            }
                            style={{ width: "100%", border: "none", textAlign: "right" }}
                        />
                    );
                },
            },
            {
                Header: "Actions",
                Cell: ({ row }) => (
                    <button
                        className="edit-button"
                        onClick={() => openModal(row.original)}
                    >
                        Edit
                    </button>
                ),
            },
            {
                Header: "Delete",
                Cell: ({ row }) => (
                    <button
                        className="delete-button"
                        onClick={() => handleDeleteStudent(row.original.studentId)}
                    >
                        Delete
                    </button>
                ),
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data:filteredData});

    return (
        <div className="student-table-container">
            <h1 className='header-style'>Student Records</h1>

            <div style={{marginBottom: "20px", textAlign: "left"}}>
                {/*<label htmlFor="filter">Filter by Course ID: </label>*/}
                <input
                    id="filter"
                    placeholder="Filter by Student ID"
                    type="text"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    style={{marginBottom: "10px", padding: "5px", borderRadius: "10px"}}
                />
            </div>

            <table {...getTableProps()} className="student-table">
                <thead>
                {headerGroups.map((headerGroup) => {
                    const {key, ...rest} = headerGroup.getHeaderGroupProps(); // Destructure key
                    return (
                        <tr key={key} {...rest}>
                            {headerGroup.headers.map((column) => {
                                const {key: columnKey, ...columnRest} = column.getHeaderProps(); // Destructure key
                                return (
                                    <th key={columnKey} {...columnRest}>
                                        {column.render("Header")}
                                    </th>
                                );
                            })}
                        </tr>
                    );
                })}
                </thead>

                <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    const {key, ...rest} = row.getRowProps(); // Destructure key
                    return (
                        <tr key={key} {...rest}>
                            {row.cells.map((cell) => {
                                const {key: cellKey, ...cellRest} = cell.getCellProps(); // Destructure key
                                return (
                                    <td key={cellKey} {...cellRest}>
                                        {cell.render("Cell")}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
                </tbody>
            </table>

            {/* Edit Modal */}
            {isModalOpen && (
                <EditStudentModal
                    student={selectedStudent}
                    onClose={closeModal}
                    onSave={(updatedStudent) => {
                        setData((prevData) =>
                            prevData.map((student) =>
                                student.studentId === updatedStudent.studentId
                                    ? updatedStudent
                                    : student
                            )
                        );
                        closeModal();
                    }}
                />
            )}
        </div>
    );
};

export default Students;
