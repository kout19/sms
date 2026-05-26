import Navebar from "../components/landing/Navebar";   
import Herosection from '../components/landing/Hero.jsx';
import Features from '../components/landing/Features.jsx';
import Builtfor from '../components/landing/Builtfor.jsx';
import Getstarted from '../components/landing//Getstarted.jsx';
import Footer from '../components/landing/Footer.jsx';
const Landingpages =() =>{
    return (
        <div>
            <Navebar />
            <Herosection />
            <Features />
            <Builtfor />
            <Getstarted />
            <Footer />
        </div>
    )
}

export default Landingpages;