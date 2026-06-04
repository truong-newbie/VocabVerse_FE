import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from "./home.module.css"
import { FaHeart, FaRegHeart, FaRegComment, FaRegBookmark } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi'; // Share
import {legacyApiUrl} from "../../services/legacyApiUrl";


function Home() {
    const navigate = useNavigate();


    const handleSignIn = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }

        try {
            const response = await fetch(legacyApiUrl('/user'), {
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + token
                }
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(err);
            }

            const data = await response.json();
            console.log("✅ Authenticated user:", data);
        } catch (error) {
            console.error('Login error:', error.message);
        }
    };


    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate('/')
        } else navigate('/login');
        handleSignIn();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.home_body}>
            <div className={styles.home_content}>
                <div className={styles.home_item}>
                    <hr/>
                    <div className={styles.user_of_item}>
                        <img src="/profile/logo.png"></img>
                        <div className={styles.username_type_post}>
                            <div className={styles.username_created_follow}>
                                <p className={styles.username}>khuong123</p>
                                <p className={styles.created_at}>•</p>
                                <p className={styles.created_at}>2w</p>
                                <p className={styles.created_at}>•</p>
                                <p className={styles.follow}>Follow</p>
                            </div>
                            <p className={styles.type_post}>Original audio</p>
                        </div>
                    </div>
                    <div className={styles.main_post_content}>
                        <img src="/profile/logo.png"/>
                    </div>
                    <div className={styles.post_reaction}>
                        <div className={styles.icon_left}>
                            <FaRegHeart className={styles.reaction_icon}/>
                            <FaRegComment className={styles.reaction_icon}/>
                            <FiSend className={styles.reaction_icon}/>
                        </div>
                        <FaRegBookmark className={styles.reaction_icon}/>
                    </div>
                    <div className={styles.info_post_reaction}>
                        <p>Like by khuong123 and others</p>
                    </div>
                    <div className={styles.information_post}>
                        <div className={styles.username_description}>
                            <p><strong style={{ cursor: 'pointer' }}>khuong123 </strong> Prosthetic devices have transformed lives by restoring function, mobility, and confidence to individuals with limb loss. With advancements in technology and design, modern prosthetics are now more realistic, comfortable, and functional than ever before. From bionic limbs to aesthetic prosthetics, these devices are customized to enhance both appearance and daily life activities.</p>
                        </div>
                        <div className={styles.hashtag}>#123124</div>
                    </div>
                    <div className={styles.view_comment}>
                        <p>View all 1000 comments</p>
                    </div>
                    <div className={styles.add_comment}>
                        <input
                            type="text"
                            placeholder="Add a comment"
                        />
                    </div>
                </div>
                <div className={styles.home_item}>
                    <hr/>
                    <div className={styles.user_of_item}>
                        <img src="/profile/logo.png"></img>
                        <div className={styles.username_type_post}>
                            <div className={styles.username_created_follow}>
                                <p className={styles.username}>khuong123</p>
                                <p className={styles.created_at}>•</p>
                                <p className={styles.created_at}>2w</p>
                                <p className={styles.created_at}>•</p>
                                <p className={styles.follow}>Follow</p>
                            </div>
                            <p className={styles.type_post}>Original audio</p>
                        </div>
                    </div>
                    <div className={styles.main_post_content}>
                        <img src="/profile/logo.png"/>
                    </div>
                    <div className={styles.post_reaction}>
                        <div className={styles.icon_left}>
                            <FaRegHeart className={styles.reaction_icon}/>
                            <FaRegComment className={styles.reaction_icon}/>
                            <FiSend className={styles.reaction_icon}/>
                        </div>
                        <FaRegBookmark className={styles.reaction_icon}/>
                    </div>
                    <div className={styles.info_post_reaction}>
                        <p>Like by khuong123 and others</p>
                    </div>
                    <div className={styles.information_post}>
                        <div className={styles.username_description}>
                            <p><strong style={{ cursor: 'pointer' }}>khuong123 </strong> Prosthetic devices have transformed lives by restoring function, mobility, and confidence to individuals with limb loss. With advancements in technology and design, modern prosthetics are now more realistic, comfortable, and functional than ever before. From bionic limbs to aesthetic prosthetics, these devices are customized to enhance both appearance and daily life activities.</p>
                        </div>
                        <div className={styles.hashtag}>#123124</div>
                    </div>
                    <div className={styles.view_comment}>
                        <p>View all 1000 comments</p>
                    </div>
                    <div className={styles.add_comment}>
                        <input
                            type="text"
                            placeholder="Add a comment"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
