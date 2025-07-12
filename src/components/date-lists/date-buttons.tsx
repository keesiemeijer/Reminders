import { useTranslation } from "react-i18next";
import { dateAdd } from "./utils/date";

interface DateButtonsProps {
    dateInput: React.RefObject<HTMLInputElement | null> | null;
}

const DateButtons = (props: DateButtonsProps) => {
    const { t } = useTranslation("date-lists");

    // Callback function for when submit button was clicked
    const submitDate = (e: React.MouseEvent<HTMLButtonElement>, date: string) => {
        // Button was clicked
        e.preventDefault();

        if (props.dateInput && props.dateInput.current) {
            // Update date input with picked date
            props.dateInput.current.value = date;
            props.dateInput.current.focus();
        }
    };

    interface ButtonDate {
        id: string;
        type: string;
        i18n: string | number;
    }

    // Relative days
    const dates: ButtonDate[] = [
        { id: "today_0", type: "day", i18n: t("today") },
        { id: "day_relative_1", type: "day", i18n: t("intlRelativeTime-day", { val: 1 }) },
        { id: "day_2", type: "day", i18n: t("day-WithCount_other", { count: 2 }) },
    ];

    // Numbered days
    for (let index = 3; index < 16; index++) {
        dates.push({ id: "day_" + index, type: "day", i18n: index });
    }

    // Months
    dates.push.apply(dates, [
        { id: "month_relative_1", type: "month", i18n: t("intlRelativeTime-month", { val: 1 }) },
        { id: "month_2", type: "month", i18n: t("month-WithCount_other", { count: 2 }) },
        { id: "month_3", type: "month", i18n: 3 },
        { id: "month_4", type: "month", i18n: 4 },
        { id: "month_5", type: "month", i18n: 5 },
        { id: "month_6", type: "month", i18n: 6 },
    ]);

    let buttonElements: any = [];
    let type = "day";

    dates.forEach((el: ButtonDate, i) => {
        let matches = el.id.match(/\d+$/);
        if (!matches) {
            return;
        }
        const number = parseInt(matches[0], 10);
        const buttonDate = dateAdd(number, el.type);

        const elementType = el.type;
        if (elementType !== type) {
            buttonElements.push(<br key={"br" + i} />);
            type = elementType;
        }

        buttonElements.push(
            <button key={i} type="button" onClick={(e) => submitDate(e, buttonDate)} className="btn btn-outline-dark" value={buttonDate}>
                {el.i18n}
            </button>
        );
    });

    return (
        <div className="date-buttons">
            <details>
                <summary className="form-label">Pick a Date</summary>

                {buttonElements}
            </details>
        </div>
    );
};

export default DateButtons;
