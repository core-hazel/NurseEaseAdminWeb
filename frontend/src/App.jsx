import React from 'react';
import Dropdown from './components/Dropdown';

const App = () => {
    const handleHospitalSelect = (hospital) => {
        console.log('Selected Hospital:', hospital);
        // You can save the selected hospital ID here to send with other requests if needed
    };

    return (
        <div className="App p-4">
            <h1 className="text-2xl mb-4">Hospital Selection</h1>
            <Dropdown onHospitalSelect={handleHospitalSelect} />
        </div>
    );
};

export default App;

