import { FunctionComponent } from "react";

interface AboutProps {}

const About: FunctionComponent<AboutProps> = () => {
    return (
        <>
            <div className="w-full">
                <h2 className="mt-7 text-center text-6xl billabong">Microgram</h2>
                <div className="mt-20 flex justify-center mx-20">
                    <div className="about-center">
                        <p className="m-0">My name is Maor Fleiman and this is my replication of Instagram.</p>
                        <p className="mt-5">Hope you enjoy it!</p>
                    </div>
                </div>
                <div className="mt-48 flex justify-center">
                    <div className="flex flex-col">
                        <p>Made by Maor Fleiman © 2024</p>
                        <p className="text-center">maorfl14@gmail.com</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;
