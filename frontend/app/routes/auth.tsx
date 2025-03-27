import { Outlet} from "react-router-dom";
import Login from "~/auth/login";


function Auth() {
    return (
        <div>
            <header>
                <title>Authenticate</title>
            </header>
            <nav>
                <Login/>
            </nav>
            <Outlet />
        </div>
    );
}

export default Auth;