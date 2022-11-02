import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar } from 'antd';

import * as S from './ProductInfo.styles';

interface ProfileInfoProps {
  productData: any | null;
}

export const ProductInfo: React.FC<ProfileInfoProps> = ({ productData }) => {
  const [fullness] = useState(90);

  const { t } = useTranslation();

  return productData ? (
    <S.Wrapper>
      <S.ImgWrapper>
        <Avatar shape="circle" src={productData?.imgUrl} alt="Profile" />
      </S.ImgWrapper>
      <S.Title>{`${productData?.firstName} ${productData?.lastName}`}</S.Title>
      <S.Subtitle>{productData?.userName}</S.Subtitle>
      <S.FullnessWrapper>
        <S.FullnessLine width={fullness}>{fullness}%</S.FullnessLine>
      </S.FullnessWrapper>
      <S.Text>{t('profile.fullness')}</S.Text>
    </S.Wrapper>
  ) : null;
};
