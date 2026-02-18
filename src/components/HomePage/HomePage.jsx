import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import logo from "../../assets/blue_logo.png";
import styles from "./HomePage.module.css";

const HomePage = () => {

    const { user } = useContext(UserContext);

    return (
        <main className={styles.container}>
            <div className="brandWrapper">
                <img src={logo} alt="HydroWave logo" className="brandLogo" />
                <h1 className="brandTitle">HydroWave</h1>
            </div>

            <div className={styles.contentCard}>
                <h2 className={styles.welcomeTitle}>Welcome, {user.username}! 👋</h2>
                <p className={styles.subtext}>
                    Ready to make a difference? Start monitoring water sources in your community.
                </p>

                <h3>🌊 Get Started</h3>
                <p className={styles.subtext}>Create a new water observation report to help track and protect local water resources.</p>
                <Link to='/reports/new'>
                    <button>+ New Water Report</button>
                </Link>
            </div>
        </main>
    );
};

export default HomePage;

