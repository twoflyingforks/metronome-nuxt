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

// The document generation logic is now auto-imported from the composable.
const { generateConveyanceNote } = useDocumentGenerator();

// Create a ref to hold the instance of the ProposalTable component
const proposalTableRef = ref<InstanceType<typeof ProposalTable> | null>(null);

/**
 * A handler function that gets the selected data and calls the composable.
 */
function handleGenerateClick() {
  const selectedData = proposalTableRef.value?.selectedProposal;
  generateConveyanceNote(selectedData);
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
        <div class="flex justify-end pt-4">
          <Button
            :disabled="!proposalTableRef?.selectedProposal"
            class="cursor-pointer"
            @click="handleGenerateClick"
          >
            Generate Conveyance Note
          </Button>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
