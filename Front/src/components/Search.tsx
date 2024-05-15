import { FunctionComponent, useEffect, useState } from "react";
import Explore from "./Explore";
import { faArrowLeftLong, faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import User from "../interfaces/User";
import { useSelector } from "react-redux";
import { userService } from "../services/userService";
import SearchedUsers from "./SearchedUsers";

interface SearchProps {}

const Search: FunctionComponent<SearchProps> = () => {
    const postsModal = useSelector((state: any) => state.modalState.postsModal);
    const [search, setSearch] = useState<string>("");
    const [allUsers, setAllUsers] = useState<User[]>([]);

    useEffect(() => {
        (async () => {
            const users = await userService.getUsers("");
            setAllUsers(users);
        })();
    }, []);

    return (
        <>
            {!postsModal && (
                <div className="w-full px-3 py-1 flex gap-2 h-11">
                    <div
                        className={`place-content-center pe-2 ${!search.length ? "hidden" : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setSearch("");
                        }}>
                        <FontAwesomeIcon className="text-2xl" icon={faArrowLeftLong} />
                    </div>
                    <div className="flex items-center px-3 bg-[#EFEFEF] w-full rounded-lg">
                        <span className={`${search.length ? "text-[#d1d1d1]" : ""} flex`}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-lg" />
                        </span>
                        <input
                            className="bg-[#EFEFEF] h-9 ms-3 w-full text-lg"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            type="search"
                            placeholder="Search for users..."
                        />
                        <button className={`${search === "" ? "hidden" : ""}`} onClick={() => setSearch("")}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                </div>
            )}

            {!search.length ? <Explore postsModal={postsModal} /> : <SearchedUsers users={allUsers} search={search} />}
        </>
    );
};

export default Search;
