import styles from './edit_profile.module.css';
import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import {legacyApiUrl} from "../../../services/legacyApiUrl";

function Edit_Profile() {
    const [userName, setUserName] = useState('');
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [connectLink, setConnectLink] = useState('');
    const [gender, setGender] = useState('');
    const [url, setUrl] = useState("");

    const token = localStorage.getItem("token");

    const getIdByToken = async () => {
        const decoded = jwtDecode(token);
        return decoded.id;
    }

    const fetchUserByToken = async () => {
        setUserName('');
        setFullName('');
        setBio('');
        setConnectLink('');
        setGender('');
        setUrl('');

        if (!token) {
            console.error("Token not found!");
            return;
        }

        let idFromToken = await getIdByToken();

        if (!idFromToken) {
            console.error("Id not found in token!");
            return null;
        }

        try {
            const response = await fetch(legacyApiUrl(`/user/id/${idFromToken}`), {
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + token
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user info');
            }
            const userData = await response.json();

            setUserName(userData.result.username || '');
            setFullName(userData.result.fullName || '');
            setBio(userData.result.bio || '');
            setConnectLink(userData.result.connectLink || '');
            setGender(userData.result.gender || '');
            setUrl(userData.result.avatar || '');

            return userData;
        } catch (error) {
            console.error('Error fetching user info:', error);
            return null;
        }
    }

    const updateInformation = async () => {
        // e.preventDefault();

        if (!token) {
            console.error("Token not found!");
            return;
        }

        const idFromToken = await getIdByToken();

        try {
            const response = await fetch(legacyApiUrl('/user'), {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({id: idFromToken, bio, connectLink, gender})
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user info');
            }
            const userData = await response.json();

            setBio(userData.bio || bio);
            setConnectLink(userData.connectLink || connectLink);
            setGender(userData.gender || gender);


            return userData;
        } catch (error) {
            console.error('Error fetching user info:', error);
            return null;
        }

    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        if (!file || file.length === 0) {
            console.log("Loi");
            return;
        }
        const id = await getIdByToken();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("id", id);

        try {
            const res = await axios.post(legacyApiUrl('/user/upload_avatar'), formData, {
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "multipart/form-data"
                },
            });

            setUrl(res.data.url || res.data);
        } catch (error) {
            console.log("Upload fail: ", error)
        }

    };


    useEffect(() => {
        fetchUserByToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.edit_profile_body}>
            <form onSubmit={updateInformation}>
                <div className={styles.content}>
                    <p className={styles.nav}>Edit profile</p>
                    <div className={styles.infor}>
                        <div className={styles.infor_left}>
                            <img src={url || "/profile/edit_profile/avt.png"} alt="avatar"/>
                            <div>
                                <p className={styles.name}>{userName}</p>
                                <p className={styles.fullname}>{fullName}</p>
                            </div>
                        </div>
                        <div className={styles.infor_right}>
                            <label style={{display: 'inline-block', position: 'relative', overflow: 'hidden'}}>
                                <button type="button">Chọn ảnh</button>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        opacity: 0,
                                        width: '100%',
                                        height: '100%',
                                        cursor: 'pointer'
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                    <div className={styles.bio}>
                        <p>Bio</p>
                        <input type="text"
                               placeholder="Bio"
                               value={bio}
                               onChange={(e) => setBio(e.target.value)}
                        />
                    </div>
                    <div className={styles.connect_link}>
                        <p>Connect Link</p>
                        <input type="text"
                               placeholder="Link"
                               value={connectLink}
                               onChange={(e) => setConnectLink(e.target.value)}
                        />
                    </div>
                    <div className={styles.gender}>
                        <p className={styles.gender_header}>Gender</p>
                        <select className={styles.gender_select}
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}>
                            <option value="MALE">MALE</option>
                            <option value="FEMALE">FEMALE</option>
                            <option value="OTHER">OTHER</option>
                        </select>
                        <p className={styles.des}>This won't be part of your public profile</p>
                    </div>
                    <div className={styles.submit}>
                        <button type="submit">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Edit_Profile;

