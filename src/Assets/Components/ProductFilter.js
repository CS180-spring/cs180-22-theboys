import React, { useState } from 'react';
import ProductViewPage from "./ProductViewPage";
import "../Styles/ProductViewPageStyles.css";

const CascadingDropdown = () => {
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [cities, setCities] = useState([]);

    const countries = ['USA', 'Canada'];
    const cityData = {
        USA: ['New York', 'Los Angeles', 'Chicago'],
        Canada: ['Toronto', 'Vancouver', 'Montreal']
    };

    const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value);
        setCities(cityData[event.target.value]);
    }

    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
    }

    return (
        <form classname = "FilterDropdown">
            <div>
            <select value={selectedCountry} onChange={handleCountryChange}>
                <option value="">Price</option>
                {countries.map((country, index) => (
                    <option key={index} value={country}>{country}</option>
                ))}
            </select>
            </div>
            
            <div>
            <select value={selectedCity} onChange={handleCityChange}>
                <option value="">Brand</option>
                {cities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                ))}
            </select>
            </div>
            
        </form>
    );
}

export default CascadingDropdown;