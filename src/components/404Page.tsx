import { useTranslation } from "react-i18next";

const PageNotFound = () => {
    const { t } = useTranslation("common");
    return (
        <div className="page-404">
            <h3>{t("404-page-not-found")}</h3>
        </div>
    );
};

export default PageNotFound;
