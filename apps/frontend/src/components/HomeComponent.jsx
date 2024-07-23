import InitialPage from './InitialPage';
import AdminDashboard from './AdminDashboard';
import { useSelector } from 'react-redux';
import LogOut from './LogOut';

const HomeComponent = () => {
  const jwtToken = useSelector((state) => state.loginReducer.jwtSession);
  const canEdit = useSelector((state) => state.loginReducer.canEdit);
  const canWrite = useSelector((state) => state.loginReducer.canWrite);
  const userRole = useSelector((state) => state.loginReducer.userRole);
  console.log('The jwtToken ', jwtToken, canEdit, canWrite, userRole);
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
          <AdminDashboard permissions ={[canEdit, canWrite]}/>
          <LogOut />
        </>
        
      )
    }

    if (userRole === 'user') {
      return (
        <>
          <LogOut />
        </>
      )
    }

    return (
      <h1>Welcome to the Home Page. No user role detected</h1>
    )
}

export default HomeComponent;