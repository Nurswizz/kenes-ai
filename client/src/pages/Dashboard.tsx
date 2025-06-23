import Sidebar from "../components/Sidebar";

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col w-full px-40 py-20">
                <h1 className="text-5xl text-primary font-semibold"> <i>Hello, {user.firstName}!</i></h1>
            </div>
        </div>
    )
}

export default Dashboard;