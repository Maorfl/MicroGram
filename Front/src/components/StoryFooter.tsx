import { faHeart, faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FunctionComponent } from "react";

interface StoryFooterProps {

}

const StoryFooter: FunctionComponent<StoryFooterProps> = () => {
    return (
        <>
            <div className="flex text-white h-16 pb-2">
                <div className="flex-1 flex flex-col place-content-center rounded-full border border-gray-500">
                    <input type="text" placeholder="Send message" className="placeholder-white focus:outline-none bg-transparent ps-2" />
                </div>
                <div className="flex-initial text-3xl px-3 place-content-center">
                    <FontAwesomeIcon className="me-3" icon={faHeart} />
                    <FontAwesomeIcon icon={faPaperPlane} />
                </div>
            </div>
        </>
    );
}

export default StoryFooter;