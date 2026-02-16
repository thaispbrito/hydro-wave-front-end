import SignInForm from '../SignInForm/SignInForm';
import logo from '../../assets/blue_logo.png';
import styles from './LandingPage.module.css';

const LandingPage = () => {
    return (
        <main className={styles.container}>
            <div className="brandWrapper">
                <img src={logo} alt="HydroWave logo" className="brandLogo"/>
                <h1 className="brandTitle">HydroWave</h1>
            </div>
            <p className={styles.subtitle}>
                Empowering communities to report water observations and take action with real-time environmental insights.
            </p>

            <div className={styles.formCard}>
                <SignInForm />
            </div>
        </main>
    );
};

export default LandingPage;

