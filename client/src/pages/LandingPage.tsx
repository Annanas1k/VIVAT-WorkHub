import { GoogleLogin } from "@react-oauth/google";
import { DataPage } from './Data';
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

export const LandingPage = () => {
  const { user, login, isLoading } = useAuth();    

  if (isLoading) return <p>loading...</p>;

  return (
    <>
      {!user ? (
        <GoogleLogin 
          onSuccess={async (credentialResponse) => {
            const tokenFromGoogle = credentialResponse.credential;
            console.log(tokenFromGoogle)

            try {
              const response = await axios.post('http://localhost:3000/api/auth/google', { 
                idToken: tokenFromGoogle 
              });
              const dataFromServer = response.data;
              
              login(dataFromServer.user);
              localStorage.setItem('app_token', dataFromServer.token);

            } catch (error) {
              console.error('error: ', error);
            }
          }}
          onError={() => console.log('login error')}
        />
      ) : (
        <DataPage />
      )}
    </>
  );
};