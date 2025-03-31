import React from 'react';

const Header: React.FC = () => {
    return (
        <header>
            <h1>Home Automation</h1>
            <nav>
                <ul>
                    <li><a href="/">Dashboard</a></li>
                    <li><a href="/settings">Settings</a></li>
                    <li><a href="/about">About</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;