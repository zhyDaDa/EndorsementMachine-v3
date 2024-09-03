import { HeartOutlined, SmileOutlined } from '@ant-design/icons';
import { PageContainer, ProLayout } from '@ant-design/pro-components';

const IconMap = {
  smile: <SmileOutlined />,
  heart: <HeartOutlined />,
};

const defaultMenus = [
  {
    path: '/',
    name: 'welcome',
    icon: 'smile',
    routes: [],
  },
  {
    path: '/core',
    name: 'core',
    icon: 'heart',
  },
];

const loopMenuItem = (menus) =>
  menus?.map(({ icon, routes, ...item }) => ({
    ...item,
    icon: icon && IconMap[icon],
    children: routes && loopMenuItem(routes),
  }));

export default ({children}) => (
  <ProLayout
    style={{
      minHeight: 500,
    }}
    fixSiderbar
    location={{
      pathname: '/',
    }}
    menu={{ request: async () => loopMenuItem(defaultMenus) }}
    pageTitleRender={false}
  >
    <PageContainer content={children}>
    </PageContainer>
  </ProLayout>
);