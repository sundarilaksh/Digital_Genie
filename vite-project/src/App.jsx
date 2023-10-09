import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AddProduct from './components/adminpage'
import UserPage from './components/UserPage'

function App() {
  const [role, setRole] = useState('user'); // 'user' is the default role

  // Function to switch between admin and user roles
  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };

  return (
    <>
      <div className="role-selector">
        <button onClick={() => handleRoleChange('admin')}>Admin</button>
        <button onClick={() => handleRoleChange('user')}>User</button>
      </div>

      {role === 'admin' ? (
        <AddProduct />
      ) : (
        <UserPage />
      )}
    </>
  );
}

export default App;
