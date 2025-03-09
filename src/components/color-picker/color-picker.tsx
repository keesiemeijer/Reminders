import React, { useCallback, useRef, useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

import useClickOutside from "./use-click-outside";

interface ColorPickerProps {
    color: string;
    onChange: React.Dispatch<React.SetStateAction<any>>;
}

export const ColorPicker = (props: ColorPickerProps) => {
    const popover = useRef<HTMLDivElement>(null);
    const [isOpen, toggle] = useState(false);

    const close = useCallback(() => toggle(false), []);

    const handleKeyPressSwatch = (event: React.KeyboardEvent<HTMLDivElement>) => {
        // Display the color picker whith these keys if the swatch has focus
        const keys: string[] = ["Enter", " ", "Spacebar", "Tab"];

        if (!isOpen && keys.includes(event.key)) {
            toggle(true);
        }
        // Close the color picker with the escape key if the swatch has focus
        if (isOpen && "Escape" === event.key) {
            toggle(false);
        }
    };

    const handleKeyPressColorPicker = (event: React.KeyboardEvent<HTMLDivElement>) => {
        // Close the color picker with the escape key if the color picker has focus
        if (isOpen && "Escape" === event.key) {
            toggle(false);
        }
    };

    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        // Check if focus is not on child element
        if (!event.currentTarget.contains(event.relatedTarget)) {
            // Close color picker when it is losing focus by tabbing out of it
            toggle(false);
        }
    };

    // Click events to close colorpicker
    useClickOutside({ ref: popover, handler: close });

    return (
        <div className="picker">
            <div className="swatch" tabIndex={0} onKeyDown={handleKeyPressSwatch} style={{ backgroundColor: props.color }} onClick={() => toggle(true)} />

            {isOpen && (
                <div className="color-popover" ref={popover} onBlur={handleBlur} onKeyDown={handleKeyPressColorPicker}>
                    <HexColorPicker color={props.color} onChange={props.onChange} />
                    <label className="color-input-label">
                        <span className="sr-only">Hexadecimal color code</span>
                        <span>#</span>
                        <HexColorInput color={props.color} onChange={props.onChange} />
                    </label>
                </div>
            )}
        </div>
    );
};
