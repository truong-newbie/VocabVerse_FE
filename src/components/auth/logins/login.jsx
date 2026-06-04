import React, {useState} from "react";
import styles from './login.module.css'
import {useNavigate} from 'react-router-dom';

function Login({onLogin}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password}),
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(err);
            }

            // Parse the JSON response once
            const data = await response.json();
            console.log('Login success:', data);

            // Save the token to localStorage
            if (data.result.token) {
                localStorage.setItem("token", data.result.token);
                onLogin();
                navigate('/');
            } else {
                console.log("Token is missing in the response!")
            }
        } catch (error) {
            console.error('Login error:', error.message);
        }
    };

    return (
        <div className={styles.login_body}>
            <form onSubmit={handleSignIn}>
                <div className={styles.content}>
                    <img src="/login/logo_ins.png" alt="" className={styles.logo}/>
                    <div>
                        <input type="text" placeholder="Phone numbber, username, or email"
                               className={styles.username}
                               value={username}
                               onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <input type="password" placeholder="Password" className={styles.password}
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <button type="submit" className={styles.btn_login}>Log in</button>
                    </div>
                    <p className={styles.or}>---------------------- OR ----------------------</p>
                    <div className={styles.outh2F}>
                        <img src="/login/fb.png" alt=""/>
                        <div>
                            <a href="#">Log in with Facebook</a>
                        </div>
                    </div>
                    <p className={styles.forgot_password}><a href="#">Forgot password?</a></p>
                </div>

                <div className={styles.signup}>
                    <p>Don't have an account? </p>
                    <div>
                        <a href="/register">Sign up</a>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Login;
