import { useParams } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { OwnProfilePage } from './Ownprofilepage';
import { ViewProfilePage } from './Viewprofilepage';

/**
 * ProfilePage — doar decide CE să randeze.
 * Nu are stări, nu face fetch, nu are logică de business.
 */
export const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const isOwnProfile = String(user?.id) === String(id);

  if (isOwnProfile) {
    return <OwnProfilePage />;
  }

  return <ViewProfilePage id={id!} />;
};