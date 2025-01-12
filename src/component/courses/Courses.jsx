import React, {useEffect, useState} from "react";
import {useTable} from "react-table";
import axios from "axios";
import "./Course.css";
import {baseUrl} from "../../assets/assets.js";

const Courses = () => {
    const [data, setData] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    // Fetch data from the endpoint
    useEffect(() => {
        axios
            .get(baseUrl + "courses")
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    // Filter data based on Course ID
    const filteredData = data.filter((course) =>
        course.id.toString().includes(filterText)
    );

    // Handle opening the modal
    // Handle opening the modal
    const handleUpdateClick = (course) => {
        setSelectedCourse({
            id: course.id, // Include courseID in the selectedCourse object
            category: course.category,
            name: course.courseName, // Map courseName to name
            fee: course.courseFee, // Map courseFee to fee
            installment: course.installment,
        });
        setIsModalOpen(true);
    };

    // Handle form submission
    // Handle form submission
    const handleFormSubmit = (e) => {
        e.preventDefault();

        axios
            .put(baseUrl + `courses/${selectedCourse.id}`, selectedCourse)
            .then((response) => {
                // Update the data with the new response
                setData((prevData) =>
                    prevData.map((course) =>
                        course.id === response.data.id ? response.data : course
                    )
                );
                setIsModalOpen(false); // Close the modal
                setSelectedCourse(null); // Reset the selected course
            })
            .catch((error) => {
                console.error("Error updating course:", error);
            });
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setSelectedCourse((prevCourse) => ({
            ...prevCourse,
            [name]: name === "installment" ? e.target.checked : value, // Handle checkbox for installment
        }));
    };

    // Define columns
    const columns = React.useMemo(
        () => [
            {
                Header: "ID",
                accessor: "id",
            },
            {
                Header: "Category",
                accessor: "category",
            },
            {
                Header: "Course Name",
                accessor: "courseName",
            },
            {
                Header: "Course Fee",
                accessor: "courseFee",
                Cell: ({value}) => `Rs. ${value.toFixed(2)}`, // Format fee
            },
            {
                Header: "Installment Available",
                accessor: "installment",
                Cell: ({value}) => (value ? "Yes" : "No"),
            },
            {
                Header: "Update",
                accessor: "update",
                Cell: ({row}) => {
                    const course = row.original; // Access the row's data
                    return (
                        <button
                            onClick={() => handleUpdateClick(course)}
                            className='update-btn'>
                            Update
                        </button>
                    );
                },
            },
        ],
        []
    );

    // Initialize the table instance
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({columns, data: filteredData});

    return (
        <div className="headers" style={{padding: "53px", minHeight: "100vh"}}>
            <div className="course-table-container">
                <h1 className="header-style-1">Course Details</h1>
                {/* Filter Section */}
                <div style={{marginBottom: "20px", textAlign: "left"}}>
                    <input
                        id="filter"
                        placeholder="Filter by Course ID"
                        type="text"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        style={{marginBottom: "10px", padding: "5px", borderRadius: "10px"}}
                    />
                </div>
                <table {...getTableProps()} className="course-table">
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th
                                    key={column.id || column.accessor}
                                    {...column.getHeaderProps()}
                                >
                                    {column.render("Header")}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row);
                        const {key, ...rowProps} = row.getRowProps();
                        return (
                            <tr key={key} {...rowProps}>
                                {row.cells.map((cell) => {
                                    const {key: cellKey, ...cellProps} = cell.getCellProps();
                                    return (
                                        <td key={cellKey} {...cellProps}>
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* Modal for Update Form */}
            {isModalOpen && selectedCourse && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Update Course</h2>
                        <form onSubmit={handleFormSubmit}>
                            <label>
                                Category:
                                <input
                                    type="text"
                                    name="category"
                                    value={selectedCourse.category}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <br/>
                            <label>
                                Name:
                                <input
                                    type="text"
                                    name="name"
                                    value={selectedCourse.name}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <br/>
                            <label>
                                Fee:
                                <input
                                    type="number"
                                    name="fee"
                                    value={selectedCourse.fee}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <br/>
                            <label className="inline-checkbox">
                                Installment Available:
                                <input
                                    type="checkbox"
                                    name="installment"
                                    checked={selectedCourse.installment}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <br/>
                            <button type="submit">Save</button>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                style={{marginLeft: "10px"}}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Courses;
