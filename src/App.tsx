import { useEffect, lazy } from "react";
import { Route, Routes, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { useAppSelector } from "./app/hooks";
import { TypeSettingContext } from "./contexts/type-setting-context";
import { UpgradeApp } from "./utils/upgrade";

// import Lists from "./components/lists";
// import Settings from "./components/settings/settings";
// import PageNotFound from "./components/404Page";
// import Navbar from "./components/navbar";

const Lists = lazy(() => import("./components/lists"));
const Settings = lazy(() => import("./components/settings/settings"));
const PageNotFound = lazy(() => import("./components/404Page"));
const Navbar = lazy(() => import("./components/navbar"));

import { SettingDefault } from "./types-defaults";
import { sanitizePathname, getTypeFromUrlParams } from "./utils/path";
import { getListSettings, getFirstListObject, isValidListType } from "./utils/type";

function App() {
    // Run an upgrade routine if needed.
    UpgradeApp();

    // Redirect to single slash path (/path) if multiple slashes in path (//path//)
    // Redirect when when search param type (?type=blabla) contains a type that doesn't exist.

    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const lists = useAppSelector((state) => state.lists);

    const pathname = location.pathname;
    const sanitizedPathname = sanitizePathname(pathname);

    // Valid routes
    const isValidRoute = ["/", "/settings", "/add-new-list"].includes(sanitizedPathname);

    // Pages where list items are needed
    const listItemPage = isValidRoute && "/add-new-list" !== sanitizedPathname;

    let setSearchParam = "";
    let listType = getTypeFromUrlParams();

    if (listType && isValidListType(listType, lists)) {
        // Valid type in url params

        // Keep url param only on list item pages
        setSearchParam = listItemPage ? listType : "";
    } else {
        // No valid type found in url params

        // Use first list type for list item pages
        const firstListType = getFirstListObject(lists);
        listType = firstListType ? firstListType["type"] : "";
        setSearchParam = listItemPage && listType ? listType : "";
    }

    // Do we need to redirect
    let navigateTo = "";
    if (pathname !== sanitizedPathname) {
        // Redirect to sanitized pathname
        navigateTo = sanitizedPathname + location.search;
    }

    if (listItemPage && !listType) {
        // Rederect to add new list page
        setSearchParam = "";
        navigateTo = "/add-new-list";
    }

    // Redirections
    useEffect(() => {
        if (navigateTo) {
            console.log("Redirect to " + navigateTo);
            navigate(navigateTo);
        }

        const hasType = searchParams.has("type");
        let paramsChanged = false;

        if (hasType && !setSearchParam) {
            searchParams.delete("type");
            paramsChanged = true;
        }

        if (setSearchParam) {
            searchParams.set("type", listType);
            paramsChanged = true;
        }

        if (paramsChanged) {
            console.log("Set new search params " + searchParams);
            setSearchParams(searchParams);
        }
    }, []);

    // Decide what page we're on and add settings to context provider
    let listSettings;
    let listStyle = "";
    if ("/add-new-list" === sanitizedPathname) {
        listSettings = SettingDefault;
    } else {
        listSettings = getListSettings(listType, lists);
        listStyle = listSettings.orderByDate ? "date" : "tree";
    }

    //console.log("type settings for this page", listSettings);

    return (
        <div className="App">
            <TypeSettingContext.Provider value={listSettings}>
                <Navbar />
                <div className="app-content">
                    <Routes>
                        <Route path="/" element={<Lists type={listStyle} />} />
                        <Route path="/add-new-list" key="add-new" element={<Settings key="new-settting" page="add-new" />} />
                        <Route path="/settings" key="update" element={<Settings key="update-setting" page="settings" />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </div>
                <ToastContainer />
            </TypeSettingContext.Provider>
        </div>
    );
}

export default App;
