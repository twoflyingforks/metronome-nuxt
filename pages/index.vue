<script setup lang="ts">
import { ref } from "vue";
// 'InstanceType' is a built-in TypeScript utility and does not need to be imported.
import AppSidebar from "@/components/AppSidebar.vue";
import ProposalTable from "@/components/ProposalTable.vue"; // Import the table component
import { Button } from "@/components/ui/button"; // Import the button
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Import libraries for document generation
// Make sure to install them: npm install docxtemplater pizzip file-saver
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";

// Create a ref to hold the instance of the ProposalTable component
// By providing a type, TypeScript knows what properties will be exposed on the ref's value.
const proposalTableRef = ref<InstanceType<typeof ProposalTable> | null>(null);

/**
 * Generates and downloads a .docx file based on a template and the selected proposal.
 */
async function generateDocument() {
  // Get the selected proposal from the child component's exposed properties
  const selectedData = proposalTableRef.value?.selectedProposal;

  if (!selectedData) {
    // Using a non-blocking UI element for notifications is better than alert()
    // For now, we'll keep the alert for simplicity.
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

    // Step 4: Set the data to replace placeholders in the template
    // Your .docx template should have placeholders like {id}, {short_title}, etc.
    doc.setData({
      id: selectedData.id,
      short_title: selectedData.short_title,
      long_title: selectedData.long_title,
      original_title: selectedData.original_title,
      // Add any other data you need in the template
    });

    // Step 5: Render the document with the data
    doc.render();

    // Step 6: Generate the output file as a blob
    const out = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    // Step 7: Trigger a download using file-saver
    saveAs(out, `ConveyanceNote-${selectedData.id}.docx`);
  } catch (error) {
    // Type-safe error handling for the 'unknown' type.
    console.error("Error generating document:", error);
    let errorMessage =
      "An unknown error occurred while generating the document.";
    if (error instanceof Error) {
      errorMessage = `An error occurred: ${error.message}`;
    }
    alert(errorMessage);
  }
}
</script>

<script lang="ts">
export const description = "A sidebar that collapses to icons.";
export const iframeHeight = "800px";
export const containerClass = "w-full h-full";
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header
        class="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4"
      >
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1" />
          <Separator
            orientation="vertical"
            class="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
        <!-- Assign the ref to the component -->
        <ProposalTable ref="proposalTableRef" />
        <!-- Generate Document Button -->
        <div class="flex items-center gap-2">
          <Button
            :disabled="!proposalTableRef?.selectedProposal"
            @click="generateDocument"
          >
            Generate Conveyance Note
          </Button>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
