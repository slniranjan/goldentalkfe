import './Navbar.css';
import {Link} from "react-router-dom";
import {images} from "../../assets/assets.js";
import './Navbar.css';
import {useState} from "react";

const NavBar = () => {
    const [dropdown, setDropdown] = useState(null);

    const toggleDropdown = (menu) => {
        if (dropdown === menu) {
            setDropdown(null); // Close dropdown if already open
        } else {
            setDropdown(menu); // Open the clicked dropdown
        }
    };

    return (
        <nav className='nav-container'>
            <img src={images.logo} alt="Logo" className='logo'/>
            <ul className="nav-list">

                <li>
                    <Link to="/">
                        <img src={images.home} alt="home" className='home'/>
                    </Link>
                </li>
                <div className='list-align'>

                    <li>
                        <Link to="/students">STUDENTS</Link>
                    </li>

                    <li>
                        <Link to="/teachers">TEACHERS</Link>
                    </li>

                    <li
                        onMouseEnter={() => toggleDropdown("PAYMENTS")}
                        onMouseLeave={() => toggleDropdown(null)}
                        className="nav-item"
                    >
                        <Link to="#">PAYMENTS</Link>
                        {dropdown === "PAYMENTS" && (
                            <ul className="dropdown-menu">
                                <li><Link to="/upcomming-payments">Upcoming Payments</Link></li>
                                <li><Link to="/delay-payments">Delay Payments</Link></li>
                            </ul>
                        )}
                    </li>

                    <li
                        onMouseEnter={() => toggleDropdown("COURSES")}
                        onMouseLeave={() => toggleDropdown(null)}
                        className="nav-item"
                    >
                        <Link to="#">COURSES</Link>
                        {dropdown === "COURSES" && (
                            <ul className="dropdown-menu">
                                <li><Link to="/courses">All Courses</Link></li>
                                <li><Link to="/create-courses">Create New Course</Link></li>
                            </ul>
                        )}
                    </li>

                    <li
                        onMouseEnter={() => toggleDropdown("IELTS")}
                        onMouseLeave={() => toggleDropdown(null)}
                        className="nav-item"
                    >
                        <Link to="#">IELTS</Link>
                        {dropdown === "IELTS" && (
                            <ul className="dropdown-menu">
                                <li><Link to="/student-register-ielts">Student Register</Link></li>
                                <li><Link to="/teacher-register-ielts">Teacher Register</Link></li>
                            </ul>
                        )}
                    </li>

                    <li
                        onMouseEnter={() => toggleDropdown("PTE")}
                        onMouseLeave={() => toggleDropdown(null)}
                        className="nav-item"
                    >
                        <Link to="#">PTE</Link>
                        {dropdown === "PTE" && (
                            <ul className="dropdown-menu">
                                <li><Link to="/student-register-pte">Student Register</Link></li>
                                <li><Link to="/teacher-register-pte">Teacher Register</Link></li>
                            </ul>
                        )}
                    </li>

                    <li
                        onMouseEnter={() => toggleDropdown("OET")}
                        onMouseLeave={() => toggleDropdown(null)}
                        className="nav-item"
                    >
                        <Link to="#">OET</Link>
                        {dropdown === "OET" && (
                            <ul className="dropdown-menu">
                                <li><Link to="/student-register-oet">Student Register</Link></li>
                                <li><Link to="/teacher-register-oet">Teacher Register</Link></li>
                            </ul>
                        )}
                    </li>

                    <li>
                        <button className='btn'>Sign Up</button>
                    </li>
                </div>
            </ul>
        </nav>
    );
};

export default NavBar;
