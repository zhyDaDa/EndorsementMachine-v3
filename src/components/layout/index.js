import React from "react";
import { message } from "antd";
import { HeartOutlined, SmileOutlined } from "@ant-design/icons";
import { PageContainer, ProLayout } from "@ant-design/pro-components";

const IconMap = {
    smile: <SmileOutlined />,
    heart: <HeartOutlined />,
};

const defaultMenus = {
    path: "/",
    routes: [
        {
            path: "/welcome",
            name: "welcome",
            icon: <SmileOutlined />,
            routes: [],
        },
        {
            path: "/core",
            name: "core",
            icon: <HeartOutlined />,
        },
    ],
};

const loopMenuItem = (menus, turnTo) =>
    menus?.map(({ icon, routes, ...item }) => ({
        ...item,
        icon: icon && IconMap[icon],
        onclick: () => {
            turnTo(item.path);
        },
        children: routes && loopMenuItem(routes),
    }));

export default ({ children, turnTo }) => (
    <ProLayout
        style={{
            minHeight: 500,
        }}
        fixSiderbar
        location={{
            pathname: "/",
        }}
        menuItemRender={(item, dom) => {
            return <div onClick={()=>turnTo(item.path)}>{dom}</div>;
        }}
        onMenuHeaderClick={()=>turnTo("/welcome")}
        route={defaultMenus}
        pageTitleRender={false}
    >
        <PageContainer content={children}></PageContainer>
    </ProLayout>
);
