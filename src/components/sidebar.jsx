import {NavLink, useNavigate} from "react-router-dom";
import styles from './sidebar.module.css';
import {FaHome, FaUser, FaSignOutAlt, FaSearch} from 'react-icons/fa';
import {useEffect, useRef, useState} from 'react';

export default function Sidebar({onLogout}) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1250);
    const [isExpanded, setIsExpanded] = useState(false);
    const [keyWord, setKeyWord] = useState('');
    const [results, setResults] = useState([]);
    const timeoutRef = useRef(null);

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        const value = e.target.value;
        setKeyWord(value);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
            if (!value.trim()) {
                setResults([]);
                return;
            }
            try {
                const response = await fetch(`http://localhost:8080/user/search/${encodeURIComponent(value)}`, {
                    method: 'GET',
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user');
                }

                const data = await response.json();

                setResults(data.result);
                // console.log(data);
            } catch (error) {
                console.error('Error searching user:', error);
                setResults([]);
            }
        }, 1000);
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1250);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        setKeyWord("");
    };

    return (
        (isExpanded ?
                <div className={`${styles.side} ${isExpanded ? styles.expanded : ''}`}>
                    <div>
                        <div className={styles.logo}>
                            <img src="/sidebar/logoin.png"/>
                        </div>
                        <nav className={styles.navlink}>

                            <NavLink to="/" className={styles.nav_item}>
                                <FaHome className={styles.nav_icon}/>
                            </NavLink>

                            <NavLink className={styles.nav_item} onClick={toggleExpand}>
                                <FaSearch className={styles.nav_icon}/>
                            </NavLink>

                            <NavLink to="/profile" className={styles.nav_item}>
                                <FaUser className={styles.nav_icon}/>
                            </NavLink>

                            <NavLink to="/login" onClick={onLogout} className={styles.nav_item}>
                                <FaSignOutAlt className={styles.nav_icon}/>
                            </NavLink>
                        </nav>
                    </div>
                    <div className={styles.expand_area}>
                        <span className={styles.expand_area_text}>Search</span>
                        <div>
                            <input
                                type="text"
                                placeholder="Search"
                                className={styles.search_input}
                                value={keyWord}
                                onChange={handleSearch}
                            />
                        </div>
                        {keyWord === "" ? (
                            <div className={styles.search_recent}>
                                <div className={styles.expand_brr}></div>
                                <p>Recent</p>
                            </div>
                        ) : results.length === 0 ? (
                            <div className={styles.no_result}>No results found</div>
                        ) : (
                            <div className={styles.search_result}>
                                {results.map((user, index) => (
                                    <div key={index}
                                         className={styles.search_result_item}
                                         onClick={() => {
                                             navigate(`/profile/${user.id}`);
                                             setIsExpanded(false);
                                         }}
                                         style={{cursor: 'pointer'}}
                                    >
                                        <img src={user.avatar}/>
                                        <div className={styles.search_result_item_name}>
                                            <p className={styles.search_result_item_name_username}>{user.username}</p>
                                            <p className={styles.search_result_item_name_fullname}>{user.fullName}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div> :
                <div className={`${styles.side} ${isExpanded ? styles.expanded : ''}`}>
                    <div className={styles.logo}>
                        <img src={isMobile || isExpanded ? "/sidebar/logoin.png" : "/sidebar/side.png"}/>
                    </div>
                    <nav className={styles.navlink}>

                        <NavLink to="/" className={styles.nav_item}>
                            <FaHome className={styles.nav_icon}/>
                            {!isExpanded && <span className={styles.nav_text}>Home</span>}
                        </NavLink>

                        <NavLink className={styles.nav_item} onClick={toggleExpand}>
                            <FaSearch className={styles.nav_icon}/>
                            {!isExpanded && <span className={styles.nav_text}>Search</span>}
                        </NavLink>

                        <NavLink to="/profile" className={styles.nav_item}>
                            <FaUser className={styles.nav_icon}/>
                            {!isExpanded && <span className={styles.nav_text}>Profile</span>}
                        </NavLink>

                        <NavLink to="/login" onClick={onLogout} className={styles.nav_item}>
                            <FaSignOutAlt className={styles.nav_icon}/>
                            {!isExpanded && <span className={styles.nav_text}>Log out</span>}
                        </NavLink>

                    </nav>
                </div>
        )
    );
}