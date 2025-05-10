import {
    grayscale,
    PDFDocument,
    rgb,
    StandardFonts,
    type PDFFont,
    type PDFPage,
} from "pdf-lib";
import { numeroALetras } from "./literales";

const fonts: {
    TimesRomanBold?: PDFFont;
    HelveticaBold?: PDFFont;
    HelveticaBoldOblique?: PDFFont;
    HelveticaOblique?: PDFFont;
} = {};

export interface DataOrden {
    precio_unitario?: number;
    importe?: number;
    ci?: string;
    n_orden?: string;
    emitido_por?: string;
    cantidad?: number;
    unidad?: string;
    nombre_responsable?: string;
    concepto?: string;
}

export const loadFonts = async (pdfDoc: PDFDocument) => {
    fonts.TimesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    fonts.HelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    fonts.HelveticaBoldOblique = await pdfDoc.embedFont(
        StandardFonts.HelveticaBoldOblique
    );
    fonts.HelveticaOblique = await pdfDoc.embedFont(
        StandardFonts.HelveticaOblique
    );
};

export const header = (page: PDFPage, data: DataOrden) => {
    const headers = [
        {
            text: "UNIVERSIDAD MAYOR DE SAN SIMÓN",
            x: 20,
            y: 820,
            size: 10,
            font: fonts.HelveticaBold,
        },
        {
            text: "FACULTAD DE CIENCIAS Y TECNOLOGIA",
            x: 10,
            y: 800,
            size: 10,
            font: fonts.TimesRomanBold,
        },
        {
            text: "SECRETARÍA ADMINISTRATIVA",
            x: 40,
            y: 780,
            size: 10,
            font: fonts.HelveticaBold,
        },
        {
            text: "ORDEN DE PAGO",
            x: 250,
            y: 795,
            size: 20,
            font: fonts.HelveticaBold,
        },
        {
            text: `N° ${data.n_orden}`,
            x: 450,
            y: 795,
            size: 20,
            color: rgb(1, 0, 0),
            font: fonts.TimesRomanBold,
        },
    ];
    headers.forEach(({ text, x, y, size, font, color = rgb(0, 0, 0) }) => {
        page.drawText(text, { x, y, size, font, color });
    });
};

export const drawCenteredText = (
    page: PDFPage,
    text: string,
    x: number,
    y: number,
    width: number,
    height: number,
    font: PDFFont,
    fontSize: number
) => {
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const centerX = x + (width - textWidth) / 2;
    const centerY = y + (height - fontSize) / 2;
    page.drawText(text, {
        x: centerX,
        y: centerY,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
    });
};

const datosResponsable = (page: PDFPage, data: DataOrden) => {
    page.drawText("Emitido por la Unidad:", {
        x: 10,
        y: 755,
        size: 10,
    });
    page.drawText(data.emitido_por || "", {
        x: 120,
        y: 755,
        size: 10,

        font: fonts.HelveticaBold,
    });
    page.drawText("Señor(es):", {
        x: 10,
        y: 740,
        size: 10,
    });
    page.drawText(data.nombre_responsable || "", {
        x: 80,
        y: 740,
        size: 10,
        font: fonts.HelveticaBold,
    });

    page.drawText("NIT/CI:", {
        x: 450,
        y: 740,
        size: 10,
    });
    page.drawText(data.ci || "", {
        x: 485,
        y: 740,
        size: 10,
        opacity: 0.75,
        font: fonts.HelveticaBold,
    });

    page.drawText("Por lo siguiente:", {
        x: 10,
        y: 725,
        size: 10,
    });
    page.drawText("DEBE", {
        x: 500,
        y: 725,
        size: 10,
    });
};

