import { useTranslation } from "react-i18next";
import { dateAdd } from "./utils/date";

interface DateButtonsProps {
    dateInput: React.RefObject<HTMLInputElement | null> | null;
    setDate: React.Dispatch<React.SetStateAction<string>>;
}

const DateButtons = (props: DateButtonsProps) => {
    const { t } = useTranslation("date-lists");
    interface ButtonDate {
        value: number;
        type: string;
        i18n: string | number;
    }

    // Callback function for when date button was clicked
    const submitDate = (e: React.MouseEvent<HTMLButtonElement>, date: ButtonDate) => {
        // Button was clicked
        e.preventDefault();

        if (!(props.dateInput && props.dateInput.current)) {
            return;
        }

        let inputDate = "";
        if (["plus_day", "plus_month"].includes(date.type)) {
            const typeParts = date.type.split("_");
            inputDate = dateAdd(date.value, typeParts[1], props.dateInput.current.value);
        } else {
            inputDate = dateAdd(date.value, date.type);
        }
        // Update date input with picked date
        props.dateInput.current.value = inputDate;
        //props.dateInput.current.focus();
        props.setDate(inputDate);
    };

    // Relative days
    const dates: ButtonDate[] = [
        { value: 0, type: "day", i18n: t("intlRelativeTime-day-auto", { val: 0 }) },
        { value: 1, type: "day", i18n: t("intlRelativeTime-day", { val: 1 }) },
        { value: 2, type: "day", i18n: t("day-WithCount_other", { count: 2 }) },
    ];

    // Numbered days
    for (let index = 3; index < 15; index++) {
        dates.push({ value: index, type: "day", i18n: index });
    }

    // Rest of dates
    dates.push.apply(dates, [
        { value: 1, type: "plus_day", i18n: t("plus-day-WithCount_one", { count: 1 }) },
        { value: 7, type: "plus_day", i18n: t("plus-day-WithCount_other", { count: 7 }) },
        { value: 1, type: "month", i18n: t("intlRelativeTime-month", { val: 1 }) },
        { value: 2, type: "month", i18n: t("month-WithCount_other", { count: 2 }) },
        { value: 3, type: "month", i18n: 3 },
        { value: 4, type: "month", i18n: 4 },
        { value: 5, type: "month", i18n: 5 },
        { value: 6, type: "month", i18n: 6 },
        { value: 1, type: "plus_month", i18n: t("plus-month-WithCount_one", { count: 1 }) },
    ]);

    let buttonElements: any = [];
    let type = "day";

    dates.forEach((el: ButtonDate, i) => {
        const elementType = el.type;
        if (elementType !== type && !elementType.includes("plus")) {
            buttonElements.push(<br key={"br" + i} />);
            type = elementType;
        }

        buttonElements.push(
            <button key={i} type="button" onClick={(e) => submitDate(e, el)} className="btn btn-outline-dark">
                {el.i18n}
            </button>
        );
    });

    return (
        <div className="date-buttons">
            <details>
                <summary className="form-label"> {t("pick-a-date")}</summary>
                <small id="date-buttons-help" className="form-text text-muted">
                    {t("quickly-pick-a-date-with-the-buttons-below")}
                </small>
                {buttonElements}
            </details>
        </div>
    );
};

export default DateButtons;
