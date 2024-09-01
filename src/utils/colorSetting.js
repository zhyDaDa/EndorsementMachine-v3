import { deepCopy } from "./utils";

export const SETTING = {
    settings: {
        lastBookID: 0,
        lastBookName: "",
        poolSize: 5,
        start_showTutorial: true,
        start_showSentence: false,
        start_rememberLastBook: false,
        theme_color: 0,
    },
    colors: [
        //[light,deep]
        ["#FBA3A3", "#C95758"],
        ["#DA4453", "#89216B"],
        ["#f7b733", "#fc4a1a"],
        ["#E29587", "#D66D75"],
        ["#a8c0ff", "#3f2b96"],
        ["#56CCF2", "#2F80ED"],
        ["#F2C94C", "#F2994A"],
        ["#B2FEFA", "#0ED2F7"],
        ["#00c6ff", "#0072ff"],
        ["#6dd5ed", "#2193b0"],
        ["#", "#"],
        ["#", "#"],
    ],
    ApplySetting: () => {
        let lightColor = SETTING.colors[SETTING.settings.theme_color][0];
        let deepColor = SETTING.colors[SETTING.settings.theme_color][1];
        document.documentElement.style.setProperty("--color-light", lightColor);
        document.documentElement.style.setProperty("--color-deep", deepColor);
        // document.documentElement.style.setProperty("--color-lighter", adjustLightness(lightColor, 1.2));
        // document.documentElement.style.setProperty("--color-deeper", adjustLightness(deepColor, 0.8));
    },
    GetSettingsFromLocalStorageThenApply: () => {
        let s = localStorage.getItem("settings");
        try {
            SETTING.settings = deepCopy(JSON.parse(s), false);
            SETTING.ApplySetting();
        } catch {
            console.log(
                "读入设置失败, 可能是没有存储或格式错误, 已完成设置初始化"
            );
            SETTING.settings = {
                lastBookID: 0,
                lastBookName: "",
                start_showTutorial: true,
                start_showSentence: false,
                start_rememberLastBook: false,
                poolSize: 5,
                theme_color: 0,
            };
            SETTING.SaveSettingsToLocalStorage();
            SETTING.GetSettingsFromLocalStorageThenApply();
        }
    },
    SaveSettingsToLocalStorage: () => {
        localStorage.setItem("settings", JSON.stringify(SETTING.settings));
    },
};
