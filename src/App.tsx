import { useEffect } from "react";
import { Route, Routes, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { useAppSelector } from "./app/hooks";
import { TypeSettingContext } from "./contexts/type-setting-context";

import Reminders from "./components/reminders";
import Settings from "./components/settings";
import PageNotFound from "./components/404Page";
import Navbar from "./components/navbar";

import { SettingDefault } from "./features/reminderSlice";
import { sanitizePathname } from "./utils/path";
import { getTypeSettingsObject, getFirstTypeObject } from "./utils/type";
import { getTypeFromUrlParams } from "./utils/path";
import { isValidReminderType } from "./utils/validate";

function App() {
    // Redirect to single slash path (/path) if multiple slashes in path (//path//)
    // Redirect when when search param type (?type=blabla) contains a type that doesn't exist.

    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const allReminders = useAppSelector((state) => state.reminders);

    const pathname = location.pathname;
    const sanitizedPathname = sanitizePathname(pathname);

    // Valid routes
    const isValidRoute = ["/", "/settings", "/add-new-list"].includes(sanitizedPathname);

    // Pages where reminder type is needed
    const reminderTypePage = isValidRoute && "/add-new-list" !== sanitizedPathname;

    let setSearchParam = "";
    let reminderType = getTypeFromUrlParams();

    if (reminderType && isValidReminderType(reminderType, allReminders)) {
        // Valid type in url params
        // Keep url param only on reminder type pages
        setSearchParam = reminderTypePage ? reminderType : "";
    } else {
        const firstReminderType = getFirstTypeObject(allReminders);
        // No valid type found in url params
        // Use first reminder type if reminder type page
        reminderType = firstReminderType ? firstReminderType["type"] : "";
        setSearchParam = reminderTypePage && reminderType ? reminderType : "";
    }

    // Do we need to redirect
    let navigateTo = "";
    if (pathname !== sanitizedPathname) {
        // Redirect to sanitized pathname
        navigateTo = sanitizedPathname + location.search;
    }

    if (reminderTypePage && !reminderType) {
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
            searchParams.set("type", reminderType);
            paramsChanged = true;
        }

        if (paramsChanged) {
            console.log("Set new search params " + searchParams);
            setSearchParams(searchParams);
        }
    }, []);

    // Decide what page we're on and add settings to context provider
    let typeSettings;
    if ("/add-new-list" === sanitizedPathname) {
        typeSettings = SettingDefault;
    } else {
        typeSettings = getTypeSettingsObject(reminderType, allReminders);
    }

    console.log("type settings for this page", typeSettings);

    return (
        <div className="App">
            <TypeSettingContext.Provider value={typeSettings}>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Reminders />} />
                    <Route path="/add-new-list" key="add-new" element={<Settings key="new-settting" page="add-new" />} />
                    <Route path="/settings" key="update" element={<Settings key="update-setting" page="settings" />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
                <ToastContainer />
            </TypeSettingContext.Provider>
        </div>
    );
}

export default App;
