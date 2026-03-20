import { useContext } from 'react';
import { useNavigate, Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import logo from '../../assets/white_logo.png';
import styles from './NavBar.module.css';

const NavBar = () => {
    const { user, setUser } = useContext(UserContext);
    
    const navigate = useNavigate(); 

    const handleSignOut = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
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
                    <li className={styles.navLinks}>
                        <ul>
                            <li>
                                <Link to='/reports'>
                                    My Reports
                                </Link>
                            </li>
                            <li>
                                <Link to='/community'>
                                    Community Reports
                                </Link>
                            </li>
                            <li>
                                <Link to='/dashboard'>
                                    Insights
                                </Link>
                            </li>                           
                            <li>
                                <button onClick={handleSignOut} className={styles.navButton}>
                                    Sign Out
                                </button>
                            </li>

                        </ul>
                    </li>
                </ul>
            ) : (
                <ul>
                    <li>
                        <Link to='/' className={styles.logoLink}>
                            <img src={logo} alt="HydroWave logo" className={styles.logo} />
                            HydroWave
                        </Link>
                    </li>
                    <li className={styles.navLinks}>
                        <ul> 
                            <li>
                                <Link to='/'>
                                    Sign In
                                </Link>
                            </li>
                            <li>
                                <Link to='/sign-up'>
                                    Sign Up
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            )}
        </nav>
    );
};

export default NavBar;
