import { useEffect, useState } from "react";
import { ConfigProvider } from 'antd';
import deDe from 'antd/lib/locale/de_DE';
import enUS from 'antd/lib/locale/en_US';
import GlobalStyle from './styles/GlobalStyle';
import 'typeface-montserrat';
import 'typeface-lato';
import { useLanguage } from './hooks/useLanguage';
import { useAutoNightMode } from './hooks/useAutoNightMode';
import { usePWA } from './hooks/usePWA';
import { useThemeWatcher } from './hooks/useThemeWatcher';
import { useAppSelector } from './store';
import { themeObject } from './styles/themes/themeVariables';
import Routes from "./routes";
import { useAppDispatch } from "./store";
import { actionAutoLogin } from "./store/authentication/action";

function App() {
  const [checkPersistantLogin, setCheckPersistantLogin] = useState(false);
  
  const { language } = useLanguage();
  const theme = useAppSelector((state) => state.theme.theme);
  
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if (!checkPersistantLogin) {
      dispatch(actionAutoLogin());
      setCheckPersistantLogin(true);
    }
  }, [checkPersistantLogin, dispatch]);

  
  usePWA();
  useAutoNightMode();
  useThemeWatcher();
   
  return  checkPersistantLogin ?
      (<>
        <meta name="theme-color" content={themeObject[theme].primary} />
        <GlobalStyle />
        <ConfigProvider locale={language === 'en' ? enUS : deDe}>
          <Routes /> 
        </ConfigProvider>
      </>)
      : null
}

export default App;
