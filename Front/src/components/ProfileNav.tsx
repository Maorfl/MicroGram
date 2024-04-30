import { faAddressCard, faClapperboard, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FunctionComponent, useState } from "react";
import Post from "../interfaces/Post";
import ReelsGrid from "./ReelsGrid";
import { Nav } from "react-bootstrap";
import PostsGrid from "./PostsGrid";
import User from "../interfaces/User";

interface ProfileNavProps {
    userPosts: Post[];
    allPosts: Post[];
    selectedUser: User;
    postsRef: any;
}

const ProfileNav: FunctionComponent<ProfileNavProps> = ({ userPosts, allPosts, selectedUser, postsRef }) => {
    const taggedPosts = allPosts.filter((post) => post.tags.includes(selectedUser._id));
    const [selectedBar, setSelectedBar] = useState<string>("posts");

    const handleSelect = (type: string) => {
        if (type === "posts") setSelectedBar("posts");
        else if (type === "reels") setSelectedBar("reels");
        else setSelectedBar("tagged");
    };

    return (
        <>
            <Nav variant="underline" defaultActiveKey="1" className="justify-around">
                <Nav.Item onClick={() => handleSelect("posts")}>
                    <Nav.Link eventKey="1">
                        <FontAwesomeIcon icon={faTableCells} />
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item onClick={() => handleSelect("reels")}>
                    <Nav.Link eventKey="2">
                        <FontAwesomeIcon icon={faClapperboard} />
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item onClick={() => handleSelect("tagged")}>
                    <Nav.Link eventKey="3">
                        <FontAwesomeIcon icon={faAddressCard} />
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {selectedBar === "posts" ? (
                <div ref={postsRef}>
                    <PostsGrid posts={userPosts} header="posts" />
                </div>
            ) : selectedBar === "reels" ? (
                <ReelsGrid />
            ) : (
                <PostsGrid posts={taggedPosts} header="tagged" />
            )}
        </>
    );
};

export default ProfileNav;
