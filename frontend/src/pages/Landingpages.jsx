import Navebar from "../components/Navebar";   
import Herosection from '../components/Hero.jsx';
import Features from '../components/Features.jsx';
import Builtfor from '../components/Builtfor.jsx';
import Getstarted from '../components/Getstarted.jsx';
import Footer from '../components/Footer.jsx';
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