// Interface used for versioning
export interface AppVersion {
    app: string;
    schema: number;
}

// Interface used for settings of a list type
export interface ListSettings {
    type: string;
    title: string;
    description: string;
    orderByDate: boolean;
    settings: any;
}

// Interface used for lists types
export interface ListType extends ListSettings {
    items: any[];
}
