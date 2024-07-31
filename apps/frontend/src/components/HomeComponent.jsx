import InitialPage from './InitialPage';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import { useSelector } from 'react-redux';
import LogOut from './LogOut';

const HomeComponent = () => {
  const jwtToken = useSelector((state) => state.loginReducer.jwtSession);
  const canRead = useSelector((state) => state.loginReducer.canRead);
  const canWrite = useSelector((state) => state.loginReducer.canWrite);
  const userRole = useSelector((state) => state.loginReducer.userRole);
  console.log('The decoded info ', jwtToken, canRead, canWrite, userRole);
    if (jwtToken === '') {
      return (
        <>
          <InitialPage/>
        </>
      )
    }
    console.log('The user role is ', userRole);
    if (userRole === "admin") {
      console.log('The user is an admin');
      return (
        <>
          <AdminDashboard permissions ={[canRead, canWrite]}/>
          <LogOut />
        </>
        
      )
    }

    if (userRole === 'user') {
      return (
        <>
          <UserDashboard />
          <LogOut />
        </>
      )
    }

    return (
      <h1>Welcome to the Home Page. No user role detected</h1>
    )
}

export default HomeComponent;