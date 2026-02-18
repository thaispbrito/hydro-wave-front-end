import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { signUp } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';
import { Link } from 'react-router';
import logo from '../../assets/blue_logo.png';
import styles from './SignUpForm.module.css';

const SignUpForm = () => {

    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        passwordConf: '',
    });

    const { username, password, passwordConf } = formData;

    const handleChange = (evt) => {
        setMessage('');
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        try {
            const newUser = await signUp(formData);
            setUser(newUser);
            navigate('/');
        } catch (err) {
            setMessage(err.message);
        }
    };

    const isFormInvalid = () => {
        return !(username && password && password === passwordConf);
    };

return (
        <main className={styles.container}>
            <div className="brandWrapper">
                <img src={logo} alt="HydroWave logo" className="brandLogo" />
                <h1 className="brandTitle">HydroWave</h1>
            </div>
            
            <div className={styles.formCard}>
                <h1 className={styles.title}>Sign Up</h1>
                {message && <p className={styles.errorMessage}>{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='username'>Username:</label>
                        <input
                            type='text'
                            id='username'
                            value={username}
                            name='username'
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor='password'>Password:</label>
                        <input
                            type='password'
                            id='password'
                            value={password}
                            name='password'
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor='confirm'>Confirm Password:</label>
                        <input
                            type='password'
                            id='confirm'
                            value={passwordConf}
                            name='passwordConf'
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={isFormInvalid()}>Sign Up</button>

                </form>
                <p className={styles.signinLink}>
                    Already have an account? <Link to='/'>Sign in here</Link>
                </p>
            </div>
        </main>
    );
};

export default SignUpForm;
