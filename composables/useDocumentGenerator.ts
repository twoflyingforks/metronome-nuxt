import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";

// Define the shape of the data the generator expects.
// This ensures type safety within the composable.
interface Proposal {
  id: string | number;
  long_title: string;
  short_title: string;
  original_title: string;
}

/**
 * A Nuxt 3 composable for handling document generation.
 */
export const useDocumentGenerator = () => {
  /**
   * Generates and downloads a .docx file based on a template and the provided proposal data.
   * @param proposalData The data from the selected proposal row.
   */
  const generateConveyanceNote = async (
    proposalData: Proposal | null | undefined,
  ) => {
    if (!proposalData) {
      alert("Please select a proposal first.");
      return;
    }

    try {
      // Step 1: Fetch the .docx template from the public folder
      const response = await fetch("/conveyance-template.docx");
      if (!response.ok) {
        throw new Error(
          "Template not found. Make sure 'conveyance-template.docx' is in your public/ directory.",
        );
      }
      const templateBlob = await response.arrayBuffer();

      // Step 2: Create a PizZip instance with the template content
      const zip = new PizZip(templateBlob);

      // Step 3: Create a docxtemplater instance
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Step 4: Render the document with the provided data
      doc.render({
        id: proposalData.id,
        short_title: proposalData.short_title,
        long_title: proposalData.long_title,
        original_title: proposalData.original_title,
      });

      // Step 5: Generate the output file as a blob
      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      // Step 6: Format the filename with the current date and time
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      const datePart = `${year}-${month}-${day}`;
      const timePart = `${hours}${minutes}${seconds}`;
      const filename = `${datePart} Conveyance Note (${timePart}).docx`;

      // Step 7: Trigger a download using file-saver
      saveAs(out, filename);
    } catch (error) {
      // Type-safe error handling
      console.error("Error generating document:", error);
      let errorMessage =
        "An unknown error occurred while generating the document.";
      if (error instanceof Error) {
        errorMessage = `An error occurred: ${error.message}`;
      }
      alert(errorMessage);
    }
  };

  // Expose the function to be used in components
  return {
    generateConveyanceNote,
  };
};
