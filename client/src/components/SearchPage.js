// In src/components/Search.js
import React, { useState } from 'react';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = event => {
        event.preventDefault();
        alert(`Searching for "${searchTerm}"`); // Replace this with your search logic
    };

    return (
        <div>
            <h1>Search Page</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchTerm}
                    onChange={handleChange}
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Search;
