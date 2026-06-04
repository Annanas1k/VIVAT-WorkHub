import { useTranslation } from 'react-i18next';

export const ProfileHeader = () => {
  const { t } = useTranslation();
  return (
    <div className="mb-6">
      <h1 className="text-xl font-bold text-gray-900">{t('profile.title')}</h1>
      <p className="text-sm text-gray-400 mt-0.5">{t('profile.subtitle')}</p>
    </div>
  );
};