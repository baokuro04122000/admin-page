import React from 'react';
import * as S from './References.styles';
import { FacebookOutlined, GithubOutlined, LinkedinOutlined, TwitterOutlined } from '@ant-design/icons';

const GithubIcon = S.withStyles(GithubOutlined);
const TwitterIcon = S.withStyles(TwitterOutlined);
const FacebookIcon = S.withStyles(FacebookOutlined);
const LinkedinIcon = S.withStyles(LinkedinOutlined);

export const References: React.FC = () => {
  return (
    <S.ReferencesWrapper>
      <S.Text>
        Made by{' '}
          Bao Tran{' '}
        in 2022 &copy;. Based on{' '}
        <a href="https://ant.design/" target="_blank" rel="noreferrer">
          Ant-design.
        </a>
      </S.Text>
      <S.Icons>
        <a href="#" target="_blank" rel="noreferrer">
          <GithubIcon />
        </a>
        <a href="#" target="_blank" rel="noreferrer">
          <FacebookIcon />
        </a>
      </S.Icons>
    </S.ReferencesWrapper>
  );
};
