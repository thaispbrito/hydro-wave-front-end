import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { signIn } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';
import { Link } from 'react-router';
import styles from './SignInForm.module.css';

const SignInForm = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (evt) => {
        setMessage('');
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        try {
            const signedInUser = await signIn(formData);
            setUser(signedInUser);
            navigate('/');
        } catch (err) {
            setMessage(err.message);
        }
    };

    return (
        <>
            <h1 className={styles.title}>Sign In</h1>
            {message && <p className={styles.errorMessage}>{message}</p>}
            <form autoComplete='off' onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='username'>Username:</label>
                    <input
                        type='text'
                        autoComplete='off'
                        id='username'
                        value={formData.username}
                        name='username'
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password:</label>
                    <input
                        type='password'
                        autoComplete='off'
                        id='password'
                        value={formData.password}
                        name='password'
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <button className={styles.submitButton} type='submit'>Sign In</button>
                </div>
            </form>
            <p className={styles.signupLink}>
                Don't have an account yet? <Link to='/sign-up'>Sign up here</Link>
            </p>
        </>
    );
};

export default SignInForm;

