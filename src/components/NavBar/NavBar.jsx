import { useContext } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import logo from '../../assets/white_logo.png';
import styles from './NavBar.module.css';

const NavBar = () => {
    const { user, setUser } = useContext(UserContext);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        // Clear the user state
        setUser(null);
    };

    return (
        <nav>
            {user ? (
                <ul>
                    <li>
                        <Link to='/' className={styles.logoLink}>
                            <img src={logo} alt="HydroWave logo" className={styles.logo} />
                            HydroWave
                        </Link>
                    </li>
                    <div className={styles.navLinks}>
                        <ul>
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
                    </div>
                </ul>
            ) : (
                <ul>
                    <li>
                        <Link to='/' className={styles.logoLink}>
                            <img src={logo} alt="HydroWave logo" className={styles.logo} />
                            HydroWave
                        </Link>
                    </li>
                </ul>
            )}
        </nav>
    );
};

export default NavBar;
