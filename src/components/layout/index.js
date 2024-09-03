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
            onclick: () => {
                message.info("Welcome");
            },
        },
        {
            path: "/core",
            name: "core",
            icon: <HeartOutlined />,
            onclick: () => {
                message.info("core");
            },
        },
    ],
};

const loopMenuItem = (menus) =>
    menus?.map(({ icon, routes, ...item }) => ({
        ...item,
        icon: icon && IconMap[icon],
        children: routes && loopMenuItem(routes),
    }));

export default ({ children }) => (
    <ProLayout
        style={{
            minHeight: 500,
        }}
        fixSiderbar
        location={{
            pathname: "/",
        }}
        // menu={{ request: async () => loopMenuItem(defaultMenus) }}
        route={defaultMenus}
        menu={defaultMenus}
        pageTitleRender={false}
    >
        <PageContainer content={children}></PageContainer>
    </ProLayout>
);
