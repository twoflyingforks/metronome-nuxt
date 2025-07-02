<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <div class="space-y-1.5">
          <CardTitle>Proposals</CardTitle>
          <CardDescription>
            A list of proposals fetched from the Directus API. Select one using
            the radio buttons.
          </CardDescription>
        </div>

        <TooltipProvider :delay-duration="100">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                :disabled="isLoading"
                @click="fetchProposals"
              >
                <RefreshCcw class="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh Data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </CardHeader>
    <CardContent>
      <RadioGroup v-model="selectedProposalId">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[50px]"></TableHead>
              <TableHead class="w-[15%]">ID</TableHead>
              <TableHead class="w-[35%]">Short Title</TableHead>
              <TableHead class="w-[50%]">Long Title</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <!-- Loading State -->
            <template v-if="isLoading">
              <TableRow v-for="n in 3" :key="n">
                <TableCell><Skeleton class="h-4 w-4 rounded-full" /></TableCell>
                <TableCell><Skeleton class="h-6 w-full" /></TableCell>
                <TableCell><Skeleton class="h-6 w-full" /></TableCell>
                <TableCell><Skeleton class="h-6 w-full" /></TableCell>
              </TableRow>
            </template>

            <!-- Data Display -->
            <template v-else-if="proposals.length > 0">
              <TableRow
                v-for="proposal in proposals"
                :key="proposal.id"
                :data-state="selectedProposalId === proposal.id && 'selected'"
              >
                <TableCell>
                  <RadioGroupItem
                    :id="`r-${proposal.id}`"
                    :value="proposal.id"
                  />
                </TableCell>
                <TableCell class="font-medium">{{ proposal.id }}</TableCell>
                <TableCell>{{ proposal.short_title }}</TableCell>
                <TableCell>{{ proposal.long_title }}</TableCell>
              </TableRow>
            </template>

            <!-- Empty State -->
            <template v-else>
              <TableRow>
                <TableCell :colspan="4" class="h-24 text-center">
                  No proposals found.
                </TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
      </RadioGroup>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
// <-- Added lang="ts" here
import { ref, onMounted, computed } from "vue";

// Import UI components
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RefreshCcw } from "lucide-vue-next";

// --- TYPES ---
// Define a type for the proposal object for strong type safety.
interface Proposal {
  id: string | number;
  long_title: string;
  short_title: string;
  original_title: string;
}

// --- STATE ---
// Provide explicit types for the reactive state.
const selectedProposalId = ref<string | number | null>(null);
const proposals = ref<Proposal[]>([]);
const isLoading = ref(false);

// --- COMPUTED PROPERTY FOR SELECTED PROPOSAL ---
// TypeScript can now correctly infer the return type as ComputedRef<Proposal | undefined>
const selectedProposal = computed(() => {
  if (!selectedProposalId.value) return undefined;
  return proposals.value.find((p) => p.id === selectedProposalId.value);
});

// --- DATA FETCHING ---
const { $directus } = useNuxtApp();

async function fetchProposals() {
  isLoading.value = true;
  try {
    // The fetched data will be validated against the Proposal type.
    const data = await $directus.query<{ proposals: Proposal[] }>(`
      query {
        proposals {
          id
          long_title
          short_title
          original_title
        }
      }
    `);
    if (data) {
      proposals.value = data.proposals;
    }
  } catch (error) {
    console.error("An error occurred while fetching proposals:", error);
    proposals.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchProposals();
});

// --- EXPOSE TO PARENT ---
// The exposed property now has a correct type that the parent can understand.
defineExpose({
  selectedProposal,
});
</script>