const datosInscripcion = (page: PDFPage, data: DataOrden) => {
    const yInit = 694;
    const h = 20;
    let xInitTable = 10;
    const wCantidad = 60;
    let y = yInit;

    page.drawRectangle({
        x: 10,
        y,
        width: 570,
        height: 20,
        borderWidth: 1,
        borderColor: grayscale(0),
        opacity: 0.5,
        borderOpacity: 0.75,
    });
    const rows = 6;
    for (let index = 0; index < rows; index++) {
        y -= h;
        page.drawLine({
            start: { x: 10, y },
            end: { x: 580, y },
            thickness: 1,
            color: rgb(0, 0, 0),
            opacity: 1,
            dashArray: [1, 1],
        });
    }
    if (fonts.HelveticaBold)
        drawCenteredText(
            page,
            "CANTIDAD",
            xInitTable,
            y + rows * h,
            wCantidad,
            h,
            fonts.HelveticaBold,
            10
        );

    if (fonts.HelveticaOblique)
        drawCenteredText(
            page,
            data.cantidad + "",
            xInitTable,
            y + (rows - 1) * h,
            wCantidad,
            h,
            fonts.HelveticaOblique,
            10
        );

    page.drawRectangle({
        x: xInitTable,
        y,
        width: wCantidad,
        height: h * (rows + 1),
        borderWidth: 1,
        borderColor: grayscale(0),
        opacity: 0.5,
        borderOpacity: 0.75,
    });
    xInitTable += wCantidad;

    const wUnidad = 70;

    if (fonts.HelveticaBold)
        drawCenteredText(
            page,
            "UNIDAD",
            xInitTable,
            y + rows * h,
            wUnidad,
            h,
            fonts.HelveticaBold,
            10
        );
    if (fonts.HelveticaOblique)
        drawCenteredText(
            page,
            data.unidad + "",
            xInitTable,
            y + (rows - 1) * h,
            wUnidad,
            h,
            fonts.HelveticaOblique,
            10
        );

    page.drawRectangle({
        x: xInitTable,
        y,
        width: wUnidad,
        height: h * (rows + 1),
        borderWidth: 1,
        borderColor: grayscale(0),
        opacity: 0.5,
        borderOpacity: 0.75,
    });
    xInitTable += wUnidad;
    const wConcepto = 300;

    if (fonts.HelveticaBold)
        drawCenteredText(
            page,
            "C   O   N   C   E   P   T   O",
            xInitTable,
            y + rows * h,
            wConcepto,
            h,
            fonts.HelveticaBold,
            10
        );

    page.drawText(data.concepto + "", {
        x: xInitTable + 10,
        y: 700 - h,
        size: 10,
        color: rgb(0, 0, 0),
        font: fonts.HelveticaOblique,
        lineHeight: 20,
    });
    page.drawRectangle({
        x: xInitTable,
        y,
        width: wConcepto,
        height: h * (rows + 1),
        borderWidth: 1,
        borderColor: grayscale(0),
        opacity: 0.5,
        borderOpacity: 0.75,
    });
    xInitTable += wConcepto;
    const wPrecio = 70;

    if (fonts.HelveticaBold)
        drawCenteredText(
            page,
            "P. UNITARIO",
            xInitTable,
            y + rows * h,
            wPrecio,
            h,
            fonts.HelveticaBold,
            10
        );
    if (fonts.HelveticaOblique)
        drawCenteredText(
            page,
            data.precio_unitario + "",
            xInitTable,
            y + (rows - 1) * h,
            wUnidad,
            h,
            fonts.HelveticaOblique,
            10
        );

    page.drawRectangle({
        x: xInitTable,
        y,
        width: wPrecio,
        height: h * (rows + 1),
        borderWidth: 1,
        borderColor: grayscale(0),
        opacity: 0.5,
        borderOpacity: 0.75,
    });
    xInitTable += wPrecio;

    if (fonts.HelveticaBold)
        drawCenteredText(
            page,
            "IMPORTE",
            xInitTable,
            y + rows * h,
            wUnidad,
            h,
            fonts.HelveticaBold,
            10
        );
    if (fonts.HelveticaOblique)
        drawCenteredText(
            page,
            data.importe + "",
            xInitTable,
            y + (rows - 1) * h,
            wUnidad,
            h,
            fonts.HelveticaOblique,
            10
        );

    page.drawRectangle({
        x: xInitTable,
        y,
        width: wPrecio,
        height: h * (rows + 1),
        borderWidth: 1,
        borderColor: grayscale(0),
        opacity: 0.5,
        borderOpacity: 0.75,
    });
    y -= h;
    page.drawText("Nota: No vale como factura oficial", {
        x: 10,
        y,
        size: 10,
        color: rgb(0, 0, 0),
    });
    page.drawRectangle({
        x: xInitTable,
        y: y - 5,
        width: wPrecio,
        height: h,
        borderWidth: 1,
        borderColor: grayscale(0),
        opacity: 0.5,
        borderOpacity: 0.75,
    });
    if (fonts.HelveticaOblique)
        drawCenteredText(
            page,
            data.importe + "",
            xInitTable,
            y - 5,
            wUnidad,
            h,
            fonts.HelveticaOblique,
            10
        );
    y -= 25;
    page.drawText(`Son`, {
        x: 10,
        y,
        size: 12,
    });
    page.drawText(`${numeroALetras(data.importe || 0)} 00/100 Bolivianos`, {
        x: 40,
        y,
        size: 12,
        font: fonts.HelveticaBold,
    });
    const date = new Date();
    const formattedDate = date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    y -= 25;
    page.drawText(`Cochabamba, ${formattedDate} `, {
        x: 10,
        y,
        size: 12,
        color: rgb(0, 0, 0),
    });

    page.drawText(`RESPONSABLE`, {
        x: 400,
        y,
        size: 12,
        color: rgb(0, 0, 0),
    });
    page.drawLine({
        start: { x: 380, y: y + 15 },
        end: { x: 510, y: y + 15 },
        thickness: 1,
        color: rgb(0, 0, 0),
        opacity: 1,
        dashArray: [1, 1],
    });
};

export const generarOrden = async (
    dataOrden: DataOrden = {
        precio_unitario: 15,
        importe: 45,
        cantidad: 3,
        unidad: "Inscripción",
        ci: "2244668",
        emitido_por: "Decanato",
        nombre_responsable: "Leticia Blanco",
        concepto:
            "Inscripcion Olimpiada San Simón \n \tFisica - 3ro Sec\n \tQuimica - 3ro Sec \n\t Informatica - Cat Puma",
        n_orden: "001001",
    }
) => {
    const pdfDoc = await PDFDocument.create();
    await loadFonts(pdfDoc);
    const page = pdfDoc.addPage();
    header(page, dataOrden);
    datosResponsable(page, dataOrden);
    datosInscripcion(page, dataOrden);

    // const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    // const pdfElement = document.getElementById("pdf");
    // if (pdfElement) {
    //     (pdfElement as HTMLIFrameElement).src = pdfDataUri;
    // }
    const pdfBytes = await pdfDoc.save();
    descargarPDF(pdfBytes);
};

export const descargarPDF = (pdfBytes: Uint8Array) => {
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "orden.pdf";
    link.click();
    URL.revokeObjectURL(url);
};
