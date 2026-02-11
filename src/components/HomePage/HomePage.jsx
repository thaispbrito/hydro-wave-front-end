import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";

const HomePage = () => {

    const { user } = useContext(UserContext);

    return (
        <main>
            <h1>Welcome to HydroWave, {user.username}!</h1>
            <Link to='/reports/new'>New Water Report</Link>
        </main>
    );
};

export default HomePage;

