import backgroundImg from './images/background-img.png'
import logo from './images/logo.png'
import arrow_right from './images/arrow-right.png'
import cross from './images/cross.png'
import earth from './images/earth.png'
import left_arrow from './images/left-arrow.png'
import menu from './images/menu.png'
import r_bg from './images/rbg.png'
import home from './images/home.png'


export const images = {

    backgroundImg,
    arrow_right,
    cross,
    earth,
    left_arrow,
    logo,
    menu,
    r_bg,
    home,
}

export const baseUrl = process.env.REACT_APP_API_URL + "/gt/api/v1/" || "http://gt-backend:8080/gt/api/v1/";
// export const baseUrl = "http://gt-backend:8080/gt/api/v1/";

export const sectionIdIelts = 1;
export const sectionNameIelts = "IELTS";

export const sectionIdPte = 2;
export const sectionNamePte = "PTE";

export const sectionIdOet = 3;
export const sectionNameOet = "OET";