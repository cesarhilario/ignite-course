import { AppRoutesScreenList } from './types';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppRoutesScreenList {}
  }
}
