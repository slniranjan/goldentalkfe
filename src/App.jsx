import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import NavBar from "./component/navbar/NavBar.jsx";
import Hero from "./component/background/Hero.jsx";
import Students from "./component/students/Students.jsx";
import Teachers from "./component/techers/Teachers.jsx";
import StudentRegisterIelts from "./component/students/students-ielts/StudentRegisterIelts.jsx";
import TeacherRegisterIelts from "./component/techers/teachers-ielts/TeacherRegisterIelts.jsx";
import StudentRegisterPte from "./component/students/students-pte/StudentRegisterPte.jsx";
import TeacherRegisterPte from "./component/techers/teachers-pte/TeacherRegisterPte.jsx";
import StudentRegisterOet from "./component/students/students-oet/StudentRegisterOet.jsx";
import TeacherRegisterOet from "./component/techers/teachers-oet/TeacherRegisterOet.jsx";
import Courses from "./component/courses/Courses.jsx";
import CreateCourse from "./component/courses/CreateCourse.jsx";
import UpcomingPayments from "./component/payments/UpcomingPayments.jsx";
import DelayPayments from "./component/payments/DelayPayments.jsx";


function App() {
    return (
        <div className="background">
            {/*// <Teachers/>*/}
            <Router>
                <NavBar/>
                <Routes>
                    {/*Home*/}
                    <Route path="/" element={<Hero/>}/>

                    <Route path="/teachers" element={<Teachers/>}/>
                    <Route path="/students" element={<Students/>}/>

                    {/*Payments*/}
                    <Route path="/upcomming-payments" element={<UpcomingPayments/>}/>
                    <Route path="/delay-payments" element={<DelayPayments/>}/>

                    {/*Courses*/}
                    <Route path="/courses" element={<Courses/>}/>
                    <Route path="/create-courses" element={<CreateCourse/>}/>

                    {/*IELTS*/}
                    <Route path="/student-register-ielts" element={<StudentRegisterIelts/>}/>
                    <Route path="/teacher-register-ielts" element={<TeacherRegisterIelts/>}/>

                    {/*PTE*/}
                    <Route path="/student-register-pte" element={<StudentRegisterPte/>}/>
                    <Route path="/teacher-register-pte" element={<TeacherRegisterPte/>}/>

                    {/*OET*/}
                    <Route path="/student-register-oet" element={<StudentRegisterOet/>}/>
                    <Route path="/teacher-register-oet" element={<TeacherRegisterOet/>}/>

                    {/*SignUp*/}
                    {/*<Route path="/sign-up" element={<SignUp/>}/>*/}

                </Routes>
            </Router>
        </div>
    );
}

export default App;
