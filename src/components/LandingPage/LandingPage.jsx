import { Link } from 'react-router';
import SignInForm from '../SignInForm/SignInForm';

const LandingPage = () => {
    return (
        <main>
            <h1>HydroWave</h1>
            <p>Empowering communities to report water observations and take action with real-time environmental insights.</p>

        <SignInForm />
            <p>Don't have an account yet? <Link to='/sign-up'>Sign up here</Link></p>
        </main>


    );
};

export default LandingPage;

