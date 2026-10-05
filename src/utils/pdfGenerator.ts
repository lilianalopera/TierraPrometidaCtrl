import { jsPDF } from 'jspdf';
import { ChildRecord } from '../types';
import { formatDateSpanish } from './classroom';

/**
 * Generates and downloads the official Consent Form PDF identical to the church's legal document.
 */
export function generateConsentPDF(child: ChildRecord, autoDownload = true): jsPDF {
  // A4 dimensions: 210mm x 297mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2; // 178mm

  // 1. Top Header Navy Banner
  doc.setFillColor(15, 43, 72); // #0f2b48 - Deep church navy
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Left church symbol (white dove / fire illustration)
  doc.setFillColor(255, 255, 255);
  doc.circle(margin + 5, 14, 8, 'F');
  doc.setFillColor(15, 43, 72);
  doc.setFontSize(7);
  doc.setTextColor(15, 43, 72);
  doc.text('Fe y', margin + 2.5, 13);
  doc.text('Fuego', margin + 1.5, 16.5);

  // Center Header Titles
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Iglesia Comunidad Cristiana de Fe y Fuego', pageWidth / 2, 9, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text('Barranquilla - Colombia', pageWidth / 2, 15, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setTextColor(224, 242, 254); // Light sky tint
  doc.text('Autorización y Consentimiento Informado - Tierra Prometida', pageWidth / 2, 21, { align: 'center' });

  // Right Tierra Prometida Badge
  doc.setFillColor(91, 33, 182); // Vibrant Purple from TP logo
  doc.roundedRect(pageWidth - margin - 28, 5, 28, 18, 3, 3, 'F');
  doc.setTextColor(253, 224, 71); // Yellow TP text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Tierra', pageWidth - margin - 14, 12, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(6.5);
  doc.text('Prometida', pageWidth - margin - 14, 18, { align: 'center' });

  let y = 32;

  // 2. Amber/Golden Section Ribbon: "Datos del Menor"
  doc.setFillColor(194, 143, 44); // Golden ribbon #c28f2c
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Datos del Menor', margin + 3, y + 5);

  y += 9;

  // Box with child's name in light blue background
  doc.setFillColor(224, 242, 254); // Light blue #e0f2fe
  doc.roundedRect(margin, y, contentWidth, 12, 1, 1, 'F');
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Nombre:', margin + 4, y + 7.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(child.fullName.toUpperCase(), margin + 25, y + 7.5);

  // Sub-row: Birthdate, Age at Dec 31, Classroom
  y += 14;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const formattedBirth = formatDateSpanish(child.birthDate);
  doc.text(`Fecha de Nacimiento: ${formattedBirth || 'No registrada'}`, margin + 2, y);
  doc.text(`Edad al 31 de Dic: ${child.ageAtDec31} años`, margin + 65, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(3, 105, 161);
  doc.text(`Salón Asignado: ${child.classroom}`, margin + 115, y);

  y += 7;

  // Helper function to render a legal clause with title and body
  const printClause = (title: string, content: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 43, 72);
    doc.text(title, margin, y);
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(51, 65, 85);
    const lines = doc.splitTextToSize(content, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * 3.6 + 3.5;
  };

  // 3. Clauses exactly as in the approved document:
  printClause(
    'Declaración de Autorización',
    'Yo, plenamente identificado con los datos registrados en este documento, en mi calidad de padre, madre, tutor legal o acudiente del menor inscrito, autorizo expresamente su participación en todas las actividades programadas, espacios pedagógicos, conferencias y dinámicas organizadas por la Iglesia Comunidad Cristiana de Fe y Fuego Barranquilla, en el desarrollo programado del ministerio infantil denominado Tierra Prometida.'
  );

  printClause(
    'Responsabilidad y Estado de Salud',
    'Autorizo la participación del menor bajo mi absoluta responsabilidad y manifiesto voluntariamente que no presenta condiciones médicas o físicas que le impidan integrarse de forma segura a las dinámicas de los eventos y actividades y que bajo mi responsabilidad esta en ese lugar en buen estado de salud.'
  );

  printClause(
    'Atención Médica de Emergencia',
    'En caso de presentarse una emergencia médica durante el tiempo de las actividades, autorizo expresamente al personal logístico y de primeros auxilios a brindar la atención básica necesaria y/o a trasladar al menor al centro asistencial más cercano para salvaguardar su integridad.'
  );

  printClause(
    'Exoneración de Responsabilidad',
    'Exonero de toda responsabilidad civil, contractual o extracontractual a la Iglesia Comunidad Cristiana de Fe y Fuego en Barranquilla, sus pastores, líderes, directivas, colaboradores y personal de apoyo voluntario, ante cualquier incidente o accidente menor que pueda ocurrir durante el desarrollo de la jornada.'
  );

  printClause(
    'Derechos de Imagen y Uso de Redes Sociales',
    'Autorizo de manera voluntaria, expresa e informada la toma de fotografías, registros en video o capturas de audio del menor durante el desarrollo de las actividades. Asimismo, faculto a la Iglesia Comunidad Cristiana de Fe y Fuego en Barranquilla para su posterior uso, publicación y difusión en sus redes sociales institucionales, páginas web y canales oficiales de comunicación, con fines exclusivamente ilustrativos, informativos o de memoria histórica de la comunidad, sin que esto genere derecho a compensación alguna.'
  );

  // 4. Section: Datos de quien autoriza
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 43, 72);
  doc.text('Datos de quien autoriza', margin, y);
  y += 5;

  // Box or grid for authorizer details
  const labelX = margin + 2;
  const valueX = margin + 48;
  const lineHeight = 5.2;

  const fields = [
    { label: 'Nombre completo:', val: child.authorizerName || child.motherName || child.fatherName },
    { label: 'Calidad:', val: child.authorizerRelationship || 'Madre' },
    { label: 'Documento de Id.:', val: child.authorizerIdNumber || 'Pendiente' },
    { label: 'Teléfono:', val: child.authorizerPhone || child.motherPhone || child.fatherPhone },
    { label: 'Adulto responsable en iglesia:', val: child.churchResponsibleAdult || 'Familiar registrado' },
    { label: 'Fecha y hora de aceptación:', val: child.consentTimestamp || new Date().toLocaleString('es-CO') },
  ];

  fields.forEach((item) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(item.label, labelX, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(item.val, valueX, y);
    y += lineHeight;
  });

  y += 3;

  // 5. Bordered Legal Notice Box (Ley 527 de 1999 y Ley 1581 de 2012)
  doc.setFillColor(254, 252, 232); // #fefce8
  doc.setDrawColor(234, 179, 8); // #eab308
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 18, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(113, 63, 18);
  const legalText =
    'Aviso Legal: Esta autorización fue otorgada de forma digital mediante aceptación electrónica con plena validez jurídica conforme a la Ley 527 de 1999 (Comercio Electrónico) y Ley 1581 de 2012 (Protección de Datos) de la República de Colombia. El registro de IP, fecha y hora constituyen evidencia de la manifestación de voluntad del firmante.';
  const legalLines = doc.splitTextToSize(legalText, contentWidth - 6);
  doc.text(legalLines, margin + 3, y + 5);

  // 6. Footer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Página 1', pageWidth / 2, 290, { align: 'center' });

  if (autoDownload) {
    const sanitizedName = child.fullName
      .trim()
      .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, '')
      .replace(/\s+/g, '_');
    doc.save(`Consentimiento_Tierra_Prometida_${sanitizedName}.pdf`);
  }

  return doc;
}
