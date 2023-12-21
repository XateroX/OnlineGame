import React from 'react';
import { Link } from 'react-router-dom';

const HomeScreen = () => {
    return (
        <div>
            <h1>Welcome to Comet Clash!</h1>
            <p>Get ready to clash with comets in this exciting game.</p>
            <div>
                <Link to="/newgame">Create Lobby</Link>
            </div>
            <div>
                <Link to="/login">Find Lobby</Link>
            </div>
        </div>
    );
};

export default HomeScreen;
