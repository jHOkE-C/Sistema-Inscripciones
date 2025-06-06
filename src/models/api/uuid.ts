interface UuidValues {
    [key: string]: string | number | boolean;
}

export const getUuid = async (values: UuidValues): Promise<string> => {
    console.log("Enviando datos...", values);
    return "12345678-uuid";
};

export const getInscripcion = async (): Promise<string[]> => {
    return [];
};
