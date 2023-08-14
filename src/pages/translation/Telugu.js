import React from 'react';
import { useTranslation } from 'react-i18next';

const Telugu = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('greeting')}</h1>
      <p>{t('message')}</p>
    </div>
  );
}

export default Telugu;
