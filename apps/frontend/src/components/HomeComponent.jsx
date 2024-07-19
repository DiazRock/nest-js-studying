import InitialPage from './InitialPage';
import { sessionIsActive } from '../services/apiService';
import AdminDashboard from './AdminDashboard';
import LogOut from './LogOut';

const HomeComponent = () => {
    if (!sessionIsActive()) {
      return (
        <>
          <InitialPage/>
        </>
      )
    }
    const user_role = localStorage.getItem('user_role')
    console.log('The user role is ', user_role);
    if (user_role === "admin") {
      console.log('The user is an admin');
      const permissions = localStorage.getItem('permissions').split(',');
      console.log('The permissions are ', permissions);
      return (
        <>
          <AdminDashboard permissions ={permissions}/>
          <LogOut />
        </>
        
      )
    }

    if (user_role == 'user') {
      return (
        <>
          <LogOut />
        </>
      )
      
    }
}

export default HomeComponent;