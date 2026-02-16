import { useContext } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import logo from '../../assets/waves_logo.png';

const NavBar = () => {
    const { user, setUser } = useContext(UserContext);

    // Add the handleSignOut function
    const handleSignOut = () => {
        // Clear the token from localStorage
        localStorage.removeItem('token');
        // Clear the user state
        setUser(null);
    };

    return (
        <nav>
            {user ? (
                <ul>
                    <li>
                        <Link to='/' style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img src={logo} alt="HydroWave logo" style={{ height: '20px' }} />
                            HydroWave
                        </Link>
                    </li>
                    <li>
                        <Link to='/reports'>
                            My Reports
                        </Link>
                    </li>
                    <li>
                        <Link to='/dashboard'>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to='/community'>
                            Community Reports
                        </Link>
                    </li>
                    <li>
                        <Link to='/' onClick={handleSignOut}>
                            Sign Out
                        </Link>
                    </li>
                </ul>
            ) : (
                <ul>
                    <li>
                        <Link to='/' style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img src={logo} alt="HydroWave logo" style={{ height: '20px' }} />
                            HydroWave
                        </Link>
                    </li>
                    <li>
                        <Link to='/sign-in'>
                            Sign In
                        </Link>
                    </li>
                    <li>
                        <Link to="/sign-up">
                            Sign Up
                        </Link>
                    </li>
                </ul>
            )}
        </nav>
    );
};

export default NavBar;
