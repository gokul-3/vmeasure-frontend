import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

export default function ReadMore({ children, size = 50 }) {
  const text = children || '';
  const [isReadMore, setIsReadMore] = React.useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const { t } = useTranslation();

  const LinkSpan = styled('span')(({ theme }) => ({
    color: 'blue',
    cursor: 'pointer'
  }));

  return (
    <>
      {isReadMore ? <span style={{ lineBreak: 'anywhere' }}>{text?.slice(0, size)}</span> : <div style={{ lineBreak: 'anywhere' }}>{text}</div>}
      {
        text.length > size && isReadMore &&
        <span>
          ...
        </span>
      }
      {
        text.length > size &&
        <div style={{ cursor: 'pointer' }}>
          {
            isReadMore &&
            <LinkSpan onClick={toggleReadMore}>{t('common.message.read_more')}</LinkSpan>
          }
          {
            !isReadMore &&
            <LinkSpan onClick={toggleReadMore}>{t('common.message.show_less')}</LinkSpan>
          }
        </div>
      }
    </>
  );
};