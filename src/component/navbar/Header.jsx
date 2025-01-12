import NavBar from "./NavBar.jsx";

const Header = () => {
    return (
        <div className="min-h-screen mb-4 bg-cover bg-center flex items-center justify-center w-full overflow-hidden"
            style={{backgroundImage: "url('./bg2.jpg')"}}
            id="Header">
            <NavBar/>
            <div className="container text-center mx-auto px-6 md:px-20 lg:px-32 text-black">
                {/* Heading */}
                <h2 className="text-5xl sm:text-6xl md:text-[82px] font-semibold max-w-4xl mx-auto">
                    Welcome to IELTS with Malitha
                </h2>

                {/* Buttons */}
                <div className="space-x-4 mt-10">
                    <a href="#Projects"
                        className="border border-white text-white px-6 py-3 rounded-lg
                        hover:bg-white hover:text-black transition">
                        Future
                    </a>
                    <a href="#"
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
                        Contact Us
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Header;

