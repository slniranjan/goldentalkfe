import {useState, useEffect} from "react";
import "./Teacher.css"
import {baseUrl} from "../../assets/assets.js";
import {useNavigate} from "react-router-dom";

const Teachers = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // Data after applying filters
    const [selectedSection, setSelectedSection] = useState('All'); // Current filter

    const [selectedTeacher, setSelectedTeacher] = useState(null); // Store the teacher being updated
    const [updateForm, setUpdateForm] = useState({
        name: '',
        nic: '',
        phoneNumber: '',
        sectionId: '',
        courseIds: [],
        qualifications: [{ qualification: '', institute: '' }],
    });
    const navigate = useNavigate();

    // Fetch data
    useEffect(() => {
        fetch(baseUrl + 'teachers')
            .then((response) => response.json())
            .then((data) => {
                console.log(data); // Debug: Log the fetched data
                setData(data);
                setFilteredData(data); // Initialize filtered data
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    // Handle Filter Change
    const handleFilterChange = (e) => {
        const section = e.target.value;
        setSelectedSection(section);

        if (section === 'All') {
            setFilteredData(data); // Show all data
        } else {
            const filtered = data.filter((teacher) => teacher.section?.sectionName === section);
            setFilteredData(filtered); // Show filtered data
        }
    };

    // Handle Update Button Click
    const handleUpdateClick = (teacher) => {
        setSelectedTeacher(teacher);
        setUpdateForm({
            name: teacher.name,
            nic: teacher.nic,
            phoneNumber: teacher.phoneNumber,
            sectionId: teacher.section?.id || '',
            courseIds: teacher.courses?.map((course) => course.id) || [],
            qualifications: teacher.qualifications || [{ qualification: '', institute: '' }],
        });
    };

    // Handle Form Input Changes
    const handleFormChange = (e, index = null) => {
        const { name, value } = e.target;
        if (name.startsWith('qualification') || name.startsWith('institute')) {
            const updatedQualifications = [...updateForm.qualifications];
            updatedQualifications[index][name] = value;
            setUpdateForm({ ...updateForm, qualifications: updatedQualifications });
        } else {
            setUpdateForm({ ...updateForm, [name]: value });
        }
    };

    // Handle Update Form Submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedTeacher) {
            fetch(baseUrl + `teachers/${selectedTeacher.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateForm),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to update teacher');
                    }
                    return response.json();
                })
                .then((updatedTeacher) => {
                    console.log('Teacher updated successfully:', updatedTeacher);
                    // Refresh the table data
                    setData((prevData) =>
                        prevData.map((teacher) =>
                            teacher.id === updatedTeacher.id ? updatedTeacher : teacher
                        )
                    );
                    setSelectedTeacher(null); // Close the form
                    navigate(0);
                })
                .catch((error) => console.error('Error updating teacher:', error));
        }
    };

    return (
        <div className="table-container">
            <h1 className='header-style'>Teacher Records</h1>
                {/* Filter Dropdown */}
                <div className="filter-container">
                    <label htmlFor="sectionFilter">Filter by Section:</label>
                    <select
                        id="sectionFilter"
                        value={selectedSection}
                        onChange={handleFilterChange}
                    >
                        <option value="All">All</option>
                        <option value="PTE">PTE</option>
                        <option value="IELTS">IELTS</option>
                        <option value="OET">OET</option>
                    </select>
                </div>

                {/* Table */}
                <table className="teacher-table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>NIC</th>
                        <th>Phone Number</th>
                        <th>Section</th>
                        <th>Course Category</th>
                        <th>Qualification</th>
                        <th>Institute</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.map((teacher, index) => (
                        <tr key={index}>
                            <td>{teacher.name || 'N/A'}</td>
                            <td>{teacher.nic || 'N/A'}</td>
                            <td>{teacher.phoneNumber || 'N/A'}</td>
                            <td>{teacher.section?.sectionName || 'N/A'}</td>
                            <td>{teacher.courses?.[0]?.category || 'N/A'}</td>
                            <td>{teacher.qualifications?.[0]?.qualification || 'N/A'}</td>
                            <td>{teacher.qualifications?.[0]?.institute || 'N/A'}</td>
                            <td>
                                <button onClick={() => handleUpdateClick(teacher)}>Update</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Update Form */}
                {selectedTeacher && (
                    <div className="update-form-container">
                        <h1 className='header-style'>Update Teacher</h1>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={updateForm.name}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div>
                                <label>NIC:</label>
                                <input
                                    type="text"
                                    name="nic"
                                    value={updateForm.nic}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div>
                                <label>Phone Number:</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={updateForm.phoneNumber}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div>
                                <label>Section ID:</label>
                                <input
                                    type="number"
                                    name="sectionId"
                                    value={updateForm.sectionId}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div>
                                <label>Course IDs (comma-separated):</label>
                                <input
                                    type="text"
                                    name="courseIds"
                                    value={updateForm.courseIds.join(',')}
                                    onChange={(e) =>
                                        setUpdateForm({
                                            ...updateForm,
                                            courseIds: e.target.value.split(',').map(Number),
                                        })
                                    }
                                />
                            </div>
                            {updateForm.qualifications.map((qual, index) => (
                                <div key={index}>
                                    <label>Qualification:</label>
                                    <input
                                        type="text"
                                        name="qualification"
                                        value={qual.qualification}
                                        onChange={(e) => handleFormChange(e, index)}
                                    />
                                    <label className='label-position'>Institute:</label>
                                    <input
                                        type="text"
                                        name="institute"
                                        value={qual.institute}
                                        onChange={(e) => handleFormChange(e, index)}
                                    />
                                </div>
                            ))}
                            <button type="submit">Submit</button>
                            <button
                                type="button"
                                onClick={() => setSelectedTeacher(null)}
                                style={{marginLeft: '10px'}}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                )}
        </div>
);
};


export default Teachers
