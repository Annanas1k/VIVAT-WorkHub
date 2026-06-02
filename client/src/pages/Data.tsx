import { useAuth } from "../hooks/useAuth";

export const DataPage = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <img 
          src={user.avatar} 
          alt="user avatar" 
          referrerPolicy="no-referrer" 
          style={{ width: '50px', height: '50px', borderRadius: '50%' }} 
        />
        <p><strong>Nume:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
      <button onClick={logout}>Logout</button>
    </>
  );
};