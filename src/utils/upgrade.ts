import { useAppSelector } from "../app/hooks";
import { useAppDispatch } from "../app/hooks";

// Current (settings structure) schema version defined in version.ts
import { APP_SCHEMA_VERSION } from "../app/version";

// Action to update version in redux store
import { UpdateSchemaVersion } from "../features/version-slice";

// Function to check if there is a new app version
export const NewerAppSchemaVersionExists = (): boolean => {
    // Version saved in redux store
    const currentAppSchemaVersion = useAppSelector((state) => state.version.schema);

    //console.log("Current stored App Version:", currentAppSchemaVersion);
    //console.log("Defined App Version:", APP_SCHEMA_VERSION);

    if (currentAppSchemaVersion < APP_SCHEMA_VERSION) {
        //  console.log("New app version detected.");
        return true;
    }
    return false;
};

export const UpgradeApp = (): void => {
    const dispatch = useAppDispatch();
    if (NewerAppSchemaVersionExists()) {
        RunUpgradeRoutine();
        dispatch(UpdateSchemaVersion(APP_SCHEMA_VERSION));
        console.log("App schema upgraded to version:", APP_SCHEMA_VERSION);
    }
};

const RunUpgradeRoutine = (): void => {
    // Placeholder function for future upgrade routines
    // Make changes to the app (stored) settings before they are run through the (newer) validation checks.
    // const lists = useAppSelector((state) => state.lists);
};
