import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import styles from "./profile.module.css"
import {jwtDecode} from 'jwt-decode';


function Profile() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [userName, setUserName] = useState('');
    const [bio, setBio] = useState('');
    const [connectLink, setConnectLink] = useState('');
    const [fullName, setFullName] = useState('');
    const [, setGender] = useState('');
    const [follower, setFollower] = useState(0);
    const [following, setFollowing] = useState(0);
    const [post, setPost] = useState(0);
    const [url, setUrl] = useState("");

    const [isYourProfile, setIsYourProfile] = useState(true);
    const [targetId, setTargetId] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [followList, setFollowList] = useState([]);
    const [modalTitle, setModalTitle] = useState('');

    const {idFromAnother} = useParams();

    const moveToEditProfile = async () => {
        navigate('/edit_profile')
    }

    const getIdByToken = async () => {
        const decoded = jwtDecode(token);
        return decoded.id;
    }

    const fetchUserById = async () => {
        setUserName('');
        setFullName('');
        setBio('');
        setConnectLink('');
        setGender('');
        setUrl('');
        setFollower(0);
        setFollowing(0);
        setPost(0);
        setIsYourProfile(true);

        if (!token) {
            console.error("Token not found!");
            return;
        }

        let idFromToken = await getIdByToken();

        if (!idFromToken) {
            console.error("Id not found in token!");
            return null;
        }

        if (idFromAnother) {
            idFromToken = idFromAnother;
            setIsYourProfile(false);
        }

        try {
            const response = await fetch(`http://localhost:8080/user/id/${idFromToken}`, {
                method: 'GET', headers: {
                    "Authorization": `Bearer ${token}`, "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user info');
            }
            const {result} = await response.json();

            setUserName(result.username || '');
            setFullName(result.fullName || '');
            setBio(result.bio || '');
            setConnectLink(result.connectLink || '');
            setGender(result.gender || '');
            setUrl(result.avatar || '');
            setFollower(result.follower || 0);
            setFollowing(result.following || 0);
            setPost(result.post || 0);

            return result;
        } catch (error) {
            console.error('Error fetching user info:', error);
            return null;
        }
    }

    const handleFollow = async () => {
        const idFromToken = await getIdByToken();

        try {
            const response = await fetch(`http://localhost:8080/user/follow`, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json', "Authorization": "Bearer " + token
                }, body: JSON.stringify({
                    myId: idFromToken, targetId: targetId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to follow');
            }
            const data = await response.json();
            setIsFollowing(true);
            setFollower(prev => prev + 1)
            return data;
        } catch (error) {
            console.error('Error fetching user info:', error);
            return null;
        }
    }

    const handleUnFollow = async () => {
        const idFromToken = await getIdByToken();

        try {
            const response = await fetch(`http://localhost:8080/user/unfollow`, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json', "Authorization": "Bearer " + token
                }, body: JSON.stringify({
                    myId: idFromToken, targetId: targetId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to follow');
            }
            const data = await response.json();
            setIsFollowing(false);
            setFollower(prev => prev - 1)
            return data;
        } catch (error) {
            console.error('Error fetching user info:', error);
            return null;
        }
    }

    const checkFollowing = async () => {
        const idFromToken = await getIdByToken();

        try {
            const response = await fetch(`http://localhost:8080/user/follow/check-follow?myId=${idFromToken}&targetId=${targetId}`, {
                method: 'GET', headers: {
                    "Authorization": "Bearer " + token
                }
            });

            if (!response.ok) {
                throw new Error('Failed to check follow');
            }
            const isFollowing = await response.json();
            setIsFollowing(isFollowing.result);
        } catch (error) {
            console.error('Error fetching user info:', error);
            return null;
        }
    }

    const openFollowList = async (isFollower) => {
        const id = await getIdByToken();
        const userId = idFromAnother || id;

        try {
            const response = await fetch(`http://localhost:8080/user/follow/show-follow?id=${userId}&isFollower=${isFollower}`, {
                method: 'GET', headers: {
                    "Authorization": "Bearer " + token
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch follow list');
            }

            const list = await response.json();
            setFollowList(list.result);
            setModalTitle(isFollower ? "Followers" : "Followings");
            setShowModal(true);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (idFromAnother) {
            setTargetId(idFromAnother);
            setIsYourProfile(false);
            setIsFollowing(false);
        } else {
            setIsYourProfile(true);
        }
        fetchUserById();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idFromAnother]);

    useEffect(() => {
        if (!isYourProfile && targetId) {
            checkFollowing();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetId]);


    return (<div className={styles.profile_body}>
        <div className={styles.header}>
            <div className={styles.header_content}>
                <div className={styles.avata}><img src={url || "/profile/logo.png"} alt=""/></div>
                <div className={styles.information}>
                    <div className={styles.name_profile_edit}>
                        <p> {userName} </p>
                        {isYourProfile ?
                            <button
                                className={styles.edit}
                                onClick={moveToEditProfile}
                                style={{cursor: 'pointer'}}> Edit profile </button>
                            : (isFollowing) ?
                                <button
                                    className={styles.edit}
                                    onClick={handleUnFollow}
                                    style={{cursor: 'pointer'}}> Unfollow </button>
                                : <button
                                    className={styles.follow_btn}
                                    onClick={handleFollow}
                                    style={{cursor: 'pointer'}}> Follow </button>}
                        <img src="/profile/setting.png" alt=""/>
                    </div>
                    <div className={styles.follow}>
                        <p className={styles.post}>
                            <strong style={{fontSize: '1.1rem'}}>{post}</strong> posts
                        </p>
                        <p className={styles.followers}
                           onClick={() => openFollowList(true)}
                           style={{cursor: 'pointer'}}>
                            <strong style={{fontSize: '1.1rem'}}>{follower}</strong> followers
                        </p>
                        <p className={styles.following}
                           onClick={() => openFollowList(false)}
                           style={{cursor: 'pointer'}}>
                            <strong style={{fontSize: '1.1rem'}}>{following}</strong> followings
                        </p>
                    </div>
                    <p className={styles.profile_name}>{fullName}</p>
                    <p className={styles.description}>{bio}</p>
                    <p className={styles.link_connect}><a href={connectLink} target="_blank"
                                                          rel="noopener noreferrer">{connectLink}</a></p>
                </div>
            </div>
        </div>
        <div className={styles.story_mark}></div>
        <div className={styles.type_post}></div>
        <div className={styles.post}></div>

        {showModal && (<div className={styles.modal_overlay}>
            <div className={styles.modal_content}>
                <h3>{modalTitle}</h3>
                <hr/>
                <button onClick={() => setShowModal(false)}>Close</button>
                <ul className={styles.list_user}>
                    {followList.map((user, index) => (<li key={index}>
                        <img src={user.avatar || "/profile/logo.png"} alt="" width={30} height={30}/>
                        <div className={styles.follow_name}>
                            <p className={styles.username}>{user.username}</p>
                            <p className={styles.fullname}>{user.fullName}</p>
                        </div>
                    </li>))}
                </ul>
            </div>
        </div>)}
    </div>);
}

export default Profile;
